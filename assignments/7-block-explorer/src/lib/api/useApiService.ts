/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
  QueryKey,
  InfiniteData,
} from '@tanstack/react-query';
import {
  apiClient,
  apiRequest,
  ApiError,
  PaginatedResponse,
  PaginationParams,
} from '@/lib/api/config';

// Types
export interface ApiServiceOptions<TData = any, TError = ApiError> {
  queryKey: QueryKey;
  url: string;
  params?: Record<string, any>;
  config?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>;
  enabled?: boolean;
}

export interface InfiniteApiServiceOptions<TData = any, TError = ApiError> {
  queryKey: QueryKey;
  url: string;
  params?: Record<string, any>;
  config?: Omit<
    UseInfiniteQueryOptions<TData, TError>,
    'queryKey' | 'queryFn' | 'initialPageParam'
  >;
  getNextPageParam?: (lastPage: TData, allPages: TData[]) => any;
  pageSize?: number;
}

export interface MutationServiceOptions<
  TData = any,
  TVariables = any,
  TError = ApiError
> {
  mutationKey?: QueryKey;
  url?: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  config?: Omit<
    UseMutationOptions<TData, TError, TVariables>,
    'mutationKey' | 'mutationFn'
  >;
  invalidateQueries?: QueryKey | QueryKey[];
  onSuccessMessage?: string;
  onErrorMessage?: string;
}

// Base query hook factory
export function createApiService<TData = any, TError = ApiError>(
  defaultOptions: Partial<ApiServiceOptions<TData, TError>> = {}
) {
  return (options: ApiServiceOptions<TData, TError>) => {
    const mergedOptions = { ...defaultOptions, ...options };

    return useQuery<TData, TError>({
      queryKey: mergedOptions.queryKey,
      queryFn: async () => {
        const response = await apiClient.get(mergedOptions.url, {
          params: mergedOptions.params,
        });
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 10 * 60 * 1000, // 10 minutes cache time
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          // Don't retry on rate limits or client errors
          if (
            error.status === 429 ||
            (error.status >= 400 && error.status < 500)
          ) {
            return false;
          }
        }
        return failureCount < 3;
      },
      ...mergedOptions.config,
    });
  };
}

// Base infinite query hook factory
export function createInfiniteApiService<TData = any, TError = ApiError>(
  defaultOptions: Partial<InfiniteApiServiceOptions<TData, TError>> = {}
) {
  return (options: InfiniteApiServiceOptions<TData, TError>) => {
    const mergedOptions = { ...defaultOptions, ...options };

    return useInfiniteQuery<TData, TError>({
      queryKey: mergedOptions.queryKey,
      queryFn: async ({ pageParam = 1 }) => {
        const response = await apiClient.get(mergedOptions.url, {
          params: {
            ...mergedOptions.params,
            page: pageParam,
            offset: (pageParam - 1) * (mergedOptions.pageSize || 10),
          },
        });
        return response.data;
      },
      initialPageParam: 1,
      getNextPageParam:
        mergedOptions.getNextPageParam ||
        ((lastPage: any) => {
          if (lastPage?.result?.length === 0) return undefined;
          return undefined;
        }),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      ...mergedOptions.config,
    });
  };
}

// Base mutation hook factory
export function createMutationService<
  TData = any,
  TVariables = any,
  TError = ApiError
>(
  defaultOptions: Partial<
    MutationServiceOptions<TData, TVariables, TError>
  > = {}
) {
  return (options: MutationServiceOptions<TData, TVariables, TError> = {}) => {
    const queryClient = useQueryClient();
    const mergedOptions = { ...defaultOptions, ...options };

    return useMutation<TData, TError, TVariables>({
      mutationKey: mergedOptions.mutationKey,
      mutationFn: async (variables) => {
        const response = await apiClient({
          method: mergedOptions.method || 'POST',
          url: mergedOptions.url,
          data: variables,
        });
        return response.data;
      },
      onSuccess: async (data, variables, onMutateResult, context) => {
        // Invalidate related queries
        if (mergedOptions.invalidateQueries) {
          const queries = Array.isArray(mergedOptions.invalidateQueries)
            ? mergedOptions.invalidateQueries
            : [mergedOptions.invalidateQueries];

          queries.forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey });
          });
        }

        // Call custom onSuccess if provided
        if (mergedOptions.config?.onSuccess) {
          mergedOptions.config.onSuccess(
            data,
            variables,
            onMutateResult,
            context
          );
        }
      },
      ...mergedOptions.config,
    });
  };
}

// Utility hooks
export function useApiService() {
  const queryClient = useQueryClient();

  return {
    // Query operations
    useQuery: createApiService(),
    useInfiniteQuery: createInfiniteApiService(),
    useMutation: createMutationService(),

    // Cache operations
    invalidateQueries: (queryKey: QueryKey) =>
      queryClient.invalidateQueries({ queryKey }),

    resetQueries: (queryKey: QueryKey) =>
      queryClient.resetQueries({ queryKey }),

    cancelQueries: (queryKey: QueryKey) =>
      queryClient.cancelQueries({ queryKey }),

    // Data operations
    setQueryData: <TData>(queryKey: QueryKey, data: TData) =>
      queryClient.setQueryData(queryKey, data),

    getQueryData: <TData>(queryKey: QueryKey) =>
      queryClient.getQueryData<TData>(queryKey),

    // Optimistic updates
    optimisticUpdate: <TData>(
      queryKey: QueryKey,
      updater: (oldData: TData | undefined) => TData
    ) => {
      queryClient.setQueryData(queryKey, updater);
    },
  };
}

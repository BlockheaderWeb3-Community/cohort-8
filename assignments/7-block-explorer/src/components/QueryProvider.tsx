'use client';

import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense, useState } from 'react';
import { ApiError, RateLimitError } from '@/lib/api/config';

interface QueryProviderProps {
  children: React.ReactNode;
}

// Global query client configuration
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
          if (error instanceof RateLimitError) {
            return false; // Don't retry rate limits
          }
          if (
            error instanceof ApiError &&
            error.status >= 400 &&
            error.status < 500
          ) {
            return false; // Don't retry client errors
          }
          return failureCount < 2; // Retry others twice
        },
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

// Error fallback component
function QueryErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const isRateLimit = error instanceof RateLimitError;
  const isApiError = error instanceof ApiError;

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        {isRateLimit ? 'Rate Limit Exceeded' : 'Error Loading Data'}
      </h3>
      <p className="text-red-600 mb-4">
        {isApiError ? error.message : 'An unexpected error occurred'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
        {isRateLimit && (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Reload Page
          </button>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function QueryLoadingFallback() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4"></div>
      <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
    </div>
  );
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <QueryErrorFallback
                error={error}
                resetErrorBoundary={resetErrorBoundary}
              />
            )}
          >
            <Suspense fallback={<QueryLoadingFallback />}>{children}</Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

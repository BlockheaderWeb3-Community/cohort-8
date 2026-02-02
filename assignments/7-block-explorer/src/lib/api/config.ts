import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Environment configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_ETHERSCAN_BASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

if (!API_KEY && process.env.NEXT_PUBLIC_ETHERSCAN_NODE_ENV === 'production') {
  console.warn(
    'Etherscan API key is not configured. Some features may be limited.'
  );
}

// API endpoints
export const API_ENDPOINTS = {
  // Account
  ACCOUNT_BALANCE: '',
  ACCOUNT_TRANSACTIONS: '',
  ACCOUNT_INTERNAL_TXS: '',
  ACCOUNT_TOKEN_TRANSFERS: '',
  ACCOUNT_NFT_TRANSFERS: '',

  // Transactions
  TRANSACTION_INFO: '',
  TRANSACTION_RECEIPT: '',

  // Blocks
  BLOCK_INFO: '',
  BLOCK_REWARD: '',
  BLOCK_COUNTDOWN: '',

  // Tokens
  TOKEN_INFO: '',
  TOKEN_SUPPLY: '',
  TOKEN_BALANCE: '',

  // Gas Tracker
  GAS_ESTIMATE: '',
  GAS_ORACLE: '',

  // Stats
  ETH_PRICE: '',
  ETH_SUPPLY: '',
  ETH2_SUPPLY: '',
  NETWORK_STATS: '',

  // Contract
  CONTRACT_ABI: '',
  CONTRACT_SOURCE: '',
  VERIFY_CONTRACT: '',

  // Pro endpoints
  HISTORICAL_BLOCKS: '',
  DAILY_TX_COUNT: '',
  DAILY_NETWORK_UTIL: '',
} as const;

// Custom error types
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message = 'Rate limit exceeded') {
    super(429, 'RATE_LIMIT_EXCEEDED', message);
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error') {
    super(0, 'NETWORK_ERROR', message);
    this.name = 'NetworkError';
  }
}

// Request/Response types
export interface PaginatedResponse<T> {
  status: '1' | '0';
  message: string;
  result: T[];
  page?: number;
  offset?: number;
  total?: number;
}

export interface ApiResponse<T> {
  status: '1' | '0';
  message: string;
  result: T;
}

export interface PaginationParams {
  page?: number;
  offset?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
}

export interface EtherscanParams extends Record<string, any> {
  module: string;
  action: string;
  apikey?: string;
}

// Base API client
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add API key to all requests
    if (API_KEY) {
      config.params = {
        ...config.params,
      };
    }

    // Add timestamp for cache busting if needed
    if (config.method === 'get') {
      config.params = {
        ...config.params,
      };
    }

    const jsonrpcConfig = {
      ...config,
      jsonrpc: '2.0',
    };

    return jsonrpcConfig;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle Etherscan API error format
    if (response.data.status === '0') {
      const errorMessage = response.data.message || 'API error occurred';
      const errorCode =
        response.data.result?.toString().toUpperCase() || 'UNKNOWN_ERROR';

      if (errorMessage.includes('rate limit')) {
        throw new RateLimitError(errorMessage);
      }

      throw new ApiError(
        response.status,
        errorCode,
        errorMessage,
        response.data
      );
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      throw new ApiError(
        error.response.status,
        'HTTP_ERROR',
        error.message,
        error.response.data
      );
    } else if (error.request) {
      // Request made but no response
      throw new NetworkError(
        'No response from server. Please check your connection.'
      );
    } else {
      // Something else happened
      throw new ApiError(0, 'REQUEST_ERROR', error.message);
    }
  }
);

// Helper function to make API calls
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'UNKNOWN_ERROR', 'An unknown error occurred');
  }
}

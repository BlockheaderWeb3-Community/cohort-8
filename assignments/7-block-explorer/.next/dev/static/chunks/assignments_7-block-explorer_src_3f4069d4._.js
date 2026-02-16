(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/assignments/7-block-explorer/src/lib/api/config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_ENDPOINTS",
    ()=>API_ENDPOINTS,
    "ApiError",
    ()=>ApiError,
    "NetworkError",
    ()=>NetworkError,
    "RateLimitError",
    ()=>RateLimitError,
    "apiClient",
    ()=>apiClient,
    "apiRequest",
    ()=>apiRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
// Environment configuration
const API_BASE_URL = ("TURBOPACK compile-time value", "https://ethereum-rpc.publicnode.com") || '';
const API_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const API_ENDPOINTS = {
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
    DAILY_NETWORK_UTIL: ''
};
class ApiError extends Error {
    status;
    code;
    data;
    constructor(status, code, message, data){
        super(message), this.status = status, this.code = code, this.data = data;
        this.name = 'ApiError';
    }
}
class RateLimitError extends ApiError {
    constructor(message = 'Rate limit exceeded'){
        super(429, 'RATE_LIMIT_EXCEEDED', message);
        this.name = 'RateLimitError';
    }
}
class NetworkError extends ApiError {
    constructor(message = 'Network error'){
        super(0, 'NETWORK_ERROR', message);
        this.name = 'NetworkError';
    }
}
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});
// Request interceptor
apiClient.interceptors.request.use((config)=>{
    // Add API key to all requests
    if (API_KEY) {
        config.params = {
            ...config.params
        };
    }
    // Add timestamp for cache busting if needed
    if (config.method === 'get') {
        config.params = {
            ...config.params
        };
    }
    const jsonrpcConfig = {
        ...config,
        jsonrpc: '2.0'
    };
    return jsonrpcConfig;
}, (error)=>Promise.reject(error));
// Response interceptor
apiClient.interceptors.response.use((response)=>{
    // Handle Etherscan API error format
    if (response.data.status === '0') {
        const errorMessage = response.data.message || 'API error occurred';
        const errorCode = response.data.result?.toString().toUpperCase() || 'UNKNOWN_ERROR';
        if (errorMessage.includes('rate limit')) {
            throw new RateLimitError(errorMessage);
        }
        throw new ApiError(response.status, errorCode, errorMessage, response.data);
    }
    return response;
}, (error)=>{
    if (error.response) {
        // Server responded with error
        throw new ApiError(error.response.status, 'HTTP_ERROR', error.message, error.response.data);
    } else if (error.request) {
        // Request made but no response
        throw new NetworkError('No response from server. Please check your connection.');
    } else {
        // Something else happened
        throw new ApiError(0, 'REQUEST_ERROR', error.message);
    }
});
async function apiRequest(config) {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider,
    "createQueryClient",
    ()=>createQueryClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryErrorResetBoundary$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query-devtools/build/modern/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$react$2d$error$2d$boundary$2f$dist$2f$react$2d$error$2d$boundary$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/react-error-boundary/dist/react-error-boundary.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/api/config.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function createQueryClient() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                // 5 minutes
                gcTime: 10 * 60 * 1000,
                // 10 minutes
                retry: (failureCount, error)=>{
                    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RateLimitError"]) {
                        return false; // Don't retry rate limits
                    }
                    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"] && error.status >= 400 && error.status < 500) {
                        return false; // Don't retry client errors
                    }
                    return failureCount < 2; // Retry others twice
                },
                refetchOnWindowFocus: ("TURBOPACK compile-time value", "development") === 'production',
                refetchOnReconnect: true,
                refetchOnMount: true
            },
            mutations: {
                retry: 1
            }
        }
    });
}
// Error fallback component
function QueryErrorFallback(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "f76d3a1db808a368e08fdb2c81a91f6a794dab16b7ec290a54dbf78ed7da6b20") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f76d3a1db808a368e08fdb2c81a91f6a794dab16b7ec290a54dbf78ed7da6b20";
    }
    const { error, resetErrorBoundary } = t0;
    const isRateLimit = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RateLimitError"];
    const isApiError = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"];
    const t1 = isRateLimit ? "Rate Limit Exceeded" : "Error Loading Data";
    let t2;
    if ($[1] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-semibold text-red-800 mb-2",
            children: t1
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
            lineNumber: 60,
            columnNumber: 10
        }, this);
        $[1] = t1;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const t3 = isApiError ? error.message : "An unexpected error occurred";
    let t4;
    if ($[3] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-red-600 mb-4",
            children: t3
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
            lineNumber: 69,
            columnNumber: 10
        }, this);
        $[3] = t3;
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    let t5;
    if ($[5] !== resetErrorBoundary) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: resetErrorBoundary,
            className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
            children: "Try Again"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
            lineNumber: 77,
            columnNumber: 10
        }, this);
        $[5] = resetErrorBoundary;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    let t6;
    if ($[7] !== isRateLimit) {
        t6 = isRateLimit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: _QueryErrorFallbackButtonOnClick,
            className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700",
            children: "Reload Page"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
            lineNumber: 85,
            columnNumber: 25
        }, this);
        $[7] = isRateLimit;
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    let t7;
    if ($[9] !== t5 || $[10] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3",
            children: [
                t5,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
            lineNumber: 93,
            columnNumber: 10
        }, this);
        $[9] = t5;
        $[10] = t6;
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    let t8;
    if ($[12] !== t2 || $[13] !== t4 || $[14] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 bg-red-50 border border-red-200 rounded-lg",
            children: [
                t2,
                t4,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
            lineNumber: 102,
            columnNumber: 10
        }, this);
        $[12] = t2;
        $[13] = t4;
        $[14] = t7;
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    return t8;
}
_c = QueryErrorFallback;
// Loading fallback component
function _QueryErrorFallbackButtonOnClick() {
    return window.location.reload();
}
function QueryLoadingFallback() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "f76d3a1db808a368e08fdb2c81a91f6a794dab16b7ec290a54dbf78ed7da6b20") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f76d3a1db808a368e08fdb2c81a91f6a794dab16b7ec290a54dbf78ed7da6b20";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-8 bg-gray-200 animate-pulse rounded w-1/4"
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
                    lineNumber: 127,
                    columnNumber: 37
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-64 bg-gray-200 animate-pulse rounded"
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
                    lineNumber: 127,
                    columnNumber: 100
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
            lineNumber: 127,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c1 = QueryLoadingFallback;
function QueryProvider(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "f76d3a1db808a368e08fdb2c81a91f6a794dab16b7ec290a54dbf78ed7da6b20") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "f76d3a1db808a368e08fdb2c81a91f6a794dab16b7ec290a54dbf78ed7da6b20";
    }
    const { children } = t0;
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(_QueryProviderUseState);
    let t1;
    if ($[1] !== children) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryErrorResetBoundary$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryErrorResetBoundary"], {
            children: (t2)=>{
                const { reset } = t2;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$react$2d$error$2d$boundary$2f$dist$2f$react$2d$error$2d$boundary$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
                    onReset: reset,
                    fallbackRender: _QueryProviderAnonymousErrorBoundaryFallbackRender,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QueryLoadingFallback, {}, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
                            lineNumber: 152,
                            columnNumber: 135
                        }, void 0),
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
                        lineNumber: 152,
                        columnNumber: 115
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
                    lineNumber: 152,
                    columnNumber: 16
                }, this);
            }
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
            lineNumber: 148,
            columnNumber: 10
        }, this);
        $[1] = children;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactQueryDevtools"], {
            initialIsOpen: false,
            position: "bottom-right"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
            lineNumber: 161,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== queryClient || $[5] !== t1) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: queryClient,
            children: [
                t1,
                t2
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
            lineNumber: 168,
            columnNumber: 10
        }, this);
        $[4] = queryClient;
        $[5] = t1;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    return t3;
}
_s(QueryProvider, "0C9cZBrJebEGOHgNahhDk1PI7/o=");
_c2 = QueryProvider;
function _QueryProviderAnonymousErrorBoundaryFallbackRender(t0) {
    const { error, resetErrorBoundary } = t0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QueryErrorFallback, {
        error: error,
        resetErrorBoundary: resetErrorBoundary
    }, void 0, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/QueryProvider.tsx",
        lineNumber: 182,
        columnNumber: 10
    }, this);
}
function _QueryProviderUseState() {
    return createQueryClient();
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "QueryErrorFallback");
__turbopack_context__.k.register(_c1, "QueryLoadingFallback");
__turbopack_context__.k.register(_c2, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=assignments_7-block-explorer_src_3f4069d4._.js.map
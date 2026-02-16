module.exports = [
"[project]/assignments/7-block-explorer/src/lib/api/useApiService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createApiService",
    ()=>createApiService,
    "createInfiniteApiService",
    ()=>createInfiniteApiService,
    "createMutationService",
    ()=>createMutationService,
    "useApiService",
    ()=>useApiService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useInfiniteQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/useInfiniteQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/api/config.ts [app-ssr] (ecmascript)");
/* eslint-disable @typescript-eslint/no-explicit-any */ 'use client';
;
;
function createApiService(defaultOptions = {}) {
    return (options)=>{
        const mergedOptions = {
            ...defaultOptions,
            ...options
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
            queryKey: mergedOptions.queryKey,
            queryFn: async ()=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(mergedOptions.url, {
                    params: mergedOptions.params
                });
                return response.data;
            },
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: (failureCount, error)=>{
                if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ApiError"]) {
                    // Don't retry on rate limits or client errors
                    if (error.status === 429 || error.status >= 400 && error.status < 500) {
                        return false;
                    }
                }
                return failureCount < 3;
            },
            ...mergedOptions.config
        });
    };
}
function createInfiniteApiService(defaultOptions = {}) {
    return (options)=>{
        const mergedOptions = {
            ...defaultOptions,
            ...options
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useInfiniteQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInfiniteQuery"])({
            queryKey: mergedOptions.queryKey,
            queryFn: async ({ pageParam = 1 })=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get(mergedOptions.url, {
                    params: {
                        ...mergedOptions.params,
                        page: pageParam,
                        offset: (pageParam - 1) * (mergedOptions.pageSize || 10)
                    }
                });
                return response.data;
            },
            initialPageParam: 1,
            getNextPageParam: mergedOptions.getNextPageParam || ((lastPage)=>{
                if (lastPage?.result?.length === 0) return undefined;
                return undefined;
            }),
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            ...mergedOptions.config
        });
    };
}
function createMutationService(defaultOptions = {}) {
    return (options = {})=>{
        const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
        const mergedOptions = {
            ...defaultOptions,
            ...options
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationKey: mergedOptions.mutationKey,
            mutationFn: async (variables)=>{
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"])({
                    method: mergedOptions.method || 'POST',
                    url: mergedOptions.url,
                    data: variables
                });
                return response.data;
            },
            onSuccess: async (data, variables, onMutateResult, context)=>{
                // Invalidate related queries
                if (mergedOptions.invalidateQueries) {
                    const queries = Array.isArray(mergedOptions.invalidateQueries) ? mergedOptions.invalidateQueries : [
                        mergedOptions.invalidateQueries
                    ];
                    queries.forEach((queryKey)=>{
                        queryClient.invalidateQueries({
                            queryKey
                        });
                    });
                }
                // Call custom onSuccess if provided
                if (mergedOptions.config?.onSuccess) {
                    mergedOptions.config.onSuccess(data, variables, onMutateResult, context);
                }
            },
            ...mergedOptions.config
        });
    };
}
function useApiService() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return {
        // Query operations
        useQuery: createApiService(),
        useInfiniteQuery: createInfiniteApiService(),
        useMutation: createMutationService(),
        // Cache operations
        invalidateQueries: (queryKey)=>queryClient.invalidateQueries({
                queryKey
            }),
        resetQueries: (queryKey)=>queryClient.resetQueries({
                queryKey
            }),
        cancelQueries: (queryKey)=>queryClient.cancelQueries({
                queryKey
            }),
        // Data operations
        setQueryData: (queryKey, data)=>queryClient.setQueryData(queryKey, data),
        getQueryData: (queryKey)=>queryClient.getQueryData(queryKey),
        // Optimistic updates
        optimisticUpdate: (queryKey, updater)=>{
            queryClient.setQueryData(queryKey, updater);
        }
    };
}
}),
"[project]/assignments/7-block-explorer/src/constant.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ETH_BLOCK_NUMBER",
    ()=>ETH_BLOCK_NUMBER,
    "ETH_GET_BLOCK_BY_NUMBER",
    ()=>ETH_GET_BLOCK_BY_NUMBER
]);
const ETH_BLOCK_NUMBER = 'eth_blockNumber';
const ETH_GET_BLOCK_BY_NUMBER = 'eth_getBlockByNumber';
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/assignments/7-block-explorer/src/lib/useBlockDetails.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* eslint-disable @typescript-eslint/no-explicit-any */ var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/api/useApiService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$constant$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/constant.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/navigation.js [app-ssr] (ecmascript)");
;
;
;
;
const useBlockDetails = ()=>{
    const { useMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApiService"])();
    const { blockNumber } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const [blockDetails, setBlockDetails] = __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(null);
    const { mutateAsync: fetchBlockByNumber, isPending: isFetchingBlockByNumber } = useMutation({});
    const handleGetBlockDetails = async ()=>{
        const blockData = await fetchBlockByNumber({
            method: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$constant$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ETH_GET_BLOCK_BY_NUMBER"],
            params: [
                blockNumber,
                true
            ],
            id: 84
        });
        setBlockDetails(blockData?.result);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        handleGetBlockDetails();
    }, []);
    return {
        blockDetails,
        isFetchingBlockByNumber
    };
};
const __TURBOPACK__default__export__ = useBlockDetails;
}),
"[project]/assignments/7-block-explorer/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatGasPrice",
    ()=>formatGasPrice,
    "formatNumber",
    ()=>formatNumber,
    "hexToDecimal",
    ()=>hexToDecimal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatNumber(num) {
    const n = typeof num === 'string' ? parseFloat(num.replace(/[^0-9.-]+/g, '')) : num;
    if (n >= 1000000000) {
        return (n / 1000000000).toFixed(2) + 'B';
    }
    if (n >= 1000000) {
        return (n / 1000000).toFixed(2) + 'M';
    }
    if (n >= 1000) {
        return (n / 1000).toFixed(2) + 'K';
    }
    return n.toString();
}
function formatGasPrice(gwei) {
    if (gwei < 0.001) {
        return '< 0.001 Gwei';
    }
    return `${gwei.toFixed(3)} Gwei`;
}
function hexToDecimal(hex) {
    return parseInt(hex, 16);
}
}),
"[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlockDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useBlockDetails$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/useBlockDetails.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function BlockDetailPage() {
    const { blockDetails, isFetchingBlockByNumber, blockNumber, finalizedBlockNumber } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useBlockDetails$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])();
    console.log('Block Details:', blockDetails);
    if (isFetchingBlockByNumber) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center h-64",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "w-8 h-8 animate-spin text-blue-600"
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this);
    }
    const baseFeePerGas = (baseFeePerGas)=>{
        const RewardInGwei = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hexToDecimal"])(baseFeePerGas) / 1e18;
        return RewardInGwei.toFixed(18) + ' ETH';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold",
                children: [
                    "Block #",
                    blockNumber
                ]
            }, void 0, true, {
                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-1",
                                children: "Block Height:"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-2",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.number)
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-1",
                                children: "Timestamp:"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-2",
                                children: [
                                    ' ',
                                    new Date((0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.timestamp) * 1000).toLocaleString()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-1",
                                children: "Status:"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-2",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.number) < finalizedBlockNumber ? 'finalized' : 'Unfinalized'
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-1",
                                children: "Total difficulty:"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-2",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.difficulty)
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-1",
                                children: "Withdrawals:"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-2",
                                children: [
                                    blockDetails?.withdrawals?.length,
                                    " withdrawals in this block"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-1",
                                children: "Fee recipient:"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-2",
                                children: blockDetails?.miner
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-1",
                                children: "Size:"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-2",
                                children: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.size)?.toLocaleString(),
                                    " bytes"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-1",
                                children: "Gas Used:"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-2",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.gasUsed)?.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-1",
                                children: "Gas Limit:"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-2",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.gasLimit)?.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-row items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-1",
                                children: "Base Fee Per Gas:"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex-2",
                                children: baseFeePerGas((0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.baseFeePerGas))
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__27d5c0ce._.js.map
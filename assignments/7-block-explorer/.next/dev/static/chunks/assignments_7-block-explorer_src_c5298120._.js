(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/assignments/7-block-explorer/src/lib/api/useApiService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useInfiniteQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/useInfiniteQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/api/config.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
/* eslint-disable @typescript-eslint/no-explicit-any */ 'use client';
;
;
;
function createApiService(defaultOptions = {}) {
    var _s = __turbopack_context__.k.signature();
    return _s((options)=>{
        _s();
        const mergedOptions = {
            ...defaultOptions,
            ...options
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
            queryKey: mergedOptions.queryKey,
            queryFn: {
                "createApiService.useQuery": async ()=>{
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(mergedOptions.url, {
                        params: mergedOptions.params
                    });
                    return response.data;
                }
            }["createApiService.useQuery"],
            staleTime: 5 * 60 * 1000,
            // 5 minutes default
            gcTime: 10 * 60 * 1000,
            // 10 minutes cache time
            retry: {
                "createApiService.useQuery": (failureCount, error)=>{
                    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"]) {
                        // Don't retry on rate limits or client errors
                        if (error.status === 429 || error.status >= 400 && error.status < 500) {
                            return false;
                        }
                    }
                    return failureCount < 3;
                }
            }["createApiService.useQuery"],
            ...mergedOptions.config
        });
    }, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
        ];
    });
}
function createInfiniteApiService(defaultOptions = {}) {
    var _s = __turbopack_context__.k.signature();
    return _s((options)=>{
        _s();
        const mergedOptions = {
            ...defaultOptions,
            ...options
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useInfiniteQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInfiniteQuery"])({
            queryKey: mergedOptions.queryKey,
            queryFn: {
                "createInfiniteApiService.useInfiniteQuery": async ({ pageParam = 1 })=>{
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].get(mergedOptions.url, {
                        params: {
                            ...mergedOptions.params,
                            page: pageParam,
                            offset: (pageParam - 1) * (mergedOptions.pageSize || 10)
                        }
                    });
                    return response.data;
                }
            }["createInfiniteApiService.useInfiniteQuery"],
            initialPageParam: 1,
            getNextPageParam: mergedOptions.getNextPageParam || ({
                "createInfiniteApiService.useInfiniteQuery": (lastPage)=>{
                    if (lastPage?.result?.length === 0) return undefined;
                    return undefined;
                }
            })["createInfiniteApiService.useInfiniteQuery"],
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            ...mergedOptions.config
        });
    }, "xMCOiuh9cV5e8gBi6hogZoGnISk=", false, function() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useInfiniteQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInfiniteQuery"]
        ];
    });
}
function createMutationService(defaultOptions = {}) {
    var _s = __turbopack_context__.k.signature();
    return _s((options = {})=>{
        _s();
        const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
        const mergedOptions = {
            ...defaultOptions,
            ...options
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationKey: mergedOptions.mutationKey,
            mutationFn: {
                "createMutationService.useMutation": async (variables)=>{
                    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"])({
                        method: mergedOptions.method || 'POST',
                        url: mergedOptions.url,
                        data: variables
                    });
                    return response.data;
                }
            }["createMutationService.useMutation"],
            onSuccess: {
                "createMutationService.useMutation": async (data, variables, onMutateResult, context)=>{
                    // Invalidate related queries
                    if (mergedOptions.invalidateQueries) {
                        const queries = Array.isArray(mergedOptions.invalidateQueries) ? mergedOptions.invalidateQueries : [
                            mergedOptions.invalidateQueries
                        ];
                        queries.forEach({
                            "createMutationService.useMutation": (queryKey)=>{
                                queryClient.invalidateQueries({
                                    queryKey
                                });
                            }
                        }["createMutationService.useMutation"]);
                    }
                    // Call custom onSuccess if provided
                    if (mergedOptions.config?.onSuccess) {
                        mergedOptions.config.onSuccess(data, variables, onMutateResult, context);
                    }
                }
            }["createMutationService.useMutation"],
            ...mergedOptions.config
        });
    }, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
            __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
        ];
    });
}
function useApiService() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "a8efbc0b07bf029ae19113e97cec5da111e2ad55b4c31ddf4af92e5e7510bea8") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a8efbc0b07bf029ae19113e97cec5da111e2ad55b4c31ddf4af92e5e7510bea8";
    }
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    let t0;
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = createApiService();
        t1 = createInfiniteApiService();
        t2 = createMutationService();
        $[1] = t0;
        $[2] = t1;
        $[3] = t2;
    } else {
        t0 = $[1];
        t1 = $[2];
        t2 = $[3];
    }
    let t3;
    if ($[4] !== queryClient) {
        t3 = {
            useQuery: t0,
            useInfiniteQuery: t1,
            useMutation: t2,
            invalidateQueries: (queryKey)=>queryClient.invalidateQueries({
                    queryKey
                }),
            resetQueries: (queryKey_0)=>queryClient.resetQueries({
                    queryKey: queryKey_0
                }),
            cancelQueries: (queryKey_1)=>queryClient.cancelQueries({
                    queryKey: queryKey_1
                }),
            setQueryData: (queryKey_2, data)=>queryClient.setQueryData(queryKey_2, data),
            getQueryData: (queryKey_3)=>queryClient.getQueryData(queryKey_3),
            optimisticUpdate: (queryKey_4, updater)=>{
                queryClient.setQueryData(queryKey_4, updater);
            }
        };
        $[4] = queryClient;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    return t3;
}
_s(useApiService, "4R+oYVB2Uc11P7bp1KcuhpkfaTw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/assignments/7-block-explorer/src/constant.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ETH_BLOCK_NUMBER",
    ()=>ETH_BLOCK_NUMBER,
    "ETH_GET_BLOCK_BY_NUMBER",
    ()=>ETH_GET_BLOCK_BY_NUMBER
]);
const ETH_BLOCK_NUMBER = 'eth_blockNumber';
const ETH_GET_BLOCK_BY_NUMBER = 'eth_getBlockByNumber';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/assignments/7-block-explorer/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatGasPrice",
    ()=>formatGasPrice,
    "formatNumber",
    ()=>formatNumber,
    "hexToDecimal",
    ()=>hexToDecimal,
    "timeAgo",
    ()=>timeAgo
]);
/* eslint-disable @typescript-eslint/no-explicit-any */ var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
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
function timeAgo(timestampInSeconds) {
    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const diff = now - timestampInSeconds;
    if (diff < 60) return `${diff} secs ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/assignments/7-block-explorer/src/lib/useBlockDetails.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* eslint-disable @typescript-eslint/no-explicit-any */ var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/api/useApiService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$constant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/constant.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/utils.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const useBlockDetails = ()=>{
    _s();
    const { useMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiService"])();
    const { blockNumber } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const [blockDetails, setBlockDetails] = __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [finalizedBlockNumber, setFinalizedBlockNumber] = __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    const { mutateAsync: fetchBlockByNumber, isPending: isFetchingBlockByNumber } = useMutation({});
    const handleGetBlockDetails = async ()=>{
        const blockData = await fetchBlockByNumber({
            method: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$constant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_GET_BLOCK_BY_NUMBER"],
            params: [
                blockNumber,
                true
            ],
            id: 84
        });
        setBlockDetails(blockData?.result);
    };
    const handleGetFinalisedBlock = async ()=>{
        const blockData_0 = await fetchBlockByNumber({
            method: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$constant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_GET_BLOCK_BY_NUMBER"],
            params: [
                'finalized',
                true
            ],
            id: 84
        });
        setFinalizedBlockNumber((0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockData_0?.result?.number));
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBlockDetails.useEffect": ()=>{
            handleGetBlockDetails();
            handleGetFinalisedBlock();
        }
    }["useBlockDetails.useEffect"], []);
    return {
        blockDetails,
        isFetchingBlockByNumber,
        finalizedBlockNumber,
        blockNumber
    };
};
_s(useBlockDetails, "JsPu4J0Bu05AFofnk/qavqEt2Jw=", true, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiService"],
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
const __TURBOPACK__default__export__ = useBlockDetails;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlockDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useBlockDetails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/useBlockDetails.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/* eslint-disable @typescript-eslint/no-explicit-any */ 'use client';
;
;
;
;
;
;
function BlockDetailPage() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(97);
    if ($[0] !== "ae9ea80ac8711338bf56cc8ca1de3c40277eaa5edc0f1dc18b20f15ff843dbf2") {
        for(let $i = 0; $i < 97; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ae9ea80ac8711338bf56cc8ca1de3c40277eaa5edc0f1dc18b20f15ff843dbf2";
    }
    const { blockDetails, isFetchingBlockByNumber, blockNumber, finalizedBlockNumber } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useBlockDetails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    if (isFetchingBlockByNumber) {
        let t0;
        if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
            t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center items-center h-64",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "w-8 h-8 animate-spin text-blue-600"
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 28,
                    columnNumber: 67
                }, this)
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                lineNumber: 28,
                columnNumber: 12
            }, this);
            $[1] = t0;
        } else {
            t0 = $[1];
        }
        return t0;
    }
    const baseFeePerGasInEth = _BlockDetailPageBaseFeePerGasInEth;
    const baseFeePerGasInGwei = _BlockDetailPageBaseFeePerGasInGwei;
    let t0;
    if ($[2] !== router) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
            onClick: {
                "BlockDetailPage[<ChevronLeft>.onClick]": ()=>router.back()
            }["BlockDetailPage[<ChevronLeft>.onClick]"],
            className: "cursor-pointer"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 39,
            columnNumber: 10
        }, this);
        $[2] = router;
        $[3] = t0;
    } else {
        t0 = $[3];
    }
    let t1;
    if ($[4] !== blockNumber) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "font-bold",
            children: [
                "Block #",
                blockNumber
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 49,
            columnNumber: 10
        }, this);
        $[4] = blockNumber;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== t0 || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row gap-3",
            children: [
                t0,
                t1
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 57,
            columnNumber: 10
        }, this);
        $[6] = t0;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    let t3;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Block Height:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 66,
            columnNumber: 10
        }, this);
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    const t4 = blockDetails?.number;
    let t5;
    if ($[10] !== t4) {
        t5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(t4);
        $[10] = t4;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    let t6;
    if ($[12] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t3,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: t5
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 82,
                    columnNumber: 64
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 82,
            columnNumber: 10
        }, this);
        $[12] = t5;
        $[13] = t6;
    } else {
        t6 = $[13];
    }
    let t7;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Timestamp:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 90,
            columnNumber: 10
        }, this);
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    let t8;
    if ($[15] !== blockDetails?.timestamp) {
        t8 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeAgo"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.timestamp));
        $[15] = blockDetails?.timestamp;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    let t9;
    if ($[17] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t7,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: [
                        " ",
                        t8
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 105,
                    columnNumber: 64
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 105,
            columnNumber: 10
        }, this);
        $[17] = t8;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    let t10;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Status:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 113,
            columnNumber: 11
        }, this);
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    const t11 = `text-xs border border-solid w-fit p-1 rounded  ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.number) < finalizedBlockNumber ? "text-green-500 border-green-500" : "text-red-500 border-red-500"} `;
    const t12 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.number) < finalizedBlockNumber ? "Finalized" : "Unfinalized";
    let t13;
    if ($[20] !== t11 || $[21] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t10,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: t11,
                        children: t12
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                        lineNumber: 122,
                        columnNumber: 90
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 122,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 122,
            columnNumber: 11
        }, this);
        $[20] = t11;
        $[21] = t12;
        $[22] = t13;
    } else {
        t13 = $[22];
    }
    let t14;
    if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Total difficulty:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 131,
            columnNumber: 11
        }, this);
        $[23] = t14;
    } else {
        t14 = $[23];
    }
    const t15 = blockDetails?.difficulty;
    let t16;
    if ($[24] !== t15) {
        t16 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(t15);
        $[24] = t15;
        $[25] = t16;
    } else {
        t16 = $[25];
    }
    let t17;
    if ($[26] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t14,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: t16
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 147,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 147,
            columnNumber: 11
        }, this);
        $[26] = t16;
        $[27] = t17;
    } else {
        t17 = $[27];
    }
    let t18;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Withdrawals:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 155,
            columnNumber: 11
        }, this);
        $[28] = t18;
    } else {
        t18 = $[28];
    }
    const t19 = blockDetails?.withdrawals?.length;
    let t20;
    if ($[29] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t18,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: [
                        t19,
                        " withdrawals in this block"
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 163,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 163,
            columnNumber: 11
        }, this);
        $[29] = t19;
        $[30] = t20;
    } else {
        t20 = $[30];
    }
    let t21;
    if ($[31] !== t13 || $[32] !== t17 || $[33] !== t20 || $[34] !== t6 || $[35] !== t9) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 border border-solid border-abstract/20 rounded-lg p-6",
            children: [
                t6,
                t9,
                t13,
                t17,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 171,
            columnNumber: 11
        }, this);
        $[31] = t13;
        $[32] = t17;
        $[33] = t20;
        $[34] = t6;
        $[35] = t9;
        $[36] = t21;
    } else {
        t21 = $[36];
    }
    let t22;
    if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Fee recipient:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 183,
            columnNumber: 11
        }, this);
        $[37] = t22;
    } else {
        t22 = $[37];
    }
    const t23 = blockDetails?.miner;
    let t24;
    if ($[38] !== t23) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t22,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: t23
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 191,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 191,
            columnNumber: 11
        }, this);
        $[38] = t23;
        $[39] = t24;
    } else {
        t24 = $[39];
    }
    let t25;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Size:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 199,
            columnNumber: 11
        }, this);
        $[40] = t25;
    } else {
        t25 = $[40];
    }
    let t26;
    if ($[41] !== blockDetails?.size) {
        t26 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.size)?.toLocaleString();
        $[41] = blockDetails?.size;
        $[42] = t26;
    } else {
        t26 = $[42];
    }
    let t27;
    if ($[43] !== t26) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t25,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: [
                        t26,
                        " bytes"
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 214,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 214,
            columnNumber: 11
        }, this);
        $[43] = t26;
        $[44] = t27;
    } else {
        t27 = $[44];
    }
    let t28;
    if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Gas Used:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 222,
            columnNumber: 11
        }, this);
        $[45] = t28;
    } else {
        t28 = $[45];
    }
    let t29;
    if ($[46] !== blockDetails?.gasUsed) {
        t29 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.gasUsed)?.toLocaleString();
        $[46] = blockDetails?.gasUsed;
        $[47] = t29;
    } else {
        t29 = $[47];
    }
    let t30;
    if ($[48] !== t29) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t28,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: t29
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 237,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 237,
            columnNumber: 11
        }, this);
        $[48] = t29;
        $[49] = t30;
    } else {
        t30 = $[49];
    }
    let t31;
    if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Gas Limit:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 245,
            columnNumber: 11
        }, this);
        $[50] = t31;
    } else {
        t31 = $[50];
    }
    let t32;
    if ($[51] !== blockDetails?.gasLimit) {
        t32 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.gasLimit)?.toLocaleString();
        $[51] = blockDetails?.gasLimit;
        $[52] = t32;
    } else {
        t32 = $[52];
    }
    let t33;
    if ($[53] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t31,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: t32
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 260,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 260,
            columnNumber: 11
        }, this);
        $[53] = t32;
        $[54] = t33;
    } else {
        t33 = $[54];
    }
    let t34;
    if ($[55] === Symbol.for("react.memo_cache_sentinel")) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Base Fee Per Gas:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 268,
            columnNumber: 11
        }, this);
        $[55] = t34;
    } else {
        t34 = $[55];
    }
    let t35;
    if ($[56] !== blockDetails?.baseFeePerGas) {
        t35 = baseFeePerGasInEth((0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.baseFeePerGas));
        $[56] = blockDetails?.baseFeePerGas;
        $[57] = t35;
    } else {
        t35 = $[57];
    }
    let t36;
    if ($[58] !== blockDetails?.baseFeePerGas) {
        t36 = baseFeePerGasInGwei((0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.baseFeePerGas));
        $[58] = blockDetails?.baseFeePerGas;
        $[59] = t36;
    } else {
        t36 = $[59];
    }
    let t37;
    if ($[60] !== t35 || $[61] !== t36) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t34,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: [
                        t35,
                        " (",
                        t36,
                        ")"
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 291,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 291,
            columnNumber: 11
        }, this);
        $[60] = t35;
        $[61] = t36;
        $[62] = t37;
    } else {
        t37 = $[62];
    }
    let t38;
    if ($[63] !== t24 || $[64] !== t27 || $[65] !== t30 || $[66] !== t33 || $[67] !== t37) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 border border-solid border-abstract/20 rounded-lg p-6",
            children: [
                t24,
                t27,
                t30,
                t33,
                t37
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 300,
            columnNumber: 11
        }, this);
        $[63] = t24;
        $[64] = t27;
        $[65] = t30;
        $[66] = t33;
        $[67] = t37;
        $[68] = t38;
    } else {
        t38 = $[68];
    }
    let t39;
    if ($[69] === Symbol.for("react.memo_cache_sentinel")) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Hash:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 312,
            columnNumber: 11
        }, this);
        $[69] = t39;
    } else {
        t39 = $[69];
    }
    const t40 = blockDetails?.hash;
    let t41;
    if ($[70] !== t40) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t39,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: t40
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 320,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 320,
            columnNumber: 11
        }, this);
        $[70] = t40;
        $[71] = t41;
    } else {
        t41 = $[71];
    }
    let t42;
    if ($[72] === Symbol.for("react.memo_cache_sentinel")) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Parent Hash:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 328,
            columnNumber: 11
        }, this);
        $[72] = t42;
    } else {
        t42 = $[72];
    }
    const t43 = blockDetails?.parentHash;
    let t44;
    if ($[73] !== t43) {
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t42,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: t43
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 336,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 336,
            columnNumber: 11
        }, this);
        $[73] = t43;
        $[74] = t44;
    } else {
        t44 = $[74];
    }
    let t45;
    if ($[75] === Symbol.for("react.memo_cache_sentinel")) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "State Root:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 344,
            columnNumber: 11
        }, this);
        $[75] = t45;
    } else {
        t45 = $[75];
    }
    const t46 = blockDetails?.stateRoot;
    let t47;
    if ($[76] !== t46) {
        t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t45,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: t46
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 352,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 352,
            columnNumber: 11
        }, this);
        $[76] = t46;
        $[77] = t47;
    } else {
        t47 = $[77];
    }
    let t48;
    if ($[78] === Symbol.for("react.memo_cache_sentinel")) {
        t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Withdrawals Hash:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 360,
            columnNumber: 11
        }, this);
        $[78] = t48;
    } else {
        t48 = $[78];
    }
    const t49 = blockDetails?.withdrawalsRoot;
    let t50;
    if ($[79] !== t49) {
        t50 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t48,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: t49
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 368,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 368,
            columnNumber: 11
        }, this);
        $[79] = t49;
        $[80] = t50;
    } else {
        t50 = $[80];
    }
    let t51;
    if ($[81] === Symbol.for("react.memo_cache_sentinel")) {
        t51 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-xs text-abstract/50",
            children: "Nonce:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 376,
            columnNumber: 11
        }, this);
        $[81] = t51;
    } else {
        t51 = $[81];
    }
    const t52 = blockDetails?.nonce;
    let t53;
    if ($[82] !== t52) {
        t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t51,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2 text-xs",
                    children: t52
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 384,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 384,
            columnNumber: 11
        }, this);
        $[82] = t52;
        $[83] = t53;
    } else {
        t53 = $[83];
    }
    let t54;
    if ($[84] !== t41 || $[85] !== t44 || $[86] !== t47 || $[87] !== t50 || $[88] !== t53) {
        t54 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-4 border border-solid border-abstract/20 rounded-lg p-6",
            children: [
                t41,
                t44,
                t47,
                t50,
                t53
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 392,
            columnNumber: 11
        }, this);
        $[84] = t41;
        $[85] = t44;
        $[86] = t47;
        $[87] = t50;
        $[88] = t53;
        $[89] = t54;
    } else {
        t54 = $[89];
    }
    let t55;
    if ($[90] !== t21 || $[91] !== t38 || $[92] !== t54) {
        t55 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-6",
            children: [
                t21,
                t38,
                t54
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 404,
            columnNumber: 11
        }, this);
        $[90] = t21;
        $[91] = t38;
        $[92] = t54;
        $[93] = t55;
    } else {
        t55 = $[93];
    }
    let t56;
    if ($[94] !== t2 || $[95] !== t55) {
        t56 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                t2,
                t55
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 414,
            columnNumber: 11
        }, this);
        $[94] = t2;
        $[95] = t55;
        $[96] = t56;
    } else {
        t56 = $[96];
    }
    return t56;
}
_s(BlockDetailPage, "l5m76JCdBft4FmLuRMG7e3P1BSg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useBlockDetails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = BlockDetailPage;
function _BlockDetailPageBaseFeePerGasInGwei(baseFeePerGas_0) {
    const RewardInGwei = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(baseFeePerGas_0) / 1000000000;
    return RewardInGwei.toFixed(18) + " in Gwei";
}
function _BlockDetailPageBaseFeePerGasInEth(baseFeePerGas) {
    const baseFeeInEth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(baseFeePerGas) / 1000000000000000000;
    return baseFeeInEth.toFixed(18) + " ETH";
}
var _c;
__turbopack_context__.k.register(_c, "BlockDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=assignments_7-block-explorer_src_c5298120._.js.map
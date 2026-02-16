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
var _s = __turbopack_context__.k.signature();
;
;
;
;
const useBlockDetails = ()=>{
    _s();
    const { useMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiService"])();
    const { blockNumber } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const [blockDetails, setBlockDetails] = __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBlockDetails.useEffect": ()=>{
            handleGetBlockDetails();
        }
    }["useBlockDetails.useEffect"], []);
    return {
        blockDetails,
        isFetchingBlockByNumber
    };
};
_s(useBlockDetails, "ddka9XgRDBv70nCDqKDo2xdytnE=", true, function() {
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
    ()=>hexToDecimal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
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
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function BlockDetailPage() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(62);
    if ($[0] !== "81097c4efff15c844b68dcfa371d21eac07006c44ec1005c0849f565c2330a18") {
        for(let $i = 0; $i < 62; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "81097c4efff15c844b68dcfa371d21eac07006c44ec1005c0849f565c2330a18";
    }
    const { blockDetails, isFetchingBlockByNumber, blockNumber, finalizedBlockNumber } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useBlockDetails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    console.log("Block Details:", blockDetails);
    if (isFetchingBlockByNumber) {
        let t0;
        if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
            t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center items-center h-64",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "w-8 h-8 animate-spin text-blue-600"
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 25,
                    columnNumber: 67
                }, this)
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                lineNumber: 25,
                columnNumber: 12
            }, this);
            $[1] = t0;
        } else {
            t0 = $[1];
        }
        return t0;
    }
    const baseFeePerGas_0 = _BlockDetailPageBaseFeePerGas_;
    let t0;
    if ($[2] !== blockNumber) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "text-3xl font-bold",
            children: [
                "Block #",
                blockNumber
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 35,
            columnNumber: 10
        }, this);
        $[2] = blockNumber;
        $[3] = t0;
    } else {
        t0 = $[3];
    }
    let t1;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1",
            children: "Block Height:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 43,
            columnNumber: 10
        }, this);
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    const t2 = blockDetails?.number;
    let t3;
    if ($[5] !== t2) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(t2);
        $[5] = t2;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2",
                    children: t3
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 59,
                    columnNumber: 64
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 59,
            columnNumber: 10
        }, this);
        $[7] = t3;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1",
            children: "Timestamp:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 67,
            columnNumber: 10
        }, this);
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] !== blockDetails?.timestamp) {
        t6 = new Date((0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.timestamp) * 1000).toLocaleString();
        $[10] = blockDetails?.timestamp;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t5,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2",
                    children: [
                        " ",
                        t6
                    ]
                }, void 0, true, {
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
        $[12] = t6;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1",
            children: "Status:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 90,
            columnNumber: 10
        }, this);
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    const t9 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.number) < finalizedBlockNumber ? "finalized" : "Unfinalized";
    let t10;
    if ($[15] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t8,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2",
                    children: t9
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 98,
                    columnNumber: 65
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 98,
            columnNumber: 11
        }, this);
        $[15] = t9;
        $[16] = t10;
    } else {
        t10 = $[16];
    }
    let t11;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1",
            children: "Total difficulty:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 106,
            columnNumber: 11
        }, this);
        $[17] = t11;
    } else {
        t11 = $[17];
    }
    const t12 = blockDetails?.difficulty;
    let t13;
    if ($[18] !== t12) {
        t13 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(t12);
        $[18] = t12;
        $[19] = t13;
    } else {
        t13 = $[19];
    }
    let t14;
    if ($[20] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t11,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2",
                    children: t13
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
        $[20] = t13;
        $[21] = t14;
    } else {
        t14 = $[21];
    }
    let t15;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1",
            children: "Withdrawals:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 130,
            columnNumber: 11
        }, this);
        $[22] = t15;
    } else {
        t15 = $[22];
    }
    const t16 = blockDetails?.withdrawals?.length;
    let t17;
    if ($[23] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t15,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2",
                    children: [
                        t16,
                        " withdrawals in this block"
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 138,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 138,
            columnNumber: 11
        }, this);
        $[23] = t16;
        $[24] = t17;
    } else {
        t17 = $[24];
    }
    let t18;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1",
            children: "Fee recipient:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 146,
            columnNumber: 11
        }, this);
        $[25] = t18;
    } else {
        t18 = $[25];
    }
    const t19 = blockDetails?.miner;
    let t20;
    if ($[26] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t18,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2",
                    children: t19
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 154,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 154,
            columnNumber: 11
        }, this);
        $[26] = t19;
        $[27] = t20;
    } else {
        t20 = $[27];
    }
    let t21;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1",
            children: "Size:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 162,
            columnNumber: 11
        }, this);
        $[28] = t21;
    } else {
        t21 = $[28];
    }
    let t22;
    if ($[29] !== blockDetails?.size) {
        t22 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.size)?.toLocaleString();
        $[29] = blockDetails?.size;
        $[30] = t22;
    } else {
        t22 = $[30];
    }
    let t23;
    if ($[31] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t21,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2",
                    children: [
                        t22,
                        " bytes"
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 177,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 177,
            columnNumber: 11
        }, this);
        $[31] = t22;
        $[32] = t23;
    } else {
        t23 = $[32];
    }
    let t24;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1",
            children: "Gas Used:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 185,
            columnNumber: 11
        }, this);
        $[33] = t24;
    } else {
        t24 = $[33];
    }
    let t25;
    if ($[34] !== blockDetails?.gasUsed) {
        t25 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.gasUsed)?.toLocaleString();
        $[34] = blockDetails?.gasUsed;
        $[35] = t25;
    } else {
        t25 = $[35];
    }
    let t26;
    if ($[36] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t24,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2",
                    children: t25
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 200,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 200,
            columnNumber: 11
        }, this);
        $[36] = t25;
        $[37] = t26;
    } else {
        t26 = $[37];
    }
    let t27;
    if ($[38] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1",
            children: "Gas Limit:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 208,
            columnNumber: 11
        }, this);
        $[38] = t27;
    } else {
        t27 = $[38];
    }
    let t28;
    if ($[39] !== blockDetails?.gasLimit) {
        t28 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.gasLimit)?.toLocaleString();
        $[39] = blockDetails?.gasLimit;
        $[40] = t28;
    } else {
        t28 = $[40];
    }
    let t29;
    if ($[41] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t27,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2",
                    children: t28
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 223,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 223,
            columnNumber: 11
        }, this);
        $[41] = t28;
        $[42] = t29;
    } else {
        t29 = $[42];
    }
    let t30;
    if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1",
            children: "Base Fee Per Gas:"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 231,
            columnNumber: 11
        }, this);
        $[43] = t30;
    } else {
        t30 = $[43];
    }
    let t31;
    if ($[44] !== blockDetails?.baseFeePerGas) {
        t31 = baseFeePerGas_0((0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(blockDetails?.baseFeePerGas));
        $[44] = blockDetails?.baseFeePerGas;
        $[45] = t31;
    } else {
        t31 = $[45];
    }
    let t32;
    if ($[46] !== t31) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row items-center gap-6",
            children: [
                t30,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex-2",
                    children: t31
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
                    lineNumber: 246,
                    columnNumber: 66
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 246,
            columnNumber: 11
        }, this);
        $[46] = t31;
        $[47] = t32;
    } else {
        t32 = $[47];
    }
    let t33;
    if ($[48] !== t10 || $[49] !== t14 || $[50] !== t17 || $[51] !== t20 || $[52] !== t23 || $[53] !== t26 || $[54] !== t29 || $[55] !== t32 || $[56] !== t4 || $[57] !== t7) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-6",
            children: [
                t4,
                t7,
                t10,
                t14,
                t17,
                t20,
                t23,
                t26,
                t29,
                t32
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 254,
            columnNumber: 11
        }, this);
        $[48] = t10;
        $[49] = t14;
        $[50] = t17;
        $[51] = t20;
        $[52] = t23;
        $[53] = t26;
        $[54] = t29;
        $[55] = t32;
        $[56] = t4;
        $[57] = t7;
        $[58] = t33;
    } else {
        t33 = $[58];
    }
    let t34;
    if ($[59] !== t0 || $[60] !== t33) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                t0,
                t33
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/blocks/[blockNumber]/page.tsx",
            lineNumber: 271,
            columnNumber: 11
        }, this);
        $[59] = t0;
        $[60] = t33;
        $[61] = t34;
    } else {
        t34 = $[61];
    }
    return t34;
}
_s(BlockDetailPage, "ev4rmKCEscIXWB2reVqaRXI79Dg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useBlockDetails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = BlockDetailPage;
function _BlockDetailPageBaseFeePerGas_(baseFeePerGas) {
    const RewardInGwei = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(baseFeePerGas) / 1000000000000000000;
    return RewardInGwei.toFixed(18) + " ETH";
}
var _c;
__turbopack_context__.k.register(_c, "BlockDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=assignments_7-block-explorer_src_8a144b38._.js.map
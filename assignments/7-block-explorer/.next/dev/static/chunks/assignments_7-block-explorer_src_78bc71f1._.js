(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/assignments/7-block-explorer/src/lib/useEtherscanData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBlockDetails",
    ()=>useBlockDetails,
    "useEthereumStats",
    ()=>useEthereumStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
function useEthereumStats() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "5686ac5260c39f8f9f3666e4a14517311bfc802d98e9a6e6829548a3de2a7bf3") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5686ac5260c39f8f9f3666e4a14517311bfc802d98e9a6e6829548a3de2a7bf3";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {
            queryKey: [
                "ethereum-stats"
            ],
            queryFn: _temp,
            refetchInterval: 10000
        };
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(t0);
}
_s(useEthereumStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
async function _temp() {
    return {
        ethPrice: 2628.88,
        priceChange: -3.57,
        totalTransactions: "3,232.75 M",
        gasPrice: 0.105,
        lastFinalizedBlock: 24354972,
        lastSafeBlock: 24355004,
        tps: 26.1
    };
}
function useBlockDetails(blockNumber) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "5686ac5260c39f8f9f3666e4a14517311bfc802d98e9a6e6829548a3de2a7bf3") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5686ac5260c39f8f9f3666e4a14517311bfc802d98e9a6e6829548a3de2a7bf3";
    }
    let t0;
    let t1;
    if ($[1] !== blockNumber) {
        t0 = [
            "block-details",
            blockNumber
        ];
        t1 = async ()=>{
            if (!blockNumber) {
                throw new Error("Block number required");
            }
            const response = await etherscanApi.get("", {
                params: {
                    module: "proxy",
                    action: "eth_getBlockByNumber",
                    tag: `0x${blockNumber.toString(16)}`,
                    boolean: "true"
                }
            });
            return {
                number: parseInt(response.data.result.number, 16),
                timestamp: parseInt(response.data.result.timestamp, 16) * 1000,
                miner: response.data.result.miner,
                transactions: response.data.result.transactions,
                gasUsed: parseInt(response.data.result.gasUsed, 16).toLocaleString(),
                gasLimit: parseInt(response.data.result.gasLimit, 16).toLocaleString()
            };
        };
        $[1] = blockNumber;
        $[2] = t0;
        $[3] = t1;
    } else {
        t0 = $[2];
        t1 = $[3];
    }
    const t2 = !!blockNumber;
    let t3;
    if ($[4] !== t0 || $[5] !== t1 || $[6] !== t2) {
        t3 = {
            queryKey: t0,
            queryFn: t1,
            enabled: t2
        };
        $[4] = t0;
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(t3);
}
_s1(useBlockDetails, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatsGrid",
    ()=>StatsGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useEtherscanData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/useEtherscanData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/flame.js [app-client] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function StatsGrid() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(22);
    if ($[0] !== "46ce1a21dfb503157440bdceffde9db3935de18ddc6329d58491ac1f9aa9dee5") {
        for(let $i = 0; $i < 22; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "46ce1a21dfb503157440bdceffde9db3935de18ddc6329d58491ac1f9aa9dee5";
    }
    const { data: stats, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useEtherscanData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEthereumStats"])();
    if (isLoading) {
        let t0;
        if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
            t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
                children: [
                    ...Array(4)
                ].map(_StatsGridAnonymous)
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                lineNumber: 21,
                columnNumber: 12
            }, this);
            $[1] = t0;
        } else {
            t0 = $[1];
        }
        return t0;
    }
    const t0 = stats?.totalTransactions || "0";
    const t1 = `${stats?.tps || 0} TPS`;
    let t2;
    if ($[2] !== t0 || $[3] !== t1) {
        t2 = {
            title: "Transactions",
            value: t0,
            subtitle: t1,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
            color: "bg-blue-500"
        };
        $[2] = t0;
        $[3] = t1;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const t3 = `${stats?.gasPrice || 0} Gwei`;
    let t4;
    if ($[5] !== t3) {
        t4 = {
            title: "Med Gas Price",
            value: t3,
            subtitle: "< $0.01",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"],
            color: "bg-orange-500"
        };
        $[5] = t3;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== stats?.lastFinalizedBlock) {
        t5 = stats?.lastFinalizedBlock.toLocaleString() || "0";
        $[7] = stats?.lastFinalizedBlock;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    let t6;
    if ($[9] !== t5) {
        t6 = {
            title: "Last Finalized Block",
            value: t5,
            subtitle: "Finalized",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"],
            color: "bg-green-500"
        };
        $[9] = t5;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] !== stats?.lastSafeBlock) {
        t7 = stats?.lastSafeBlock.toLocaleString() || "0";
        $[11] = stats?.lastSafeBlock;
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    let t8;
    if ($[13] !== t7) {
        t8 = {
            title: "Last Safe Block",
            value: t7,
            subtitle: "Safe",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
            color: "bg-purple-500"
        };
        $[13] = t7;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== t2 || $[16] !== t4 || $[17] !== t6 || $[18] !== t8) {
        t9 = [
            t2,
            t4,
            t6,
            t8
        ];
        $[15] = t2;
        $[16] = t4;
        $[17] = t6;
        $[18] = t8;
        $[19] = t9;
    } else {
        t9 = $[19];
    }
    const statCards = t9;
    let t10;
    if ($[20] !== statCards) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
            children: statCards.map(_StatsGridStatCardsMap)
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
            lineNumber: 118,
            columnNumber: 11
        }, this);
        $[20] = statCards;
        $[21] = t10;
    } else {
        t10 = $[21];
    }
    return t10;
}
_s(StatsGrid, "JDw0n/C6ozSEaoKgXHJberzE2dc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useEtherscanData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEthereumStats"]
    ];
});
_c = StatsGrid;
function _StatsGridStatCardsMap(stat) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white p-6 rounded-xl shadow",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 text-sm",
                            children: stat.title
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                            lineNumber: 127,
                            columnNumber: 131
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-2xl font-bold mt-2",
                            children: stat.value
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                            lineNumber: 127,
                            columnNumber: 184
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400 text-sm mt-1",
                            children: stat.subtitle
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                            lineNumber: 127,
                            columnNumber: 239
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                    lineNumber: 127,
                    columnNumber: 126
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${stat.color} p-3 rounded-full`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(stat.icon, {
                        className: "w-6 h-6 text-white"
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                        lineNumber: 127,
                        columnNumber: 356
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                    lineNumber: 127,
                    columnNumber: 306
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
            lineNumber: 127,
            columnNumber: 75
        }, this)
    }, stat.title, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
        lineNumber: 127,
        columnNumber: 10
    }, this);
}
function _StatsGridAnonymous(_, i) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-32 bg-gray-200 animate-pulse rounded-xl"
    }, i, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
        lineNumber: 130,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "StatsGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/assignments/7-block-explorer/src/components/TransactionList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransactionList",
    ()=>TransactionList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/droplets.js [app-client] (ecmascript) <export default as Droplets>");
/* eslint-disable @typescript-eslint/no-explicit-any */ 'use client';
;
;
;
function TransactionList(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "e9370c12762c46097c8d4027fd394f11e2e37a5b71825a6b413e031ece0080b1") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e9370c12762c46097c8d4027fd394f11e2e37a5b71825a6b413e031ece0080b1";
    }
    const { transactions } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
            className: "bg-gray-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        children: "Transaction Hash"
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                        lineNumber: 22,
                        columnNumber: 44
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        children: "From / To"
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                        lineNumber: 22,
                        columnNumber: 160
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        children: "Value"
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                        lineNumber: 22,
                        columnNumber: 269
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        children: "Gas Price"
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                        lineNumber: 22,
                        columnNumber: 374
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                lineNumber: 22,
                columnNumber: 40
            }, this)
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
            lineNumber: 22,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== transactions) {
        t2 = transactions.map(_TransactionListTransactionsMap);
        $[2] = transactions;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-xl shadow overflow-hidden",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                className: "min-w-full divide-y divide-gray-200",
                children: [
                    t1,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        className: "bg-white divide-y divide-gray-200",
                        children: t2
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                        lineNumber: 37,
                        columnNumber: 129
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                lineNumber: 37,
                columnNumber: 70
            }, this)
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
            lineNumber: 37,
            columnNumber: 10
        }, this);
        $[4] = t2;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    return t3;
}
_c = TransactionList;
function _TransactionListTransactionsMap(tx) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        className: "hover:bg-gray-50 transition",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-6 py-4 whitespace-nowrap",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `/tx/${tx.hash}`,
                        className: "text-blue-600 hover:text-blue-800 font-mono text-sm flex items-center",
                        children: [
                            tx.hash,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                className: "w-4 h-4 ml-1"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                lineNumber: 46,
                                columnNumber: 265
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                        lineNumber: 46,
                        columnNumber: 147
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                    lineNumber: 46,
                    columnNumber: 112
                }, this)
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                lineNumber: 46,
                columnNumber: 68
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-6 py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-500",
                                    children: "From:"
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                    lineNumber: 46,
                                    columnNumber: 399
                                }, this),
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono",
                                    children: tx.from
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                    lineNumber: 46,
                                    columnNumber: 448
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                            lineNumber: 46,
                            columnNumber: 374
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-500",
                                    children: "To:"
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                    lineNumber: 46,
                                    columnNumber: 523
                                }, this),
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono",
                                    children: tx.to
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                    lineNumber: 46,
                                    columnNumber: 570
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                            lineNumber: 46,
                            columnNumber: 498
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                    lineNumber: 46,
                    columnNumber: 347
                }, this)
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                lineNumber: 46,
                columnNumber: 321
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-6 py-4 whitespace-nowrap",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-lg font-semibold",
                    children: tx.value
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                    lineNumber: 46,
                    columnNumber: 673
                }, this)
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                lineNumber: 46,
                columnNumber: 629
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-6 py-4 whitespace-nowrap",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center text-gray-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"], {
                            className: "w-4 h-4 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                            lineNumber: 46,
                            columnNumber: 826
                        }, this),
                        tx.gasPrice
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                    lineNumber: 46,
                    columnNumber: 777
                }, this)
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                lineNumber: 46,
                columnNumber: 733
            }, this)
        ]
    }, tx.hash, true, {
        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
        lineNumber: 46,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "TransactionList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/assignments/7-block-explorer/src/lib/api/useTransaction.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/* eslint-disable @typescript-eslint/no-explicit-any */ var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/api/useApiService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$constant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/constant.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/utils.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
const useTransaction = ()=>{
    _s();
    const { useMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiService"])();
    const [latestBlockNumber, setLatestBlockNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [recentBlocks, setRecentBlocks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    console.log('Recent Blocks:', recentBlocks);
    const { mutateAsync: fetchBlockNumber, isPending: isBlockNumberLoading } = useMutation({});
    const { mutateAsync: fetchBlockByNumber, isPending: isfetchingBlockByNumber } = useMutation({});
    const handleFetchBlockNumber = async ()=>{
        const data = await fetchBlockNumber({
            method: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$constant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_BLOCK_NUMBER"],
            params: [],
            id: 83
        });
        const decimalBlockNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hexToDecimal"])(data?.result);
        setLatestBlockNumber(decimalBlockNumber);
        for(let i = 0; i < 5; i++){
            const blockData = await fetchBlockByNumber({
                method: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$constant$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ETH_GET_BLOCK_BY_NUMBER"],
                params: [
                    decimalBlockNumber - i,
                    true
                ],
                id: 84
            });
            setRecentBlocks((prevBlocks)=>({
                    ...prevBlocks,
                    [decimalBlockNumber - i]: blockData.result
                }));
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTransaction.useEffect": ()=>{
            handleFetchBlockNumber();
        }
    }["useTransaction.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTransaction.useEffect": ()=>{
            if (latestBlockNumber) {
                handleFetchBlockNumber();
            //   const interval = setInterval(() => {
            //   }, 10000); // Fetch every 10 seconds
            //   return () => clearInterval(interval);
            }
        }
    }["useTransaction.useEffect"], [
        latestBlockNumber
    ]);
    return {
        transactions: [],
        transactionsLoading: false,
        blocks: recentBlocks,
        blocksLoading: isfetchingBlockByNumber
    };
};
_s(useTransaction, "VKAlknzZW2D1bc9o1qzdIV9lHxE=", true, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiService"]
    ];
});
const __TURBOPACK__default__export__ = useTransaction;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/assignments/7-block-explorer/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$StatsGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$TransactionList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/components/TransactionList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useTransaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/api/useTransaction.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useEtherscanData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/useEtherscanData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function HomePage() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(24);
    if ($[0] !== "96cb26210b01297fad5e62c430f9b5379d830a349d52fbd1a49db6bfeba62055") {
        for(let $i = 0; $i < 24; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "96cb26210b01297fad5e62c430f9b5379d830a349d52fbd1a49db6bfeba62055";
    }
    const { data: stats } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useEtherscanData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEthereumStats"])();
    const { transactions, transactionsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useTransaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "text-3xl font-bold text-gray-900",
            children: "Ethereum (ETH) Blockchain Explorer"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 27,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] !== stats) {
        t1 = stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center mt-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-2xl font-bold",
                    children: [
                        "$",
                        stats.ethPrice.toFixed(2)
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                    lineNumber: 34,
                    columnNumber: 59
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `ml-4 flex items-center ${stats.priceChange >= 0 ? "text-green-600" : "text-red-600"}`,
                    children: [
                        stats.priceChange >= 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                            className: "w-5 h-5 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                            lineNumber: 34,
                            columnNumber: 262
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                            className: "w-5 h-5 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                            lineNumber: 34,
                            columnNumber: 304
                        }, this),
                        stats.priceChange,
                        "%"
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                    lineNumber: 34,
                    columnNumber: 131
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 34,
            columnNumber: 19
        }, this);
        $[2] = stats;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[4] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t0,
                t1
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 42,
            columnNumber: 10
        }, this);
        $[4] = t1;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    let t3;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            className: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition",
            children: "Connect Wallet"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 50,
            columnNumber: 10
        }, this);
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== t2) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    t2,
                    t3
                ]
            }, void 0, true, {
                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                lineNumber: 57,
                columnNumber: 85
            }, this)
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 57,
            columnNumber: 10
        }, this);
        $[7] = t2;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$StatsGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatsGrid"], {}, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 65,
            columnNumber: 10
        }, this);
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-xl font-semibold mb-4",
            children: "Latest Blocks"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 72,
            columnNumber: 10
        }, this);
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] !== transactions || $[12] !== transactionsLoading) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "lg:col-span-2",
            children: [
                t6,
                transactionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        ...Array(5)
                    ].map(_HomePageAnonymous)
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                    lineNumber: 79,
                    columnNumber: 68
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$TransactionList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionList"], {
                    transactions: transactions || []
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                    lineNumber: 79,
                    columnNumber: 143
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 79,
            columnNumber: 10
        }, this);
        $[11] = transactions;
        $[12] = transactionsLoading;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-xl font-semibold mb-4",
            children: "Recent Transactions"
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 88,
            columnNumber: 10
        }, this);
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== transactions || $[16] !== transactionsLoading) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "lg:col-span-2",
            children: [
                t8,
                transactionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        ...Array(5)
                    ].map(_HomePageAnonymous2)
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                    lineNumber: 95,
                    columnNumber: 68
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$TransactionList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionList"], {
                    transactions: transactions || []
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                    lineNumber: 95,
                    columnNumber: 144
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 95,
            columnNumber: 10
        }, this);
        $[15] = transactions;
        $[16] = transactionsLoading;
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    let t10;
    if ($[18] !== t7 || $[19] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
            children: [
                t7,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 104,
            columnNumber: 11
        }, this);
        $[18] = t7;
        $[19] = t9;
        $[20] = t10;
    } else {
        t10 = $[20];
    }
    let t11;
    if ($[21] !== t10 || $[22] !== t4) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-8",
            children: [
                t4,
                t5,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
            lineNumber: 113,
            columnNumber: 11
        }, this);
        $[21] = t10;
        $[22] = t4;
        $[23] = t11;
    } else {
        t11 = $[23];
    }
    return t11;
}
_s(HomePage, "c4Wzhy6bn26JZkEnoHXzscMLp+U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useEtherscanData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEthereumStats"],
        __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useTransaction$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = HomePage;
function _HomePageAnonymous2(__0, i_0) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-16 bg-gray-200 animate-pulse rounded"
    }, i_0, false, {
        fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
        lineNumber: 123,
        columnNumber: 10
    }, this);
}
function _HomePageAnonymous(_, i) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-16 bg-gray-200 animate-pulse rounded"
    }, i, false, {
        fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
        lineNumber: 126,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=assignments_7-block-explorer_src_78bc71f1._.js.map
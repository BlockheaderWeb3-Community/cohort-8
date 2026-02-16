module.exports = [
"[project]/assignments/7-block-explorer/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatGasPrice",
    ()=>formatGasPrice,
    "formatNumber",
    ()=>formatNumber
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
}),
"[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlockHeightCard",
    ()=>BlockHeightCard,
    "ChartPreviewCard",
    ()=>ChartPreviewCard,
    "CompactStatsCard",
    ()=>CompactStatsCard,
    "EthPriceCard",
    ()=>EthPriceCard,
    "EthereumStatsCard",
    ()=>EthereumStatsCard,
    "GasPriceCard",
    ()=>GasPriceCard,
    "TransactionStatsCard",
    ()=>TransactionStatsCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-ssr] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/minus.js [app-ssr] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/flame.js [app-ssr] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/box.js [app-ssr] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function EthereumStatsCard({ title, value, subtitle, icon: Icon, change, changeType, loading = false, className, compact = false, bordered = true, onClick, href }) {
    const getChangeIcon = ()=>{
        switch(changeType){
            case 'positive':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                    lineNumber: 50,
                    columnNumber: 16
                }, this);
            case 'negative':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                    lineNumber: 52,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                    lineNumber: 54,
                    columnNumber: 16
                }, this);
        }
    };
    const getChangeColor = ()=>{
        switch(changeType){
            case 'positive':
                return 'text-green-600 bg-green-50';
            case 'negative':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };
    const CardContent = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('group transition-all duration-200', bordered && 'border border-gray-200', 'rounded-lg', onClick || href ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : '', compact ? 'p-4' : 'p-6', className),
            onClick: onClick,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex items-center justify-between mb-3', compact && 'mb-2'),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-gray-600 font-medium', compact ? 'text-sm' : 'text-base'),
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                            lineNumber: 90,
                            columnNumber: 9
                        }, this),
                        Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('p-2 rounded-lg', compact ? 'p-1.5' : 'p-2', 'bg-blue-50 text-blue-600'),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('transition-transform group-hover:scale-110', compact ? 'w-4 h-4' : 'w-5 h-5')
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                    lineNumber: 84,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('font-bold text-gray-900 mb-1', compact ? 'text-xl' : 'text-2xl'),
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('bg-gray-200 animate-pulse rounded', compact ? 'h-7 w-24' : 'h-8 w-32')
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this) : value
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                    lineNumber: 117,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-gray-500', compact ? 'text-xs' : 'text-sm'),
                            children: subtitle
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this),
                        change && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium', getChangeColor(), compact && 'px-1.5 py-0.5'),
                            children: [
                                getChangeIcon(),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: change
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                    lineNumber: 136,
                    columnNumber: 7
                }, this),
                loading && !subtitle && !change && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('bg-gray-200 animate-pulse rounded', compact ? 'h-4 w-20' : 'h-4 w-24')
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
            lineNumber: 70,
            columnNumber: 5
        }, this);
    if (href) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: href,
            className: "block no-underline",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {}, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                lineNumber: 176,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
            lineNumber: 175,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {}, void 0, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
        lineNumber: 181,
        columnNumber: 10
    }, this);
}
function GasPriceCard({ gwei, usd, loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EthereumStatsCard, {
        title: "Med Gas Price",
        value: loading ? '...' : `${gwei} Gwei`,
        subtitle: loading ? '' : usd,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"],
        bordered: true,
        className: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100"
    }, void 0, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
}
function BlockHeightCard({ blockNumber, type = 'finalized', loading }) {
    const getConfig = ()=>{
        switch(type){
            case 'finalized':
                return {
                    title: 'Last Finalized Block',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"],
                    color: 'from-green-50 to-emerald-50',
                    borderColor: 'border-green-100'
                };
            case 'safe':
                return {
                    title: 'Last Safe Block',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
                    color: 'from-blue-50 to-cyan-50',
                    borderColor: 'border-blue-100'
                };
            default:
                return {
                    title: 'Latest Block',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"],
                    color: 'from-gray-50 to-blue-50',
                    borderColor: 'border-gray-200'
                };
        }
    };
    const config = getConfig();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EthereumStatsCard, {
        title: config.title,
        value: loading ? '...' : blockNumber.toLocaleString(),
        subtitle: loading ? '' : type === 'finalized' ? 'Finalized' : type === 'safe' ? 'Safe' : 'Latest',
        icon: config.icon,
        bordered: true,
        className: `bg-gradient-to-br ${config.color} ${config.borderColor}`
    }, void 0, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
        lineNumber: 244,
        columnNumber: 5
    }, this);
}
function EthPriceCard({ price, change, loading }) {
    const isPositive = change >= 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EthereumStatsCard, {
        title: "ETH Price",
        value: loading ? '...' : `$${price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`,
        change: `${isPositive ? '+' : ''}${change.toFixed(2)}%`,
        changeType: isPositive ? 'positive' : 'negative',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"],
        bordered: true,
        className: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100"
    }, void 0, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
        lineNumber: 275,
        columnNumber: 5
    }, this);
}
function TransactionStatsCard({ count, tps, loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EthereumStatsCard, {
        title: "Transactions",
        value: loading ? '...' : count,
        subtitle: loading ? '' : `${tps} TPS`,
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
        bordered: true,
        className: "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100"
    }, void 0, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
        lineNumber: 304,
        columnNumber: 5
    }, this);
}
function CompactStatsCard({ title, value, subtitle, change, changeType, loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EthereumStatsCard, {
        title: title,
        value: value,
        subtitle: subtitle,
        change: change,
        changeType: changeType,
        loading: loading,
        compact: true,
        className: "hover:bg-gray-50 transition-colors"
    }, void 0, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
        lineNumber: 332,
        columnNumber: 5
    }, this);
}
function ChartPreviewCard({ title, value, data, loading }) {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border border-gray-200 rounded-xl p-6 bg-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-start mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-gray-600 font-medium mb-1",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                            lineNumber: 364,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-2xl font-bold text-gray-900",
                            children: loading ? '...' : value
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                            lineNumber: 365,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                    lineNumber: 363,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                lineNumber: 362,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-40",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full w-full bg-gray-200 animate-pulse rounded"
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                    lineNumber: 373,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full flex items-end space-x-1",
                    children: data.map((value, index)=>{
                        const percentage = (value - minValue) / (maxValue - minValue) * 100;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all hover:opacity-80",
                            style: {
                                height: `${percentage}%`
                            },
                            title: `Day ${index + 1}: ${value}`
                        }, index, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                            lineNumber: 380,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                    lineNumber: 375,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                lineNumber: 371,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between mt-4 text-xs text-gray-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "14 days ago"
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Today"
                    }, void 0, false, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                        lineNumber: 394,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx",
        lineNumber: 361,
        columnNumber: 5
    }, this);
}
}),
"[project]/assignments/7-block-explorer/src/lib/useEtherscanData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBlockDetails",
    ()=>useBlockDetails,
    "useEthereumStats",
    ()=>useEthereumStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
'use client';
;
function useEthereumStats() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'ethereum-stats'
        ],
        queryFn: async ()=>{
            // In a real implementation, you would make actual API calls here
            // For demo purposes, returning mock data based on your provided content
            return {
                ethPrice: 2628.88,
                priceChange: -3.57,
                totalTransactions: '3,232.75 M',
                gasPrice: 0.105,
                lastFinalizedBlock: 24354972,
                lastSafeBlock: 24355004,
                tps: 26.1
            };
        },
        refetchInterval: 10000
    });
}
function useBlockDetails(blockNumber) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'block-details',
            blockNumber
        ],
        queryFn: async ()=>{
            if (!blockNumber) throw new Error('Block number required');
            const response = await etherscanApi.get('', {
                params: {
                    module: 'proxy',
                    action: 'eth_getBlockByNumber',
                    tag: `0x${blockNumber.toString(16)}`,
                    boolean: 'true'
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
        },
        enabled: !!blockNumber
    });
}
}),
"[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatsGrid",
    ()=>StatsGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useEtherscanData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/useEtherscanData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/flame.js [app-ssr] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/box.js [app-ssr] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
'use client';
;
;
;
function StatsGrid() {
    const { data: stats, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useEtherscanData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEthereumStats"])();
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
            children: [
                ...Array(4)
            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-32 bg-gray-200 animate-pulse rounded-xl"
                }, i, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                    lineNumber: 13,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, this);
    }
    const statCards = [
        {
            title: 'Transactions',
            value: stats?.totalTransactions || '0',
            subtitle: `${stats?.tps || 0} TPS`,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
            color: 'bg-blue-500'
        },
        {
            title: 'Med Gas Price',
            value: `${stats?.gasPrice || 0} Gwei`,
            subtitle: '< $0.01',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"],
            color: 'bg-orange-500'
        },
        {
            title: 'Last Finalized Block',
            value: stats?.lastFinalizedBlock.toLocaleString() || '0',
            subtitle: 'Finalized',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"],
            color: 'bg-green-500'
        },
        {
            title: 'Last Safe Block',
            value: stats?.lastSafeBlock.toLocaleString() || '0',
            subtitle: 'Safe',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
            color: 'bg-purple-500'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        children: statCards.map((stat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-xl shadow",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 text-sm",
                                    children: stat.title
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl font-bold mt-2",
                                    children: stat.value
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                                    lineNumber: 60,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400 text-sm mt-1",
                                    children: stat.subtitle
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                                    lineNumber: 61,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${stat.color} p-3 rounded-full`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(stat.icon, {
                                className: "w-6 h-6 text-white"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                                lineNumber: 64,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this)
            }, stat.title, false, {
                fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
}),
"[project]/assignments/7-block-explorer/src/components/TransactionList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransactionList",
    ()=>TransactionList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/droplets.js [app-ssr] (ecmascript) <export default as Droplets>");
'use client';
;
;
function TransactionList({ transactions }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-xl shadow overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "min-w-full divide-y divide-gray-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                    className: "bg-gray-50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                children: "Transaction Hash"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                lineNumber: 16,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                children: "From / To"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                lineNumber: 19,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                children: "Value"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                lineNumber: 22,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                children: "Gas Price"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                lineNumber: 25,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                        lineNumber: 15,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                    className: "bg-white divide-y divide-gray-200",
                    children: transactions.map((tx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            className: "hover:bg-gray-50 transition",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: "px-6 py-4 whitespace-nowrap",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: `/tx/${tx.hash}`,
                                            className: "text-blue-600 hover:text-blue-800 font-mono text-sm flex items-center",
                                            children: [
                                                tx.hash,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                    className: "w-4 h-4 ml-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                                    lineNumber: 40,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                            lineNumber: 35,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                        lineNumber: 34,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                    lineNumber: 33,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: "px-6 py-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-500",
                                                        children: "From:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                                        lineNumber: 47,
                                                        columnNumber: 21
                                                    }, this),
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono",
                                                        children: tx.from
                                                    }, void 0, false, {
                                                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                                        lineNumber: 48,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                                lineNumber: 46,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-500",
                                                        children: "To:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                                        lineNumber: 51,
                                                        columnNumber: 21
                                                    }, this),
                                                    ' ',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono",
                                                        children: tx.to
                                                    }, void 0, false, {
                                                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                                        lineNumber: 52,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                                lineNumber: 50,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                        lineNumber: 45,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                    lineNumber: 44,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: "px-6 py-4 whitespace-nowrap",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-lg font-semibold",
                                        children: tx.value
                                    }, void 0, false, {
                                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                        lineNumber: 57,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                    lineNumber: 56,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: "px-6 py-4 whitespace-nowrap",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center text-gray-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"], {
                                                className: "w-4 h-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                                lineNumber: 61,
                                                columnNumber: 19
                                            }, this),
                                            tx.gasPrice
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                        lineNumber: 60,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, tx.hash, true, {
                            fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                            lineNumber: 32,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/assignments/7-block-explorer/src/components/TransactionList.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}),
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
"[project]/assignments/7-block-explorer/src/lib/api/useTransaction.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/api/useApiService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
;
;
const useTransaction = ()=>{
    const { useQuery } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useApiService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApiService"])();
    const { data: transactions, isPending: transactionsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        params: {
            jsonrpc: '2.0',
            method: ETH_BLOCK_NUMBER,
            params: [],
            id: 83
        },
        config: {
            select: (data)=>parseInt(data.result, 16),
            staleTime: 10000
        }
    });
    return {
        transactions,
        transactionsLoading
    };
};
const __TURBOPACK__default__export__ = useTransaction;
}),
"[project]/assignments/7-block-explorer/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$EthereumStatsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/components/EthereumStatsCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$StatsGrid$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/components/StatsGrid.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$TransactionList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/components/TransactionList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useTransaction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/api/useTransaction.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useEtherscanData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/src/lib/useEtherscanData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/assignments/7-block-explorer/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-ssr] (ecmascript) <export default as TrendingDown>");
'use client';
;
;
;
;
;
;
;
function HomePage() {
    const { data: stats, isLoading: statsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$useEtherscanData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEthereumStats"])();
    const { transactions, transactionsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$lib$2f$api$2f$useTransaction$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold text-gray-900",
                                    children: "Ethereum (ETH) Blockchain Explorer"
                                }, void 0, false, {
                                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                    lineNumber: 19,
                                    columnNumber: 13
                                }, this),
                                stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center mt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-2xl font-bold",
                                            children: [
                                                "$",
                                                stats.ethPrice.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                            lineNumber: 24,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `ml-4 flex items-center ${stats.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`,
                                            children: [
                                                stats.priceChange >= 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                    className: "w-5 h-5 mr-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                                    lineNumber: 33,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                                                    className: "w-5 h-5 mr-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                                    lineNumber: 35,
                                                    columnNumber: 21
                                                }, this),
                                                stats.priceChange,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                            lineNumber: 27,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                    lineNumber: 23,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                            lineNumber: 18,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition",
                            children: "Connect Wallet"
                        }, void 0, false, {
                            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$StatsGrid$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatsGrid"], {}, void 0, false, {
                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold mb-4",
                                children: "Recent Transactions"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            transactionsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    ...Array(5)
                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-16 bg-gray-200 animate-pulse rounded"
                                    }, i, false, {
                                        fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                        lineNumber: 58,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$TransactionList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransactionList"], {
                                transactions: transactions || []
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold mb-4",
                                children: "Latest Blocks"
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$EthereumStatsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EthereumStatsCard"], {
                                            title: "Last Finalized Block",
                                            value: stats.lastFinalizedBlock.toLocaleString(),
                                            change: "+1",
                                            changeType: "positive"
                                        }, void 0, false, {
                                            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                            lineNumber: 74,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$src$2f$components$2f$EthereumStatsCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EthereumStatsCard"], {
                                            title: "Last Safe Block",
                                            value: stats.lastSafeBlock.toLocaleString(),
                                            change: "+32",
                                            changeType: "positive"
                                        }, void 0, false, {
                                            fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                            lineNumber: 80,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-lg mb-2",
                                        children: "Transaction History (14 days)"
                                    }, void 0, false, {
                                        fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-48 flex items-end space-x-1",
                                        children: [
                                            ...Array(14)
                                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$assignments$2f$7$2d$block$2d$explorer$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                                            }, i, false, {
                                                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                                lineNumber: 97,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/assignments/7-block-explorer/src/app/page.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=assignments_7-block-explorer_src_569082e4._.js.map
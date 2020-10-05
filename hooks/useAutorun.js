"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.useAutorun = void 0;
var mobx_1 = require("mobx");
var react_1 = require("react");
var useUnmount_1 = require("./useUnmount");
function useAutorun(action, deps) {
    if (deps === void 0) { deps = []; }
    var disposer = react_1.useRef();
    react_1.useEffect(function () {
        !!disposer.current && disposer.current();
        disposer.current = mobx_1.autorun(action);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, __spreadArrays(deps));
    useUnmount_1.useUnmount(function () {
        !!disposer.current && disposer.current();
    });
}
exports.useAutorun = useAutorun;

"use strict";
exports.__esModule = true;
exports.useReaction = void 0;
var mobx_1 = require("mobx");
var react_1 = require("react");
var useUnmount_1 = require("./useUnmount");
function useReaction(predicate, action, deps, options) {
    if (deps === void 0) { deps = []; }
    var disposer = react_1.useRef();
    react_1.useEffect(function () {
        !!disposer.current && disposer.current();
        disposer.current = mobx_1.reaction(predicate, function (data) { return action(data); }, options);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    useUnmount_1.useUnmount(function () {
        !!disposer.current && disposer.current();
    });
}
exports.useReaction = useReaction;

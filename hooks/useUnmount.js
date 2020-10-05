"use strict";
exports.__esModule = true;
exports.useUnmount = void 0;
var react_1 = require("react");
function useUnmount(action) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    react_1.useEffect(function () { return function () { return action(); }; }, []);
}
exports.useUnmount = useUnmount;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var mobx_react_1 = require("mobx-react");
var Button_1 = require("../../components/Button/Button");
var setTitleForUrl_1 = require("../../services/script/setTitleForUrl");
var fixSortOrders_1 = require("../../services/script/fixSortOrders");
var deleteUnusedTags_1 = require("../../services/script/deleteUnusedTags");
var AdminDevArea = mobx_react_1.observer(function () {
    var _a = react_1.useState(), running = _a[0], setRunning = _a[1];
    return (<div className="page container">
      <div className="page content">
        <Button_1.Button onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRunning('setTitleForUrl');
                    return [4 /*yield*/, setTitleForUrl_1.setTitleForUrl()];
                case 1:
                    _a.sent();
                    setRunning(null);
                    return [2 /*return*/];
            }
        });
    }); }} loading={running === 'setTitleForUrl'}>
          Set articles' title for url
        </Button_1.Button>

        <Button_1.Button onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRunning('fixSortOrders');
                    return [4 /*yield*/, fixSortOrders_1.fixSortOrders()];
                case 1:
                    _a.sent();
                    setRunning(null);
                    return [2 /*return*/];
            }
        });
    }); }} loading={running === 'fixSortOrders'}>
          Fix sort orders of Articles and their sections and contents
        </Button_1.Button>

        <Button_1.Button onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRunning('deleteUnusedTags');
                    return [4 /*yield*/, deleteUnusedTags_1.deleteUnusedTags()];
                case 1:
                    _a.sent();
                    setRunning(null);
                    return [2 /*return*/];
            }
        });
    }); }} loading={running === 'deleteUnusedTags'}>
          Delete unused tags
        </Button_1.Button>
      </div>
    </div>);
});
exports["default"] = AdminDevArea;

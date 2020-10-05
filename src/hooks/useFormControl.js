"use strict";
exports.__esModule = true;
exports.useFormControl = void 0;
var react_1 = require("react");
var FormControl_1 = require("../services/formControl/FormControl");
function useFormControl(formObject, fieldConfigs) {
    var _a = react_1.useState(), formControl = _a[0], setFormControl = _a[1];
    var id = formObject === null || formObject === void 0 ? void 0 : formObject.id;
    react_1.useEffect(function () {
        if ((!formControl || formControl.mutable.id !== formObject.id) &&
            !!formObject) {
            setFormControl(new FormControl_1.FormControl(formObject, fieldConfigs));
        }
    }, [fieldConfigs, formControl, formObject, id]);
    return formControl;
}
exports.useFormControl = useFormControl;

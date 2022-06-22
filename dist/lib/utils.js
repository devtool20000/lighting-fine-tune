"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeholder = void 0;
function placeholder(value = "", isActive = true) {
    if (isActive) {
        return `###next:${value}###`;
    }
    else {
        return value;
    }
}
exports.placeholder = placeholder;
//# sourceMappingURL=utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.fail = fail;
function ok(message, data, meta) {
    return { success: true, message, data, meta };
}
function fail(message, meta) {
    return { success: false, message, data: null, meta };
}

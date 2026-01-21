"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nairaToKobo = nairaToKobo;
exports.koboToNaira = koboToNaira;
function nairaToKobo(amountNaira) {
    return Math.round(amountNaira * 100);
}
function koboToNaira(amountKobo) {
    return amountKobo / 100;
}

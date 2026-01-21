"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystackInitialize = paystackInitialize;
exports.paystackVerify = paystackVerify;
const env_1 = require("../../config/env");
async function paystackInitialize(email, amountKobo, reference, callbackUrl) {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env_1.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            amount: amountKobo,
            reference,
            callback_url: callbackUrl,
        }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Paystack init failed: ${res.status} ${text}`);
    }
    return (await res.json());
}
async function paystackVerify(reference) {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        headers: { Authorization: `Bearer ${env_1.env.PAYSTACK_SECRET_KEY}` },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Paystack verify failed: ${res.status} ${text}`);
    }
    return res.json();
}

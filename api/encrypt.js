const express = require('express');
const JsConfuser = require('js-confuser');
const crypto = require('crypto');
const router = express.Router();

function getSiuCalcrickObfuscationConfig() {
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => `SiuCalcrick_${Math.random().toString(36).slice(2, 8)}`,
        stringCompression: true, stringEncoding: true, stringSplitting: true,
        controlFlowFlattening: 0.95, shuffle: true, flatten: true, duplicateLiteralsRemoval: true,
        deadCode: true, calculator: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getNebulaObfuscationConfig() {
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => `NX${Math.random().toString(36).slice(2, 6)}`,
        stringCompression: true, stringEncoding: true, controlFlowFlattening: 0.75,
        flatten: true, shuffle: true, rgf: true, deadCode: true, opaquePredicates: true,
        dispatcher: true, globalConcealing: true, objectExtraction: true, duplicateLiteralsRemoval: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getNovaObfuscationConfig() {
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => `nova_${crypto.randomBytes(4).toString('hex')}`,
        stringCompression: true, stringConcealing: true, stringEncoding: true,
        controlFlowFlattening: 0.5, flatten: true, shuffle: true, opaquePredicates: true,
        dispatcher: true, globalConcealing: true, objectExtraction: true, duplicateLiteralsRemoval: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getXObfuscationConfig() {
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => `xZ${crypto.randomUUID().slice(0, 4)}`,
        stringCompression: true, stringConcealing: true, stringEncoding: true,
        controlFlowFlattening: 0.5, flatten: true, shuffle: true, rgf: true,
        opaquePredicates: true, dispatcher: true, globalConcealing: true, objectExtraction: true,
        duplicateLiteralsRemoval: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getStrongObfuscationConfig() {
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: "randomized", stringEncoding: true, stringSplitting: true,
        controlFlowFlattening: 0.75, duplicateLiteralsRemoval: true, calculator: true,
        dispatcher: true, deadCode: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getInvisObfuscationConfig() {
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => `_${Math.random().toString(36).substring(2, 6)}`,
        stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.95,
        shuffle: true, duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getStealthObfuscationConfig() {
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => `s${Math.random().toString(36).substring(2, 4)}`,
        stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.75,
        shuffle: true, duplicateLiteralsRemoval: true, deadCode: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getMandarinObfuscationConfig() {
    const chars = ["龙", "虎", "风", "云", "山", "河", "天", "地", "雷", "电"];
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)],
        stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.95,
        shuffle: true, duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getArabObfuscationConfig() {
    const chars = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر"];
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)],
        stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.95,
        shuffle: true, duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getJapanObfuscationConfig() {
    const chars = ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ"];
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)],
        stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.9,
        flatten: true, shuffle: true, duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getJapanxArabObfuscationConfig() {
    const chars = ["あ", "い", "أ", "ب", "ت", "か", "き"];
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)],
        stringCompression: true, stringConcealing: true, stringEncoding: true, stringSplitting: true,
        controlFlowFlattening: 0.95, flatten: true, shuffle: true, dispatcher: true, duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

function getUltraObfuscationConfig() {
    return {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => `z${Math.floor(Math.random() * 10)}${Math.random().toString(36).substring(2, 6)}`,
        stringCompression: true, stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.9,
        flatten: true, shuffle: true, rgf: true, deadCode: true, opaquePredicates: true, dispatcher: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    };
}

async function obfuscateQuantum(fileContent) {
    const obfuscated = await JsConfuser.obfuscate(fileContent, {
        target: "node", compact: true, renameVariables: true, renameGlobals: true,
        identifierGenerator: () => `qV_${Math.random().toString(36).slice(2, 7)}`,
        stringCompression: true, stringEncoding: true, controlFlowFlattening: 0.85,
        flatten: true, shuffle: true, rgf: true, dispatcher: true, globalConcealing: true, duplicateLiteralsRemoval: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
    });
    const key = new Date().getMilliseconds() % 256;
    let obfuscatedCode = obfuscated.code || obfuscated;
    return `(function(){let k=${key};return function(c){return c.split('').map((x,i)=>String.fromCharCode(x.charCodeAt(0)^(k+(i%16)))).join('');}('${obfuscatedCode}');})()`;
}

router.post('/run', async (req, res) => {
    const { code, method } = req.body;
    try {
        let config;
        let obfuscatedCode;

        if (method === 'quantum') {
            obfuscatedCode = await obfuscateQuantum(code);
        } else {
            switch (method) {
                case 'china': config = getMandarinObfuscationConfig(); break;
                case 'arab': config = getArabObfuscationConfig(); break;
                case 'japan': config = getJapanObfuscationConfig(); break;
                case 'japxab': config = getJapanxArabObfuscationConfig(); break;
                case 'stealth': config = getStealthObfuscationConfig(); break;
                case 'siu': config = getSiuCalcrickObfuscationConfig(); break;
                case 'nebula': config = getNebulaObfuscationConfig(); break;
                case 'nova': config = getNovaObfuscationConfig(); break;
                case 'x': config = getXObfuscationConfig(); break;
                case 'ultra': config = getUltraObfuscationConfig(); break;
                case 'strong': config = getStrongObfuscationConfig(); break;
                case 'invis': config = getInvisObfuscationConfig(); break;
                case 'high': config = { target: "node", compact: true, controlFlowFlattening: 0.95, stringEncoding: true }; break;
                case 'medium': config = { target: "node", compact: true, controlFlowFlattening: 0.75 }; break;
                case 'low': config = { target: "node", compact: true, controlFlowFlattening: 0.5 }; break;
                default: config = { target: "node", compact: true };
            }
            const obfuscated = await JsConfuser.obfuscate(code, config);
            obfuscatedCode = obfuscated.code || obfuscated;
        }

        res.json({ encryptedCode: obfuscatedCode });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
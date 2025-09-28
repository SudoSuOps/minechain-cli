"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMemory = saveMemory;
exports.loadMemory = loadMemory;
const fs_1 = require("fs");
const path_1 = require("path");
const MEMORY_FILE = (0, path_1.join)(process.cwd(), '.minechain-memory.json');
function saveMemory(memory) {
    try {
        (0, fs_1.writeFileSync)(MEMORY_FILE, JSON.stringify(memory, null, 2));
    }
    catch (error) {
        // Silent fail
    }
}
function loadMemory() {
    try {
        if ((0, fs_1.existsSync)(MEMORY_FILE)) {
            return JSON.parse((0, fs_1.readFileSync)(MEMORY_FILE, 'utf8'));
        }
    }
    catch (error) {
        // Silent fail
    }
    return null;
}

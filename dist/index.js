#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ai_js_1 = require("./commands/ai.js");
const datacenter_js_1 = require("./commands/datacenter.js");
const program = new commander_1.Command();
// Enhanced banner for datacenter operations
console.log(chalk_1.default.green('┌─────────────────────────────────────────────────────────────────┐'));
console.log(chalk_1.default.green('│') + chalk_1.default.cyan('  🏭 MINECHAIN DATACENTER - WEB3 OPERATIONS COMMAND CENTER 🤖  ') + chalk_1.default.green('│'));
console.log(chalk_1.default.green('└─────────────────────────────────────────────────────────────────┘'));
console.log(chalk_1.default.gray('     RTX 5070 Ti | 31GB RAM | Kubernetes Ready | AI Brain Active     '));
console.log(chalk_1.default.gray('   Focus: MONAI • TrustCat • Akash • Ethical Hacking • Early Projects   '));
console.log('');
program
    .name('minechain')
    .description('Web3 Datacenter Operations Command Center')
    .version('1.0.0');
// Original commands
program
    .command('hello')
    .description('System greeting and status')
    .action(() => {
    console.log('');
    console.log(chalk_1.default.cyan('🚀 MineChain Datacenter Operations Online!'));
    console.log(chalk_1.default.yellow('🎮 RTX 5070 Ti: Ready for Web3 workloads'));
    console.log(chalk_1.default.green('💾 31GB RAM: Optimized for AI training'));
    console.log(chalk_1.default.blue('🐳 Docker + K8s: GPU-enabled containers ready'));
    console.log(chalk_1.default.magenta('🤖 AI Brain: Learning Web3 patterns'));
    console.log(chalk_1.default.white('🏭 Datacenter: Fleet operations active'));
    console.log('');
    console.log(chalk_1.default.magenta('Status: ') + chalk_1.default.green('WEB3 DATACENTER OPERATIONAL! 🔥'));
});
program
    .command('status')
    .description('Complete system status overview')
    .action(() => {
    console.log('');
    console.log(chalk_1.default.yellow('📊 MineChain Datacenter Status:'));
    console.log('');
    console.log(chalk_1.default.green('✅ Core Systems:'));
    console.log(chalk_1.default.white('  🏭 Datacenter AI: ') + chalk_1.default.cyan('Active & Learning'));
    console.log(chalk_1.default.white('  🎮 GPU Fleet: ') + chalk_1.default.cyan('RTX 5070 Ti (16GB VRAM)'));
    console.log(chalk_1.default.white('  💾 Memory: ') + chalk_1.default.cyan('31GB Total (25GB Free)'));
    console.log(chalk_1.default.white('  🐳 Docker: ') + chalk_1.default.cyan('28.4.0 + GPU Support'));
    console.log(chalk_1.default.white('  ☸️ Kubernetes: ') + chalk_1.default.cyan('Ready for deployment'));
    console.log('');
    console.log(chalk_1.default.green('✅ Web3 Operations:'));
    console.log(chalk_1.default.white('  ☁️ Akash Provider: ') + chalk_1.default.cyan('Ready to deploy'));
    console.log(chalk_1.default.white('  📊 Market Tracking: ') + chalk_1.default.cyan('ETH, AKASH, BTC'));
    console.log(chalk_1.default.white('  🔍 Project Scanner: ') + chalk_1.default.cyan('Early-stage monitoring'));
    console.log(chalk_1.default.white('  🛡️ Security Tools: ') + chalk_1.default.cyan('Ethical hacking ready'));
    console.log('');
    console.log(chalk_1.default.green('✅ Development Focus:'));
    console.log(chalk_1.default.white('  🧠 MONAI: ') + chalk_1.default.cyan('Medical AI development'));
    console.log(chalk_1.default.white('  🔒 TrustCat: ') + chalk_1.default.cyan('Privacy protocol design'));
    console.log('');
    console.log(chalk_1.default.cyan('🎯 Datacenter Status: ') + chalk_1.default.green('FULLY OPERATIONAL'));
});
// Add AI commands
program.addCommand((0, ai_js_1.createAICommands)());
// Add datacenter commands
program.addCommand((0, datacenter_js_1.createDatacenterCommands)());
// Quick datacenter access
program
    .command('ask')
    .argument('<question>', 'Ask the datacenter AI anything')
    .description('Quick AI consultation for Web3 operations')
    .action(async (question) => {
    const { DatacenterAI } = await Promise.resolve().then(() => __importStar(require('./ai-agent/core/datacenter-ai.js')));
    const ai = new DatacenterAI();
    console.log(chalk_1.default.cyan('🏭 Datacenter AI analyzing...'));
    const response = await ai.think(question);
    console.log('');
    console.log(chalk_1.default.green('🧠 Datacenter AI:') + chalk_1.default.white(' ' + response));
    console.log('');
});
// Pro tip commands
program
    .command('protips')
    .description('Pro tips for datacenter operations')
    .action(() => {
    console.log('');
    console.log(chalk_1.default.yellow('💡 MineChain Pro Tips:'));
    console.log('');
    console.log(chalk_1.default.cyan('🏭 Fleet Operations:'));
    console.log(chalk_1.default.white('  minechain datacenter fleet      ') + chalk_1.default.gray('# Monitor all nodes'));
    console.log(chalk_1.default.white('  minechain datacenter autonomous ') + chalk_1.default.gray('# Auto-pilot mode'));
    console.log('');
    console.log(chalk_1.default.cyan('📊 Market Intelligence:'));
    console.log(chalk_1.default.white('  minechain datacenter market     ') + chalk_1.default.gray('# Token + GPU pricing'));
    console.log(chalk_1.default.white('  minechain ask "RTX 5090 ROI"    ') + chalk_1.default.gray('# Investment analysis'));
    console.log('');
    console.log(chalk_1.default.cyan('💰 Revenue Optimization:'));
    console.log(chalk_1.default.white('  minechain datacenter earnings   ') + chalk_1.default.gray('# Revenue projections'));
    console.log(chalk_1.default.white('  minechain ask "akash setup"     ') + chalk_1.default.gray('# Provider configuration'));
    console.log('');
    console.log(chalk_1.default.cyan('🧠 Development:'));
    console.log(chalk_1.default.white('  minechain datacenter dev        ') + chalk_1.default.gray('# MONAI + TrustCat insights'));
    console.log(chalk_1.default.white('  minechain ask "kubernetes gpu"  ') + chalk_1.default.gray('# K8s GPU setup'));
    console.log('');
});
program.parse();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatacenterCommands = createDatacenterCommands;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const datacenter_ai_js_1 = require("../ai-agent/core/datacenter-ai.js");
let datacenterAI;
function getDatacenterAI() {
    if (!datacenterAI) {
        datacenterAI = new datacenter_ai_js_1.DatacenterAI();
        datacenterAI.on('market-updated', () => {
            console.log(chalk_1.default.blue('📊 Market data refreshed'));
        });
        datacenterAI.on('fleet-updated', () => {
            console.log(chalk_1.default.green('🏭 Fleet status updated'));
        });
    }
    return datacenterAI;
}
function createDatacenterCommands() {
    const datacenter = new commander_1.Command('datacenter');
    datacenter.description('🏭 Datacenter operations and fleet management');
    // Datacenter status
    datacenter.command('status')
        .description('Overall datacenter status')
        .action(() => {
        const ai = getDatacenterAI();
        const status = ai.getStatus();
        console.log('');
        console.log(chalk_1.default.yellow('🏭 MineChain Datacenter Status:'));
        console.log('');
        console.log(chalk_1.default.green('✅ Operations: ') + chalk_1.default.white(status.isRunning ? 'Active' : 'Standby'));
        console.log(chalk_1.default.green('✅ Fleet Size: ') + chalk_1.default.white(status.fleetSize + ' nodes'));
        console.log(chalk_1.default.green('✅ Market Data: ') + chalk_1.default.white('Live tracking'));
        console.log(chalk_1.default.green('✅ AI Brain: ') + chalk_1.default.white('Learning patterns'));
        console.log('');
    });
    // Fleet management
    datacenter.command('fleet')
        .description('Fleet status and management')
        .action(async () => {
        const ai = getDatacenterAI();
        const response = await ai.think('fleet status');
        console.log('');
        console.log(chalk_1.default.yellow('🏭 Fleet Management:'));
        console.log(chalk_1.default.white(response));
        console.log('');
    });
    // Market intelligence
    datacenter.command('market')
        .description('Market intelligence and opportunities')
        .action(async () => {
        const ai = getDatacenterAI();
        const response = await ai.think('market intelligence');
        console.log('');
        console.log(chalk_1.default.yellow('📊 Market Intelligence:'));
        console.log(chalk_1.default.white(response));
        console.log('');
    });
    // Earnings report
    datacenter.command('earnings')
        .description('Revenue and earnings analysis')
        .action(async () => {
        const ai = getDatacenterAI();
        const response = await ai.think('earnings report');
        console.log('');
        console.log(chalk_1.default.yellow('💰 Earnings Analysis:'));
        console.log(chalk_1.default.white(response));
        console.log('');
    });
    // Development insights
    datacenter.command('dev')
        .description('MONAI and TrustCat development insights')
        .action(async () => {
        const ai = getDatacenterAI();
        const response = await ai.think('monai trustcat development');
        console.log('');
        console.log(chalk_1.default.yellow('🧠 Development Insights:'));
        console.log(chalk_1.default.white(response));
        console.log('');
    });
    // Autonomous mode
    datacenter.command('autonomous')
        .description('Start autonomous datacenter operations')
        .action(() => {
        const ai = getDatacenterAI();
        ai.startAutonomousMode();
        console.log('');
        console.log(chalk_1.default.green('🏭 Autonomous Datacenter Mode Activated!'));
        console.log(chalk_1.default.white('System is now monitoring:'));
        console.log(chalk_1.default.white('  ✓ Fleet health and performance'));
        console.log(chalk_1.default.white('  ✓ Market trends (ETH, AKASH, BTC)'));
        console.log(chalk_1.default.white('  ✓ GPU pricing (RTX 5090 availability)'));
        console.log(chalk_1.default.white('  ✓ Early-stage Web3 projects'));
        console.log(chalk_1.default.white('  ✓ Revenue optimization'));
        console.log(chalk_1.default.white('  ✓ Security scanning'));
        console.log('');
        console.log(chalk_1.default.cyan('🎯 Use Ctrl+C to return to manual mode'));
        // Keep process alive
        process.stdin.resume();
    });
    return datacenter;
}

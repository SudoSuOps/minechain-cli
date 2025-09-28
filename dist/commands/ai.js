"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAICommands = createAICommands;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const agent_js_1 = require("../ai-agent/core/agent.js");
let aiAgent;
function getAI() {
    if (!aiAgent) {
        aiAgent = new agent_js_1.MineChainAI();
        // Set up event listeners
        aiAgent.on('alert', (alert) => {
            console.log(chalk_1.default.red(`🚨 Alert: ${alert.type} at ${alert.value}%`));
        });
        aiAgent.on('patterns-updated', (patterns) => {
            console.log(chalk_1.default.blue('🧠 AI: Learning patterns updated'));
        });
    }
    return aiAgent;
}
function createAICommands() {
    const ai = new commander_1.Command('ai');
    ai.description('AI agent operations and intelligence');
    // AI Status
    ai.command('status')
        .description('AI agent status')
        .action(() => {
        const agent = getAI();
        const status = agent.getSystemStatus();
        console.log('');
        console.log(chalk_1.default.green('🤖 MineChain AI Status:'));
        console.log(chalk_1.default.white('  State: ') + chalk_1.default.cyan(status.isRunning ? 'Active' : 'Learning'));
        console.log(chalk_1.default.white('  Learning: ') + chalk_1.default.cyan(status.learningMode ? 'Enabled' : 'Disabled'));
        console.log(chalk_1.default.white('  Commands: ') + chalk_1.default.cyan(status.commandsLearned + ' learned'));
        console.log(chalk_1.default.white('  Intelligence: ') + chalk_1.default.green('Ready'));
        console.log('');
    });
    // AI Memory
    ai.command('memory')
        .description('Show AI memory and patterns')
        .action(() => {
        const agent = getAI();
        const patterns = agent.getTopPatterns();
        const status = agent.getSystemStatus();
        console.log('');
        console.log(chalk_1.default.yellow('🧠 MineChain AI Memory:'));
        console.log('');
        console.log(chalk_1.default.white('Commands Learned: ') + chalk_1.default.cyan(status.commandsLearned));
        console.log(chalk_1.default.white('Patterns Recognized: ') + chalk_1.default.cyan(status.patternsRecognized));
        console.log('');
        if (patterns.length > 0) {
            console.log(chalk_1.default.yellow('🔥 Top Command Patterns:'));
            patterns.forEach(([pattern, count], index) => {
                console.log(chalk_1.default.white(`  ${index + 1}. ${pattern}: `) + chalk_1.default.cyan(`${count} times`));
            });
        }
        console.log('');
    });
    // Start autonomous mode
    ai.command('autonomous')
        .description('Start autonomous monitoring')
        .action(() => {
        const agent = getAI();
        agent.startAutonomousMode();
        console.log('');
        console.log(chalk_1.default.green('🤖 Autonomous Mode Activated!'));
        console.log(chalk_1.default.white('AI agent is now monitoring and learning...'));
        console.log('');
    });
    return ai;
}

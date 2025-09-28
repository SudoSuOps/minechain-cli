"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFullPortCommands = createFullPortCommands;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const market_scanner_js_1 = require("../modules/intelligence/market-scanner.js");
const infra_manager_js_1 = require("../modules/infrastructure/infra-manager.js");
const notification_engine_js_1 = require("../modules/notifications/notification-engine.js");
const workflow_manager_js_1 = require("../modules/workflows/workflow-manager.js");
let marketScanner;
let infraManager;
let notifications;
let workflowManager;
function initializeServices() {
    if (!marketScanner) {
        marketScanner = new market_scanner_js_1.MarketScanner();
        infraManager = new infra_manager_js_1.InfrastructureManager();
        // Initialize notifications (configure based on environment)
        notifications = new notification_engine_js_1.NotificationEngine({
            telegram: {
                botToken: process.env.TELEGRAM_BOT_TOKEN || '',
                chatId: process.env.TELEGRAM_CHAT_ID || ''
            },
            slack: {
                token: process.env.SLACK_TOKEN || '',
                channel: process.env.SLACK_CHANNEL || '#minechain-alerts'
            }
        });
        workflowManager = new workflow_manager_js_1.WorkflowManager();
        // Set up event listeners
        marketScanner.on('gpu-deals', (deals) => {
            deals.forEach(deal => notifications.sendAlert(notifications.gpuDealAlert(deal)));
        });
        marketScanner.on('token-signal', (signal) => {
            notifications.sendAlert(notifications.tokenSignalAlert(signal));
        });
    }
}
function createFullPortCommands() {
    const fullport = new commander_1.Command('fullport');
    fullport.description('🏭 Full Port Operations Suite');
    // Market Intelligence Commands
    fullport.command('scan')
        .description('🔍 Run comprehensive market scan')
        .option('--gpu', 'Scan GPU deals only')
        .option('--tokens', 'Scan token signals only')
        .option('--projects', 'Scan new projects only')
        .action(async (options) => {
        initializeServices();
        console.log(chalk_1.default.blue('🔍 Starting comprehensive market scan...'));
        if (options.gpu || !Object.keys(options).length) {
            const deals = await marketScanner.scanGPUDeals();
            console.log(chalk_1.default.green(`Found ${deals.length} GPU listings`));
        }
        if (options.tokens || !Object.keys(options).length) {
            const signals = await marketScanner.scanTokenSignals();
            console.log(chalk_1.default.green(`Analyzed ${signals.length} token signals`));
        }
        if (options.projects || !Object.keys(options).length) {
            const projects = await marketScanner.scanNewProjects();
            console.log(chalk_1.default.green(`Discovered ${projects.length} projects`));
        }
        console.log(chalk_1.default.cyan('✅ Market scan complete'));
    });
    // Infrastructure Operations
    fullport.command('deploy')
        .description('🚀 Deploy infrastructure components')
        .option('--akash', 'Deploy Akash provider')
        .option('--inference', 'Deploy AI inference service')
        .option('--monai', 'Deploy MONAI pipeline')
        .option('--replicas <n>', 'Number of replicas', '2')
        .action(async (options) => {
        initializeServices();
        if (options.akash) {
            console.log(chalk_1.default.blue('☁️ Deploying Akash provider...'));
            await infraManager.deployAkashProvider();
        }
        if (options.inference) {
            console.log(chalk_1.default.blue('🧠 Deploying AI inference service...'));
            await infraManager.scaleInferencePods(parseInt(options.replicas));
        }
        if (options.monai) {
            console.log(chalk_1.default.blue('🏥 Deploying MONAI pipeline...'));
            await infraManager.deployMonaiPipeline();
        }
        console.log(chalk_1.default.green('✅ Deployment complete'));
    });
    // Automation & Workflows
    fullport.command('automate')
        .description('⚡ Start automation workflows')
        .option('--n8n', 'Start n8n workflow engine')
        .option('--webhooks', 'Start webhook server')
        .option('--monitor', 'Start real-time monitoring')
        .action(async (options) => {
        initializeServices();
        if (options.n8n) {
            console.log(chalk_1.default.blue('🔄 Starting n8n workflow engine...'));
            await workflowManager.startN8nInstance();
        }
        if (options.webhooks) {
            console.log(chalk_1.default.blue('🔗 Starting webhook server...'));
            await workflowManager.startWebhookServer();
        }
        if (options.monitor) {
            console.log(chalk_1.default.blue('📊 Starting real-time monitoring...'));
            marketScanner.startRealTimeScanning();
        }
        console.log(chalk_1.default.green('🎯 Automation systems active'));
    });
    // Notifications & Alerts
    fullport.command('notify')
        .description('📱 Test notification systems')
        .option('--test', 'Send test notification')
        .option('--setup', 'Setup notification channels')
        .action(async (options) => {
        initializeServices();
        if (options.test) {
            console.log(chalk_1.default.blue('📤 Sending test notification...'));
            await notifications.sendAlert({
                type: 'info',
                title: 'MineChain Test',
                message: 'Full port operations CLI is working correctly!',
                timestamp: new Date(),
                priority: 5
            });
        }
        if (options.setup) {
            console.log(chalk_1.default.blue('⚙️ Notification setup:'));
            console.log(chalk_1.default.white('Add these environment variables:'));
            console.log(chalk_1.default.gray('TELEGRAM_BOT_TOKEN=your_bot_token'));
            console.log(chalk_1.default.gray('TELEGRAM_CHAT_ID=your_chat_id'));
            console.log(chalk_1.default.gray('SLACK_TOKEN=xoxb-your-token'));
            console.log(chalk_1.default.gray('SLACK_CHANNEL=#minechain-alerts'));
        }
        console.log(chalk_1.default.green('✅ Notification test complete'));
    });
    // System Status
    fullport.command('status')
        .description('📊 Complete system status')
        .action(async () => {
        initializeServices();
        console.log(chalk_1.default.yellow('📊 Full Port Operations Status:'));
        console.log('');
        const infraStatus = await infraManager.getSystemStatus();
        const marketData = marketScanner.getIntelligence();
        const workflows = workflowManager.getWorkflows();
        console.log(chalk_1.default.green('🏭 Infrastructure:'));
        console.log(chalk_1.default.white(`  Kubernetes: ${infraStatus.kubernetes.nodes} nodes, ${infraStatus.kubernetes.pods} pods`));
        console.log(chalk_1.default.white(`  Docker: ${infraStatus.docker.containers} containers`));
        console.log(chalk_1.default.white(`  GPU: ${infraStatus.gpu.temperature}°C, ${infraStatus.gpu.utilization}% util`));
        console.log('');
        console.log(chalk_1.default.green('📊 Market Intelligence:'));
        console.log(chalk_1.default.white(`  GPU Deals: ${marketData.gpuDeals.length} monitored`));
        console.log(chalk_1.default.white(`  Token Signals: ${marketData.tokenAlerts.length} active`));
        console.log(chalk_1.default.white(`  Projects: ${marketData.projectDiscovery.length} tracked`));
        console.log('');
        console.log(chalk_1.default.green('⚡ Automation:'));
        console.log(chalk_1.default.white(`  Workflows: ${workflows.length} configured`));
        console.log(chalk_1.default.white(`  Active: ${workflows.filter(w => w.active).length} running`));
        console.log('');
        console.log(chalk_1.default.cyan('🎯 Status: FULL PORT OPERATIONS ACTIVE'));
    });
    // Revenue Operations
    fullport.command('revenue')
        .description('💰 Revenue optimization and tracking')
        .option('--optimize', 'Run revenue optimization')
        .option('--report', 'Generate revenue report')
        .action(async (options) => {
        initializeServices();
        if (options.optimize) {
            console.log(chalk_1.default.blue('💡 Optimizing revenue streams...'));
            await infraManager.optimizeResourceAllocation();
            // Send revenue optimization alert
            await notifications.sendAlert({
                type: 'info',
                title: 'Revenue Optimization Complete',
                message: 'Resource allocation optimized for maximum earnings',
                timestamp: new Date(),
                priority: 6
            });
        }
        if (options.report) {
            console.log(chalk_1.default.blue('📈 Generating revenue report...'));
            console.log(chalk_1.default.white('Revenue Streams:'));
            console.log(chalk_1.default.white('  Akash Provider: $180/month (estimated)'));
            console.log(chalk_1.default.white('  AI Inference: $150/month (estimated)'));
            console.log(chalk_1.default.white('  Security Auditing: $300/month (potential)'));
            console.log(chalk_1.default.white('  MONAI Services: $400/month (potential)'));
            console.log(chalk_1.default.green('  Total Potential: $1,030/month'));
        }
        console.log(chalk_1.default.green('✅ Revenue operations complete'));
    });
    return fullport;
}

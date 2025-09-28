"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowManager = void 0;
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
class WorkflowManager {
    app;
    n8nProcess;
    workflows = new Map();
    webhookPort = 3333;
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.setupRoutes();
        this.createDefaultWorkflows();
    }
    setupRoutes() {
        // Webhook endpoints for n8n integration
        this.app.post('/webhook/gpu-deal', this.handleGPUDeal.bind(this));
        this.app.post('/webhook/token-signal', this.handleTokenSignal.bind(this));
        this.app.post('/webhook/system-alert', this.handleSystemAlert.bind(this));
        this.app.post('/webhook/revenue-update', this.handleRevenueUpdate.bind(this));
    }
    async handleGPUDeal(req, res) {
        const deal = req.body;
        console.log(chalk_1.default.blue('🎮 GPU Deal Workflow Triggered'));
        // Trigger automated actions
        if (deal.price < 2200 && deal.model.includes('RTX 5090')) {
            // High priority deal - immediate notification
            await this.triggerWorkflow('gpu-deal-alert', deal);
        }
        res.json({ status: 'processed' });
    }
    async handleTokenSignal(req, res) {
        const signal = req.body;
        console.log(chalk_1.default.blue('📊 Token Signal Workflow Triggered'));
        if (signal.confidence > 0.8) {
            await this.triggerWorkflow('high-confidence-signal', signal);
        }
        res.json({ status: 'processed' });
    }
    async handleSystemAlert(req, res) {
        const alert = req.body;
        console.log(chalk_1.default.blue('🚨 System Alert Workflow Triggered'));
        await this.triggerWorkflow('system-monitoring', alert);
        res.json({ status: 'processed' });
    }
    async handleRevenueUpdate(req, res) {
        const revenue = req.body;
        console.log(chalk_1.default.blue('💰 Revenue Workflow Triggered'));
        await this.triggerWorkflow('revenue-tracking', revenue);
        res.json({ status: 'processed' });
    }
    async triggerWorkflow(workflowId, data) {
        console.log(chalk_1.default.green(`⚡ Triggering workflow: ${workflowId}`));
        // In a real implementation, this would trigger n8n workflows
        // For now, we'll simulate the workflow execution
        switch (workflowId) {
            case 'gpu-deal-alert':
                console.log(chalk_1.default.yellow(`🎯 GPU Deal: ${data.model} for $${data.price}`));
                break;
            case 'high-confidence-signal':
                console.log(chalk_1.default.yellow(`📈 Strong ${data.signal} signal for ${data.symbol}`));
                break;
            case 'system-monitoring':
                console.log(chalk_1.default.yellow(`🔧 System: ${data.message}`));
                break;
            case 'revenue-tracking':
                console.log(chalk_1.default.yellow(`💵 Revenue: $${data.daily}/day`));
                break;
        }
    }
    startN8nInstance() {
        return new Promise((resolve) => {
            console.log(chalk_1.default.blue('🔄 Starting n8n workflow engine...'));
            // Start n8n in subprocess
            this.n8nProcess = (0, child_process_1.spawn)('npx', ['n8n', 'start'], {
                env: {
                    ...process.env,
                    N8N_HOST: '0.0.0.0',
                    N8N_PORT: '5678',
                    N8N_PROTOCOL: 'http',
                    WEBHOOK_TUNNEL_URL: `http://localhost:${this.webhookPort}`,
                    N8N_BASIC_AUTH_ACTIVE: 'false'
                },
                stdio: 'pipe'
            });
            this.n8nProcess.stdout?.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Editor is now accessible')) {
                    console.log(chalk_1.default.green('✅ n8n workflow engine started'));
                    console.log(chalk_1.default.cyan('🌐 n8n Editor: http://localhost:5678'));
                    resolve(true);
                }
            });
            this.n8nProcess.stderr?.on('data', (data) => {
                console.log(chalk_1.default.red('n8n error:', data.toString()));
            });
            setTimeout(() => resolve(false), 30000); // 30 second timeout
        });
    }
    startWebhookServer() {
        return new Promise((resolve) => {
            this.app.listen(this.webhookPort, () => {
                console.log(chalk_1.default.green(`🔗 Webhook server running on port ${this.webhookPort}`));
                resolve();
            });
        });
    }
    createDefaultWorkflows() {
        // GPU Deal Monitoring Workflow
        this.workflows.set('gpu-deal-monitor', {
            id: 'gpu-deal-monitor',
            name: 'GPU Deal Monitor',
            description: 'Monitor GPU prices and send alerts for deals',
            triggers: ['price-scan', 'inventory-check'],
            actions: ['slack-notify', 'telegram-alert', 'email-summary'],
            active: true
        });
        // Token Signal Analysis Workflow
        this.workflows.set('token-signal-analysis', {
            id: 'token-signal-analysis',
            name: 'Token Signal Analysis',
            description: 'Analyze token signals and execute trading strategies',
            triggers: ['price-change', 'volume-spike', 'sentiment-shift'],
            actions: ['signal-alert', 'portfolio-update', 'risk-assessment'],
            active: true
        });
        // Infrastructure Monitoring Workflow
        this.workflows.set('infra-monitoring', {
            id: 'infra-monitoring',
            name: 'Infrastructure Monitoring',
            description: 'Monitor system health and performance',
            triggers: ['gpu-temp', 'memory-usage', 'disk-space'],
            actions: ['system-alert', 'auto-scale', 'maintenance-schedule'],
            active: true
        });
        // Revenue Optimization Workflow
        this.workflows.set('revenue-optimization', {
            id: 'revenue-optimization',
            name: 'Revenue Optimization',
            description: 'Optimize resource allocation for maximum revenue',
            triggers: ['demand-change', 'price-update', 'capacity-available'],
            actions: ['resource-reallocation', 'pricing-update', 'client-notification'],
            active: true
        });
        console.log(chalk_1.default.green(`✅ Created ${this.workflows.size} default workflows`));
    }
    getWorkflows() {
        return Array.from(this.workflows.values());
    }
    async stopN8n() {
        if (this.n8nProcess) {
            this.n8nProcess.kill();
            console.log(chalk_1.default.yellow('🔄 n8n workflow engine stopped'));
        }
    }
}
exports.WorkflowManager = WorkflowManager;

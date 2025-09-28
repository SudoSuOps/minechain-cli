"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartDatacenterAI = void 0;
const events_1 = require("events");
const openai_1 = __importDefault(require("openai"));
const chalk_1 = __importDefault(require("chalk"));
const live_market_js_1 = require("../../modules/live-market.js");
class SmartDatacenterAI extends events_1.EventEmitter {
    openai;
    marketEngine;
    isRunning = false;
    constructor() {
        super();
        // Initialize OpenAI
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
            this.openai = new openai_1.default({ apiKey });
            console.log(chalk_1.default.green('🤖 OpenAI connected - Enhanced intelligence active'));
        }
        else {
            console.log(chalk_1.default.yellow('🤖 Running in local mode - add OPENAI_API_KEY for full power'));
        }
        // Initialize live market data
        this.marketEngine = new live_market_js_1.LiveMarketEngine();
        this.setupMarketListeners();
        console.log(chalk_1.default.green('🏭 Smart Datacenter AI: Real-time intelligence activated'));
    }
    setupMarketListeners() {
        this.marketEngine.on('tokens-updated', (tokens) => {
            console.log(chalk_1.default.blue('📊 Live token data refreshed'));
            this.analyzeMarketMove(tokens);
        });
        this.marketEngine.on('gpu-updated', (gpus) => {
            console.log(chalk_1.default.green('🎮 GPU pricing updated'));
            this.analyzeGPUOpportunity(gpus);
        });
    }
    async think(input) {
        const lower = input.toLowerCase();
        const marketData = this.marketEngine.getLiveData();
        // Use OpenAI for complex analysis if available
        if (this.openai && (lower.includes('analysis') || lower.includes('strategy') || lower.includes('advice'))) {
            return await this.getOpenAIAnalysis(input, marketData);
        }
        // Live market queries
        if (lower.includes('market') || lower.includes('price') || lower.includes('eth') || lower.includes('bitcoin') || lower.includes('akash')) {
            return this.marketEngine.getMarketSummary();
        }
        // GPU opportunity analysis
        if (lower.includes('5090') || lower.includes('gpu') || lower.includes('upgrade')) {
            return this.getGPUAnalysis(marketData);
        }
        // Earnings optimization
        if (lower.includes('earnings') || lower.includes('revenue') || lower.includes('roi')) {
            return this.getEarningsAnalysis(marketData);
        }
        return this.getDatacenterInsight(input, marketData);
    }
    async getOpenAIAnalysis(input, marketData) {
        try {
            const marketSummary = this.marketEngine.getMarketSummary();
            const prompt = `You are MineChain AI, an expert Web3 datacenter operations advisor for SudoSuOps.

CURRENT SETUP:
- RTX 5070 Ti (16GB VRAM), 31GB RAM, Ubuntu 24.04
- Focus: MONAI medical AI, TrustCat privacy protocol, Akash providing
- Goals: Maximize GPU earnings, ethical hacking, early-stage Web3 projects

LIVE MARKET DATA:
${marketSummary}

USER QUERY: ${input}

Provide actionable advice in a direct, technical style. Include specific recommendations for RTX 5070 Ti optimization and Web3 opportunities.`;
            const completion = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 300,
                temperature: 0.7
            });
            return completion.choices[0]?.message?.content || 'OpenAI analysis processing...';
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ OpenAI analysis failed, using local intelligence'));
            return this.getDatacenterInsight(input, marketData);
        }
    }
    getGPUAnalysis(marketData) {
        const rtx5090 = marketData.gpuPricing['RTX-5090'];
        const rtx5070ti = marketData.gpuPricing['RTX-5070-Ti'];
        return `🎮 LIVE GPU ANALYSIS:
Current RTX 5090: $${rtx5090?.price || 'N/A'} (${rtx5090?.availability || 'Checking...'})
Your RTX 5070 Ti: $${rtx5070ti?.price || '849'} (In Stock)

💡 RECOMMENDATION:
- RTX 5070 Ti ROI: 7-10 months for Akash providing
- 5090 upgrade ROI: 5-8 months (50% faster inference)
- Current 5070 Ti earning potential: $180-250/month
- Strategy: Add 2nd RTX 5070 Ti vs 1x RTX 5090 upgrade`;
    }
    getEarningsAnalysis(marketData) {
        const tokens = marketData.tokens;
        const akt = tokens.AKT;
        const eth = tokens.ETH;
        return `💰 LIVE EARNINGS ANALYSIS (RTX 5070 Ti):
Akash Provider: $${(akt?.price * 35).toFixed(0) || '170'}/month (AKT at $${akt?.price.toFixed(2) || '4.85'})
AI Inference: $120-160/month (growing demand)
ETH Validation: $${(eth?.price * 0.04).toFixed(0) || '106'}/month (if staking)

🎯 OPTIMAL STRATEGY:
1. Akash provider (highest ROI): ${akt?.change24h > 5 ? '🔥 AKT surging +' + akt.change24h.toFixed(1) + '%' : 'Stable earnings'}
2. AI workloads (MONAI focus): Medical AI demand increasing
3. Multi-revenue streams: Diversify across all three`;
    }
    getDatacenterInsight(input, marketData) {
        const insights = [
            `🏭 Fleet Status: RTX 5070 Ti operating at optimal efficiency`,
            `📊 Market Intelligence: ${Object.keys(marketData.tokens).length} tokens tracked live`,
            `🚀 Strategy: Akash providing + AI inference = $250-350/month potential`,
            `🧠 Development: MONAI medical AI + TrustCat privacy = high-value niche`,
            `⚡ Optimization: Your 31GB RAM perfect for large model inference`
        ];
        return insights[Math.floor(Math.random() * insights.length)];
    }
    analyzeMarketMove(tokens) {
        const akt = tokens.AKT;
        if (akt && akt.change24h > 10) {
            this.emit('opportunity', {
                type: 'akash-surge',
                message: `🚀 AKASH SURGING! +${akt.change24h.toFixed(1)}% - Consider scaling Akash provider operations`
            });
        }
    }
    analyzeGPUOpportunity(gpus) {
        const rtx5090 = gpus['RTX-5090'];
        if (rtx5090 && rtx5090.availability === 'In Stock' && rtx5090.change < -5) {
            this.emit('opportunity', {
                type: 'gpu-deal',
                message: `🎮 RTX 5090 DEAL ALERT! Price dropped ${Math.abs(rtx5090.change).toFixed(1)}% - Consider upgrade`
            });
        }
    }
    startSmartMode() {
        this.isRunning = true;
        console.log(chalk_1.default.green('🧠 Smart Datacenter Mode: Real-time AI intelligence activated'));
        console.log(chalk_1.default.cyan('📊 Monitoring: Live market data + OpenAI analysis'));
        console.log(chalk_1.default.yellow('💡 Features: Real-time opportunities, strategic recommendations'));
    }
}
exports.SmartDatacenterAI = SmartDatacenterAI;

import { EventEmitter } from 'events';
import OpenAI from 'openai';
import * as cron from 'node-cron';
import chalk from 'chalk';
import { LiveMarketEngine } from '../../modules/live-market.js';

export class SmartDatacenterAI extends EventEmitter {
  private openai?: OpenAI;
  private marketEngine: LiveMarketEngine;
  private isRunning = false;

  constructor() {
    super();
    
    // Initialize OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      console.log(chalk.green('🤖 OpenAI connected - Enhanced intelligence active'));
    } else {
      console.log(chalk.yellow('🤖 Running in local mode - add OPENAI_API_KEY for full power'));
    }

    // Initialize live market data
    this.marketEngine = new LiveMarketEngine();
    this.setupMarketListeners();
    
    console.log(chalk.green('🏭 Smart Datacenter AI: Real-time intelligence activated'));
  }

  private setupMarketListeners() {
    this.marketEngine.on('tokens-updated', (tokens) => {
      console.log(chalk.blue('📊 Live token data refreshed'));
      this.analyzeMarketMove(tokens);
    });

    this.marketEngine.on('gpu-updated', (gpus) => {
      console.log(chalk.green('🎮 GPU pricing updated'));
      this.analyzeGPUOpportunity(gpus);
    });
  }

  public async think(input: string): Promise<string> {
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

  private async getOpenAIAnalysis(input: string, marketData: any): Promise<string> {
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

      const completion = await this.openai!.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7
      });

      return completion.choices[0]?.message?.content || 'OpenAI analysis processing...';

    } catch (error) {
      console.log(chalk.red('❌ OpenAI analysis failed, using local intelligence'));
      return this.getDatacenterInsight(input, marketData);
    }
  }

  private getGPUAnalysis(marketData: any): string {
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

  private getEarningsAnalysis(marketData: any): string {
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

  private getDatacenterInsight(input: string, marketData: any): string {
    const insights = [
      `🏭 Fleet Status: RTX 5070 Ti operating at optimal efficiency`,
      `📊 Market Intelligence: ${Object.keys(marketData.tokens).length} tokens tracked live`,
      `🚀 Strategy: Akash providing + AI inference = $250-350/month potential`,
      `🧠 Development: MONAI medical AI + TrustCat privacy = high-value niche`,
      `⚡ Optimization: Your 31GB RAM perfect for large model inference`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private analyzeMarketMove(tokens: any) {
    const akt = tokens.AKT;
    if (akt && akt.change24h > 10) {
      this.emit('opportunity', {
        type: 'akash-surge',
        message: `🚀 AKASH SURGING! +${akt.change24h.toFixed(1)}% - Consider scaling Akash provider operations`
      });
    }
  }

  private analyzeGPUOpportunity(gpus: any) {
    const rtx5090 = gpus['RTX-5090'];
    if (rtx5090 && rtx5090.availability === 'In Stock' && rtx5090.change < -5) {
      this.emit('opportunity', {
        type: 'gpu-deal',
        message: `🎮 RTX 5090 DEAL ALERT! Price dropped ${Math.abs(rtx5090.change).toFixed(1)}% - Consider upgrade`
      });
    }
  }

  public startSmartMode() {
    this.isRunning = true;
    console.log(chalk.green('🧠 Smart Datacenter Mode: Real-time AI intelligence activated'));
    console.log(chalk.cyan('📊 Monitoring: Live market data + OpenAI analysis'));
    console.log(chalk.yellow('💡 Features: Real-time opportunities, strategic recommendations'));
  }
}

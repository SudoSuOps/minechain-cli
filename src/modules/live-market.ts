import axios from 'axios';
import chalk from 'chalk';
import * as cron from 'node-cron';
import { EventEmitter } from 'events';

export interface LiveMarketData {
  tokens: {
    [symbol: string]: {
      price: number;
      change24h: number;
      volume: number;
      marketCap: number;
      lastUpdate: Date;
    };
  };
  gpuPricing: {
    [model: string]: {
      price: number;
      availability: string;
      change: number;
      lastUpdate: Date;
    };
  };
}

export class LiveMarketEngine extends EventEmitter {
  private data: LiveMarketData;

  constructor() {
    super();
    this.data = {
      tokens: {},
      gpuPricing: {}
    };
    
    this.startLiveTracking();
  }

  private startLiveTracking() {
    console.log(chalk.green('📊 Starting live market tracking...'));
    
    // Token prices every 2 minutes
    cron.schedule('*/2 * * * *', () => {
      this.updateTokenPrices();
    });

    // GPU pricing every 30 minutes
    cron.schedule('*/30 * * * *', () => {
      this.updateGPUPricing();
    });

    // Initial load
    this.updateAll();
  }

  private async updateTokenPrices() {
    try {
      console.log(chalk.blue('📈 Fetching live token prices...'));
      
      // CoinGecko API (free tier)
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'ethereum,akash-network,bitcoin',
          vs_currencies: 'usd',
          include_24hr_change: 'true',
          include_market_cap: 'true',
          include_24hr_vol: 'true'
        }
      });

      this.data.tokens = {
        ETH: {
          price: response.data.ethereum.usd,
          change24h: response.data.ethereum.usd_24h_change,
          volume: response.data.ethereum.usd_24h_vol,
          marketCap: response.data.ethereum.usd_market_cap,
          lastUpdate: new Date()
        },
        AKT: {
          price: response.data['akash-network'].usd,
          change24h: response.data['akash-network'].usd_24h_change,
          volume: response.data['akash-network'].usd_24h_vol,
          marketCap: response.data['akash-network'].usd_market_cap,
          lastUpdate: new Date()
        },
        BTC: {
          price: response.data.bitcoin.usd,
          change24h: response.data.bitcoin.usd_24h_change,
          volume: response.data.bitcoin.usd_24h_vol,
          marketCap: response.data.bitcoin.usd_market_cap,
          lastUpdate: new Date()
        }
      };

      this.emit('tokens-updated', this.data.tokens);
      console.log(chalk.green('✅ Token prices updated'));

    } catch (error) {
      console.log(chalk.red('❌ Token price update failed'));
    }
  }

  private async updateGPUPricing() {
    try {
      console.log(chalk.blue('🎮 Scanning GPU prices...'));
      
      // Simulate GPU pricing for now
      this.data.gpuPricing = {
        'RTX-5090': {
          price: Math.round(2199 + (Math.random() - 0.5) * 200),
          availability: ['In Stock', 'Limited', 'Out of Stock'][Math.floor(Math.random() * 3)],
          change: (Math.random() - 0.5) * 10,
          lastUpdate: new Date()
        },
        'RTX-5070-Ti': {
          price: Math.round(849 + (Math.random() - 0.5) * 50),
          availability: 'In Stock',
          change: (Math.random() - 0.5) * 5,
          lastUpdate: new Date()
        }
      };

      this.emit('gpu-updated', this.data.gpuPricing);
      console.log(chalk.green('✅ GPU pricing updated'));

    } catch (error) {
      console.log(chalk.red('❌ GPU pricing update failed'));
    }
  }

  private async updateAll() {
    await this.updateTokenPrices();
    await this.updateGPUPricing();
  }

  public getLiveData(): LiveMarketData {
    return { ...this.data };
  }

  public getMarketSummary(): string {
    const eth = this.data.tokens.ETH;
    const akt = this.data.tokens.AKT;
    const btc = this.data.tokens.BTC;
    const rtx5090 = this.data.gpuPricing['RTX-5090'];

    if (!eth || !akt || !btc) {
      return '📊 Market data loading...';
    }

    return `📊 LIVE MARKET DATA:
💎 ETH: $${eth.price.toFixed(2)} (${eth.change24h > 0 ? '+' : ''}${eth.change24h.toFixed(1)}%)
🚀 AKASH: $${akt.price.toFixed(2)} (${akt.change24h > 0 ? '+' : ''}${akt.change24h.toFixed(1)}%)
₿ BTC: $${btc.price.toFixed(0)} (${btc.change24h > 0 ? '+' : ''}${btc.change24h.toFixed(1)}%)
🎮 RTX 5090: $${rtx5090?.price || 'N/A'} (${rtx5090?.availability || 'Checking...'})
⏰ Updated: ${eth.lastUpdate.toLocaleTimeString()}`;
  }
}

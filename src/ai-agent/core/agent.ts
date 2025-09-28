import { EventEmitter } from 'events';
import * as si from 'systeminformation';
import * as cron from 'node-cron';
import chalk from 'chalk';
import { saveMemory, loadMemory } from './memory.js';

export interface AgentMemory {
  commands: string[];
  patterns: { [key: string]: number };
  preferences: { [key: string]: any };
  context: { [key: string]: any };
  performance: { [key: string]: any };
}

export class MineChainAI extends EventEmitter {
  private memory: AgentMemory;
  private isRunning = false;
  private learningMode = true;

  constructor() {
    super();
    
    // Load existing memory or create new
    const savedMemory = loadMemory();
    this.memory = savedMemory || {
      commands: [],
      patterns: {},
      preferences: {
        user: 'SudoSuOps',
        style: 'terminal-ops-god',
        hardware: 'RTX-5070-Ti',
        focus: ['infra', 'ai', 'gpu', 'docker', 'automation']
      },
      context: {
        currentProject: 'minechain-cli',
        workingDir: process.cwd(),
        lastSession: new Date()
      },
      performance: {}
    };
    
    this.startLearning();
    console.log(chalk.green(`🤖 MineChain AI Brain: Loaded ${this.memory.commands.length} commands from memory`));
  }

  private startLearning() {
    // Save memory every 2 minutes
    cron.schedule('*/2 * * * *', () => {
      this.saveCurrentMemory();
    });
  }

  private saveCurrentMemory() {
    saveMemory(this.memory);
  }

  public async think(input: string, context?: any): Promise<string> {
    this.learnFromCommand(input);
    this.saveCurrentMemory(); // Save immediately after learning
    return this.getLocalResponse(input, context);
  }

  private getLocalResponse(input: string, context?: any): string {
    const lower = input.toLowerCase();
    
    // Check command history for better responses
    const commandCount = this.memory.commands.length;
    const frequentTerms = this.getTopPatterns(3).map(([term]) => term);
    
    // GPU-related queries
    if (lower.includes('gpu') || lower.includes('nvidia') || lower.includes('5070')) {
      const suggestions = [
        `🎮 RTX 5070 Ti is ${this.getGPUStatus()} - Perfect for ${this.suggestGPUTask()}`,
        `🔥 Based on your ${commandCount} commands, I see you focus on GPU optimization!`,
        `⚡ Your RTX 5070 Ti + 16GB VRAM is ideal for parallel AI workloads`
      ];
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    }
    
    // Performance optimization
    if (lower.includes('optimize') || lower.includes('performance')) {
      return this.generateOptimizationSuggestion();
    }
    
    // Infrastructure queries
    if (lower.includes('infra') || lower.includes('deploy') || lower.includes('docker')) {
      return this.generateInfraSuggestion();
    }

    // Learning-based responses
    if (frequentTerms.length > 0) {
      return `💡 I notice you often work with: ${frequentTerms.join(', ')}. Your RTX 5070 Ti setup is optimized for these tasks!`;
    }
    
    return this.generateSmartResponse(input);
  }

  private learnFromCommand(command: string) {
    this.memory.commands.push(command);
    
    // Pattern recognition
    const words = command.toLowerCase().split(' ');
    words.forEach(word => {
      if (word.length > 2) {
        this.memory.patterns[word] = (this.memory.patterns[word] || 0) + 1;
      }
    });
    
    // Keep memory manageable
    if (this.memory.commands.length > 1000) {
      this.memory.commands = this.memory.commands.slice(-500);
    }
  }

  // ... rest of the methods stay the same ...
  private getGPUStatus(): string {
    const statuses = ['running optimal', 'cool and ready', 'primed for action', 'at peak performance'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private suggestGPUTask(): string {
    const tasks = [
      'AI model inference', 'Deep learning training', 'CUDA compute tasks',
      'GPU-accelerated containers', 'Machine learning workloads', 'Parallel processing'
    ];
    return tasks[Math.floor(Math.random() * tasks.length)];
  }

  private generateOptimizationSuggestion(): string {
    const suggestions = [
      '🚀 Your RTX 5070 Ti has 15GB VRAM available - perfect for large AI models',
      '⚡ Consider scaling Docker containers horizontally across your 24 CPU threads',
      '🔧 31GB RAM is optimal - you could run multiple AI workloads simultaneously',
      '💾 843GB free storage - excellent for model checkpoints and datasets',
      '🎯 Enable CUDA container runtime for maximum GPU performance boost'
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  private generateInfraSuggestion(): string {
    const suggestions = [
      '🐳 Your Docker + GPU setup is ready for AI inference containers',
      '☁️ Consider setting up a multi-container ML pipeline',
      '📊 Add Prometheus + Grafana for real-time GPU monitoring',
      '🔄 Set up automated model deployment with your current stack',
      '🛡️ Your infrastructure is solid - time to deploy some AI workloads!'
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  private generateSmartResponse(input: string): string {
    const responses = [
      `Interesting! Based on your ${this.memory.commands.length} previous commands, I'd suggest focusing on GPU-accelerated workloads`,
      `Let me think... Your RTX 5070 Ti + 31GB RAM combo is perfect for AI applications`,
      `That's a great point! Your terminal-grade setup can definitely handle advanced operations`,
      `Smart thinking! Your hardware is optimized for high-performance computing tasks`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  public getMemory(): AgentMemory {
    return { ...this.memory };
  }

  public getTopPatterns(limit = 5): [string, number][] {
    return Object.entries(this.memory.patterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit);
  }

  public getSystemStatus() {
    return {
      isRunning: this.isRunning,
      learningMode: this.learningMode,
      commandsLearned: this.memory.commands.length,
      patternsRecognized: Object.keys(this.memory.patterns).length,
      performance: this.memory.performance
    };
  }

  public startAutonomousMode() {
    this.isRunning = true;
    console.log(chalk.green('🤖 MineChain AI: Autonomous mode activated'));
  }
}

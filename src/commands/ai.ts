import { Command } from 'commander';
import chalk from 'chalk';
import { MineChainAI } from '../ai-agent/core/agent.js';

let aiAgent: MineChainAI;

function getAI(): MineChainAI {
  if (!aiAgent) {
    aiAgent = new MineChainAI();
    
    // Set up event listeners
    aiAgent.on('alert', (alert) => {
      console.log(chalk.red(`🚨 Alert: ${alert.type} at ${alert.value}%`));
    });
    
    aiAgent.on('patterns-updated', (patterns) => {
      console.log(chalk.blue('🧠 AI: Learning patterns updated'));
    });
  }
  return aiAgent;
}

export function createAICommands(): Command {
  const ai = new Command('ai');
  ai.description('AI agent operations and intelligence');

  // AI Status
  ai.command('status')
    .description('AI agent status')
    .action(() => {
      const agent = getAI();
      const status = agent.getSystemStatus();
      
      console.log('');
      console.log(chalk.green('🤖 MineChain AI Status:'));
      console.log(chalk.white('  State: ') + chalk.cyan(status.isRunning ? 'Active' : 'Learning'));
      console.log(chalk.white('  Learning: ') + chalk.cyan(status.learningMode ? 'Enabled' : 'Disabled'));
      console.log(chalk.white('  Commands: ') + chalk.cyan(status.commandsLearned + ' learned'));
      console.log(chalk.white('  Intelligence: ') + chalk.green('Ready'));
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
      console.log(chalk.yellow('🧠 MineChain AI Memory:'));
      console.log('');
      console.log(chalk.white('Commands Learned: ') + chalk.cyan(status.commandsLearned));
      console.log(chalk.white('Patterns Recognized: ') + chalk.cyan(status.patternsRecognized));
      console.log('');
      
      if (patterns.length > 0) {
        console.log(chalk.yellow('🔥 Top Command Patterns:'));
        patterns.forEach(([pattern, count], index) => {
          console.log(chalk.white(`  ${index + 1}. ${pattern}: `) + chalk.cyan(`${count} times`));
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
      console.log(chalk.green('🤖 Autonomous Mode Activated!'));
      console.log(chalk.white('AI agent is now monitoring and learning...'));
      console.log('');
    });

  return ai;
}

import { Command } from 'commander';
import chalk from 'chalk';
import { DatacenterAI } from '../ai-agent/core/datacenter-ai.js';

let datacenterAI: DatacenterAI;

function getDatacenterAI(): DatacenterAI {
  if (!datacenterAI) {
    datacenterAI = new DatacenterAI();
    
    datacenterAI.on('market-updated', () => {
      console.log(chalk.blue('📊 Market data refreshed'));
    });
    
    datacenterAI.on('fleet-updated', () => {
      console.log(chalk.green('🏭 Fleet status updated'));
    });
  }
  return datacenterAI;
}

export function createDatacenterCommands(): Command {
  const datacenter = new Command('datacenter');
  datacenter.description('🏭 Datacenter operations and fleet management');

  // Datacenter status
  datacenter.command('status')
    .description('Overall datacenter status')
    .action(() => {
      const ai = getDatacenterAI();
      const status = ai.getStatus();
      
      console.log('');
      console.log(chalk.yellow('🏭 MineChain Datacenter Status:'));
      console.log('');
      console.log(chalk.green('✅ Operations: ') + chalk.white(status.isRunning ? 'Active' : 'Standby'));
      console.log(chalk.green('✅ Fleet Size: ') + chalk.white(status.fleetSize + ' nodes'));
      console.log(chalk.green('✅ Market Data: ') + chalk.white('Live tracking'));
      console.log(chalk.green('✅ AI Brain: ') + chalk.white('Learning patterns'));
      console.log('');
    });

  // Fleet management
  datacenter.command('fleet')
    .description('Fleet status and management')
    .action(async () => {
      const ai = getDatacenterAI();
      const response = await ai.think('fleet status');
      
      console.log('');
      console.log(chalk.yellow('🏭 Fleet Management:'));
      console.log(chalk.white(response));
      console.log('');
    });

  // Market intelligence
  datacenter.command('market')
    .description('Market intelligence and opportunities')
    .action(async () => {
      const ai = getDatacenterAI();
      const response = await ai.think('market intelligence');
      
      console.log('');
      console.log(chalk.yellow('📊 Market Intelligence:'));
      console.log(chalk.white(response));
      console.log('');
    });

  // Earnings report
  datacenter.command('earnings')
    .description('Revenue and earnings analysis')
    .action(async () => {
      const ai = getDatacenterAI();
      const response = await ai.think('earnings report');
      
      console.log('');
      console.log(chalk.yellow('💰 Earnings Analysis:'));
      console.log(chalk.white(response));
      console.log('');
    });

  // Development insights
  datacenter.command('dev')
    .description('MONAI and TrustCat development insights')
    .action(async () => {
      const ai = getDatacenterAI();
      const response = await ai.think('monai trustcat development');
      
      console.log('');
      console.log(chalk.yellow('🧠 Development Insights:'));
      console.log(chalk.white(response));
      console.log('');
    });

  // Autonomous mode
  datacenter.command('autonomous')
    .description('Start autonomous datacenter operations')
    .action(() => {
      const ai = getDatacenterAI();
      ai.startAutonomousMode();
      
      console.log('');
      console.log(chalk.green('🏭 Autonomous Datacenter Mode Activated!'));
      console.log(chalk.white('System is now monitoring:'));
      console.log(chalk.white('  ✓ Fleet health and performance'));
      console.log(chalk.white('  ✓ Market trends (ETH, AKASH, BTC)'));
      console.log(chalk.white('  ✓ GPU pricing (RTX 5090 availability)'));
      console.log(chalk.white('  ✓ Early-stage Web3 projects'));
      console.log(chalk.white('  ✓ Revenue optimization'));
      console.log(chalk.white('  ✓ Security scanning'));
      console.log('');
      console.log(chalk.cyan('🎯 Use Ctrl+C to return to manual mode'));
      
      // Keep process alive
      process.stdin.resume();
    });

  return datacenter;
}

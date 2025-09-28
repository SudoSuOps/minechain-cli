"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinuxCommander = void 0;
const chalk_1 = __importDefault(require("chalk"));
class LinuxCommander {
    fleetManager;
    constructor(fleetManager) {
        this.fleetManager = fleetManager;
    }
    // NVIDIA Management Commands
    async nvidiaSMI(options = '') {
        console.log(chalk_1.default.blue(`Running nvidia-smi ${options} across fleet`));
        const results = await this.fleetManager.executeFleetCommand(`nvidia-smi ${options}`);
        for (const [nodeId, result] of results) {
            console.log(chalk_1.default.yellow(`\n=== ${nodeId} ===`));
            console.log(result);
        }
    }
    async nvidiaML() {
        const commands = [
            'nvidia-ml-py --list-gpus',
            'nvidia-settings -q GPUCurrentClockFreqs',
            'nvidia-settings -q GPUPowerMizerMode'
        ];
        for (const cmd of commands) {
            console.log(chalk_1.default.blue(`\nExecuting: ${cmd}`));
            const results = await this.fleetManager.executeFleetCommand(cmd);
            for (const [nodeId, result] of results) {
                if (!result.includes('ERROR')) {
                    console.log(chalk_1.default.green(`${nodeId}: ${result.split('\n')[0]}`));
                }
            }
        }
    }
    // Docker Fleet Operations
    async dockerFleetStatus() {
        console.log(chalk_1.default.blue('Docker fleet status check'));
        const commands = [
            'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"',
            'docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"',
            'docker system df'
        ];
        for (const cmd of commands) {
            console.log(chalk_1.default.yellow(`\n--- ${cmd} ---`));
            const results = await this.fleetManager.executeFleetCommand(cmd);
            for (const [nodeId, result] of results) {
                if (result && !result.includes('ERROR')) {
                    console.log(chalk_1.default.white(`${nodeId}:`));
                    console.log(result);
                }
            }
        }
    }
    async deployKubernetesGPUCluster() {
        console.log(chalk_1.default.blue('Deploying Kubernetes GPU cluster across RTX 5090 fleet'));
        const kubernetesCommands = [
            // Install k3s on all nodes
            'curl -sfL https://get.k3s.io | sh -',
            // Enable GPU support
            'kubectl apply -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v0.14.0/nvidia-device-plugin.yml',
            // Create GPU resource quota
            `kubectl apply -f - << 'EOL'
apiVersion: v1
kind: ResourceQuota
metadata:
  name: gpu-quota
spec:
  hard:
    requests.nvidia.com/gpu: "28"
    limits.nvidia.com/gpu: "28"
EOL`
        ];
        for (let i = 0; i < kubernetesCommands.length; i++) {
            console.log(chalk_1.default.blue(`Step ${i + 1}: ${kubernetesCommands[i].split('\n')[0]}`));
            if (i === 0) {
                // Install k3s on all nodes
                await this.fleetManager.executeFleetCommand(kubernetesCommands[i]);
            }
            else {
                // Run kubectl commands on master node only
                await this.fleetManager.executeFleetCommand(kubernetesCommands[i], ['gpu-node-01']);
            }
        }
        console.log(chalk_1.default.green('✅ Kubernetes GPU cluster deployed'));
    }
    // Performance Monitoring
    async performanceMonitoring() {
        console.log(chalk_1.default.blue('Fleet performance monitoring'));
        const monitoringCommands = [
            'htop -n 1 | head -20',
            'iotop -b -n 1 | head -10',
            'nethogs -c 3 -t',
            'nvidia-smi dmon -s pucvmet -c 1'
        ];
        for (const cmd of monitoringCommands) {
            console.log(chalk_1.default.yellow(`\n--- ${cmd} ---`));
            const results = await this.fleetManager.executeFleetCommand(cmd);
            // Display condensed results
            for (const [nodeId, result] of results) {
                if (result && !result.includes('ERROR')) {
                    const lines = result.split('\n').slice(0, 3);
                    console.log(chalk_1.default.white(`${nodeId}: ${lines.join(' | ')}`));
                }
            }
        }
    }
    // Best Practices Implementation
    async implementBestPractices() {
        console.log(chalk_1.default.blue('Implementing fleet best practices'));
        const bestPracticeCommands = [
            // System optimization
            'echo "vm.swappiness=10" >> /etc/sysctl.conf',
            'echo "net.core.rmem_max=134217728" >> /etc/sysctl.conf',
            // GPU optimization
            'nvidia-smi -pm 1', // Enable persistence mode
            'nvidia-smi -acp 0', // Disable auto boost
            // Docker optimization
            'echo \'{"default-runtime": "nvidia"}\' > /etc/docker/daemon.json',
            'systemctl restart docker',
            // Security hardening
            'ufw enable',
            'fail2ban-client start',
            // Monitoring setup
            'systemctl enable nvidia-persistenced',
            'systemctl start nvidia-persistenced'
        ];
        for (const cmd of bestPracticeCommands) {
            console.log(chalk_1.default.blue(`Executing: ${cmd}`));
            await this.fleetManager.executeFleetCommand(`sudo ${cmd}`);
        }
        console.log(chalk_1.default.green('✅ Best practices implemented across fleet'));
    }
    // Workload Distribution
    async distributeWorkload(workloadType, instances) {
        console.log(chalk_1.default.blue(`Distributing ${workloadType} workload: ${instances} instances`));
        const workloadCommands = {
            'ai-inference': [
                'docker run -d --gpus all --name ai-inference-$(hostname) -p 8080:8080 minechain/ai-inference:latest',
                'docker exec ai-inference-$(hostname) python warm_up_model.py'
            ],
            'crypto-mining': [
                'docker run -d --gpus all --name miner-$(hostname) minechain/miner:latest --algo ethash --pool stratum+tcp://pool.minechain.ai:4444',
                'docker logs miner-$(hostname) | tail -5'
            ],
            'akash-provider': [
                'docker run -d --gpus all --name akash-provider-$(hostname) ghcr.io/akash-network/provider:latest',
                'docker exec akash-provider-$(hostname) provider status'
            ]
        };
        const commands = workloadCommands[workloadType];
        if (!commands) {
            console.log(chalk_1.default.red(`Unknown workload type: ${workloadType}`));
            return;
        }
        // Distribute across nodes
        const targetNodes = Array.from(this.fleetManager['nodes'].keys()).slice(0, instances);
        for (const cmd of commands) {
            console.log(chalk_1.default.blue(`Executing: ${cmd}`));
            const results = await this.fleetManager.executeFleetCommand(cmd, targetNodes);
            let successCount = 0;
            for (const [nodeId, result] of results) {
                if (!result.includes('ERROR')) {
                    successCount++;
                }
            }
            console.log(chalk_1.default.green(`✅ ${successCount}/${targetNodes.length} nodes completed`));
        }
    }
}
exports.LinuxCommander = LinuxCommander;

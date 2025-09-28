"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetManager = void 0;
const node_ssh_1 = __importDefault(require("node-ssh"));
const chalk_1 = __importDefault(require("chalk"));
const events_1 = require("events");
class FleetManager extends events_1.EventEmitter {
    nodes = new Map();
    sshConnections = new Map();
    constructor() {
        super();
        this.initializeFleet();
    }
    initializeFleet() {
        // Initialize 28 RTX 5090 nodes
        for (let i = 1; i <= 28; i++) {
            const nodeId = `gpu-node-${i.toString().padStart(2, '0')}`;
            this.nodes.set(nodeId, {
                id: nodeId,
                hostname: `gpu${i.toString().padStart(2, '0')}.minechain.local`,
                ip: `192.168.1.${100 + i}`,
                gpus: [{
                        index: 0,
                        model: 'RTX 5090',
                        memory: 32768, // 32GB VRAM
                        temperature: 0,
                        utilization: 0,
                        powerDraw: 0,
                        processes: []
                    }],
                cpu: {
                    model: 'Intel i9-14900K',
                    cores: 24,
                    threads: 32,
                    usage: 0,
                    temperature: 0
                },
                memory: {
                    total: 64, // 64GB RAM per node
                    used: 0,
                    free: 64,
                    usage: 0
                },
                status: 'offline',
                workload: 'idle',
                earnings: 0,
                uptime: 0,
                lastContact: new Date()
            });
        }
        console.log(chalk_1.default.green(`Fleet initialized: ${this.nodes.size} RTX 5090 nodes`));
    }
    async connectToFleet() {
        console.log(chalk_1.default.blue('Connecting to RTX 5090 fleet...'));
        const connectionPromises = Array.from(this.nodes.keys()).map(async (nodeId) => {
            const node = this.nodes.get(nodeId);
            try {
                const ssh = new node_ssh_1.default();
                await ssh.connect({
                    host: node.ip,
                    username: 'minechain',
                    privateKeyPath: '~/.ssh/minechain_fleet_key'
                });
                this.sshConnections.set(nodeId, ssh);
                node.status = 'online';
                node.lastContact = new Date();
                console.log(chalk_1.default.green(`✅ Connected to ${nodeId}`));
            }
            catch (error) {
                console.log(chalk_1.default.red(`❌ Failed to connect to ${nodeId}`));
                node.status = 'offline';
            }
        });
        await Promise.all(connectionPromises);
        const onlineNodes = Array.from(this.nodes.values()).filter(n => n.status === 'online').length;
        console.log(chalk_1.default.cyan(`Fleet status: ${onlineNodes}/${this.nodes.size} nodes online`));
    }
    async executeFleetCommand(command, nodeIds) {
        const targetNodes = nodeIds || Array.from(this.nodes.keys());
        const results = new Map();
        console.log(chalk_1.default.blue(`Executing command on ${targetNodes.length} nodes: ${command}`));
        const commandPromises = targetNodes.map(async (nodeId) => {
            const ssh = this.sshConnections.get(nodeId);
            if (!ssh) {
                results.set(nodeId, 'ERROR: Not connected');
                return;
            }
            try {
                const result = await ssh.execCommand(command);
                results.set(nodeId, result.stdout || result.stderr);
            }
            catch (error) {
                results.set(nodeId, `ERROR: ${error}`);
            }
        });
        await Promise.all(commandPromises);
        return results;
    }
    async getFleetStatus() {
        const statusCommands = [
            'nvidia-smi --query-gpu=index,name,memory.total,memory.used,temperature.gpu,utilization.gpu,power.draw --format=csv,noheader,nounits',
            'cat /proc/loadavg',
            'free -m',
            'uptime -p'
        ];
        for (const [nodeId, ssh] of this.sshConnections) {
            if (!ssh)
                continue;
            const node = this.nodes.get(nodeId);
            try {
                // Get GPU status
                const gpuResult = await ssh.execCommand(statusCommands[0]);
                if (gpuResult.stdout) {
                    const gpuData = gpuResult.stdout.split(', ');
                    node.gpus[0] = {
                        index: parseInt(gpuData[0]),
                        model: gpuData[1],
                        memory: parseInt(gpuData[2]),
                        temperature: parseInt(gpuData[4]),
                        utilization: parseInt(gpuData[5]),
                        powerDraw: parseInt(gpuData[6]),
                        processes: []
                    };
                }
                // Get CPU status
                const cpuResult = await ssh.execCommand(statusCommands[1]);
                if (cpuResult.stdout) {
                    const loadAvg = parseFloat(cpuResult.stdout.split(' ')[0]);
                    node.cpu.usage = Math.round((loadAvg / node.cpu.threads) * 100);
                }
                // Get memory status
                const memResult = await ssh.execCommand(statusCommands[2]);
                if (memResult.stdout) {
                    const memLines = memResult.stdout.split('\n')[1].split(/\s+/);
                    node.memory.total = parseInt(memLines[1]) / 1024; // Convert to GB
                    node.memory.used = parseInt(memLines[2]) / 1024;
                    node.memory.free = parseInt(memLines[3]) / 1024;
                    node.memory.usage = Math.round((node.memory.used / node.memory.total) * 100);
                }
                node.lastContact = new Date();
                node.status = 'online';
            }
            catch (error) {
                node.status = 'error';
            }
        }
        return Array.from(this.nodes.values());
    }
    async deployDockerWorkload(service, replicas, gpuNodes) {
        const targetNodes = gpuNodes || Array.from(this.nodes.keys()).slice(0, replicas);
        console.log(chalk_1.default.blue(`Deploying ${service} across ${targetNodes.length} RTX 5090 nodes`));
        const dockerCommands = [
            `docker pull minechain/${service}:latest`,
            `docker run -d --gpus all --name ${service}-$(hostname) --restart unless-stopped minechain/${service}:latest`
        ];
        for (const command of dockerCommands) {
            const results = await this.executeFleetCommand(command, targetNodes);
            // Check for errors
            for (const [nodeId, result] of results) {
                if (result.includes('ERROR')) {
                    console.log(chalk_1.default.red(`❌ Deploy failed on ${nodeId}: ${result}`));
                    return false;
                }
            }
        }
        console.log(chalk_1.default.green(`✅ ${service} deployed successfully across ${targetNodes.length} nodes`));
        return true;
    }
    getFleetStats() {
        const nodes = Array.from(this.nodes.values());
        const onlineNodes = nodes.filter(n => n.status === 'online');
        return {
            totalNodes: nodes.length,
            onlineNodes: onlineNodes.length,
            totalGPUs: nodes.length, // 1 GPU per node
            totalVRAM: nodes.length * 32, // 32GB per RTX 5090
            totalRAM: nodes.length * 64, // 64GB per node
            totalCores: nodes.length * 24, // 24 cores per node
            avgGPUTemp: onlineNodes.reduce((sum, n) => sum + n.gpus[0]?.temperature || 0, 0) / onlineNodes.length,
            avgGPUUtil: onlineNodes.reduce((sum, n) => sum + n.gpus[0]?.utilization || 0, 0) / onlineNodes.length,
            totalEarnings: nodes.reduce((sum, n) => sum + n.earnings, 0)
        };
    }
}
exports.FleetManager = FleetManager;

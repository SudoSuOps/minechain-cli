"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEngine = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const web_api_1 = require("@slack/web-api");
const nodemailer_1 = __importDefault(require("nodemailer"));
const chalk_1 = __importDefault(require("chalk"));
const events_1 = require("events");
class NotificationEngine extends events_1.EventEmitter {
    config;
    telegram;
    slack;
    emailTransporter;
    constructor(config) {
        super();
        this.config = config;
        this.initializeChannels();
    }
    initializeChannels() {
        // Telegram setup
        if (this.config.telegram?.botToken) {
            this.telegram = new node_telegram_bot_api_1.default(this.config.telegram.botToken, { polling: false });
            console.log(chalk_1.default.green('📱 Telegram notifications: ACTIVE'));
        }
        // Slack setup
        if (this.config.slack?.token) {
            this.slack = new web_api_1.WebClient(this.config.slack.token);
            console.log(chalk_1.default.green('💬 Slack notifications: ACTIVE'));
        }
        // Email setup
        if (this.config.email) {
            this.emailTransporter = nodemailer_1.default.createTransporter({
                host: this.config.email.smtp,
                port: 587,
                secure: false,
                auth: {
                    user: this.config.email.user,
                    pass: this.config.email.pass
                }
            });
            console.log(chalk_1.default.green('📧 Email notifications: ACTIVE'));
        }
    }
    async sendAlert(alert) {
        console.log(chalk_1.default.blue(`🚨 Sending ${alert.type} alert: ${alert.title}`));
        const message = this.formatAlert(alert);
        // Send to all configured channels based on priority
        const promises = [];
        if (alert.priority >= 7) {
            // High priority - all channels
            if (this.telegram)
                promises.push(this.sendTelegram(message));
            if (this.slack)
                promises.push(this.sendSlack(alert, message));
            if (this.emailTransporter)
                promises.push(this.sendEmail(alert, message));
        }
        else if (alert.priority >= 5) {
            // Medium priority - Slack and Telegram
            if (this.telegram)
                promises.push(this.sendTelegram(message));
            if (this.slack)
                promises.push(this.sendSlack(alert, message));
        }
        else {
            // Low priority - Slack only
            if (this.slack)
                promises.push(this.sendSlack(alert, message));
        }
        try {
            await Promise.all(promises);
            console.log(chalk_1.default.green('✅ Alert sent successfully'));
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Alert sending failed:', error));
        }
    }
    formatAlert(alert) {
        const emoji = {
            'info': '🔵',
            'warning': '🟡',
            'critical': '🔴',
            'opportunity': '🟢'
        }[alert.type];
        return `${emoji} **${alert.title}**\n\n${alert.message}\n\nTime: ${alert.timestamp.toLocaleString()}`;
    }
    async sendTelegram(message) {
        if (!this.telegram || !this.config.telegram?.chatId)
            return;
        await this.telegram.sendMessage(this.config.telegram.chatId, message, {
            parse_mode: 'Markdown'
        });
    }
    async sendSlack(alert, message) {
        if (!this.slack || !this.config.slack?.channel)
            return;
        const color = {
            'info': '#36a64f',
            'warning': '#ff9900',
            'critical': '#ff0000',
            'opportunity': '#00ff00'
        }[alert.type];
        await this.slack.chat.postMessage({
            channel: this.config.slack.channel,
            attachments: [{
                    color,
                    title: alert.title,
                    text: alert.message,
                    footer: 'MineChain Datacenter',
                    ts: Math.floor(alert.timestamp.getTime() / 1000).toString()
                }]
        });
    }
    async sendEmail(alert, message) {
        if (!this.emailTransporter || !this.config.email?.to)
            return;
        await this.emailTransporter.sendMail({
            from: this.config.email.user,
            to: this.config.email.to.join(','),
            subject: `MineChain Alert: ${alert.title}`,
            text: message,
            html: `
        <h2>${alert.title}</h2>
        <p>${alert.message}</p>
        <hr>
        <small>MineChain Datacenter - ${alert.timestamp.toLocaleString()}</small>
      `
        });
    }
    // Predefined alert templates
    gpuDealAlert(deal) {
        return {
            type: 'opportunity',
            title: 'GPU Deal Alert',
            message: `${deal.model} available for $${deal.price} at ${deal.retailer} (${deal.discount}% off)`,
            data: deal,
            timestamp: new Date(),
            priority: 8
        };
    }
    tokenSignalAlert(signal) {
        return {
            type: signal.signal === 'buy' ? 'opportunity' : 'warning',
            title: `Token Signal: ${signal.symbol}`,
            message: `${signal.signal.toUpperCase()} signal for ${signal.symbol} at $${signal.price} (${signal.reasoning})`,
            data: signal,
            timestamp: new Date(),
            priority: Math.floor(signal.confidence * 10)
        };
    }
    systemAlert(message, type = 'info') {
        return {
            type,
            title: 'System Alert',
            message,
            timestamp: new Date(),
            priority: type === 'critical' ? 9 : type === 'warning' ? 6 : 4
        };
    }
    revenueAlert(earnings) {
        return {
            type: 'info',
            title: 'Revenue Update',
            message: `Daily earnings: $${earnings.daily} | Monthly projection: $${earnings.monthly}`,
            data: earnings,
            timestamp: new Date(),
            priority: 5
        };
    }
}
exports.NotificationEngine = NotificationEngine;

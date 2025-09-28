"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessManager = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const events_1 = require("events");
const sqlite3_1 = __importDefault(require("sqlite3"));
class BusinessManager extends events_1.EventEmitter {
    db;
    clients = [];
    revenue = [];
    leads = [];
    constructor() {
        super();
        this.initializeDatabase();
        console.log(chalk_1.default.green('💼 Business operations manager initialized'));
    }
    initializeDatabase() {
        const dbPath = path.join(process.cwd(), 'data', 'business.db');
        // Create data directory
        if (!fs.existsSync(path.dirname(dbPath))) {
            fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        }
        this.db = new sqlite3_1.default.Database(dbPath);
        // Create tables
        this.db.serialize(() => {
            this.db.run(`
        CREATE TABLE IF NOT EXISTS clients (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          company TEXT,
          services TEXT,
          monthly_value REAL,
          status TEXT,
          onboarded_date TEXT,
          next_invoice TEXT
        )
      `);
            this.db.run(`
        CREATE TABLE IF NOT EXISTS revenue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source TEXT NOT NULL,
          amount REAL NOT NULL,
          period TEXT NOT NULL,
          category TEXT NOT NULL,
          date TEXT NOT NULL
        )
      `);
            this.db.run(`
        CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY,
          source TEXT NOT NULL,
          contact TEXT NOT NULL,
          interest TEXT,
          score INTEGER,
          notes TEXT,
          follow_up_date TEXT
        )
      `);
        });
    }
    async onboardClient(clientData) {
        try {
            console.log(chalk_1.default.blue(`👤 Onboarding client: ${clientData.name}`));
            const client = {
                id: `client_${Date.now()}`,
                name: clientData.name || '',
                email: clientData.email || '',
                company: clientData.company || '',
                services: clientData.services || [],
                monthlyValue: clientData.monthlyValue || 0,
                status: 'pending',
                onboardedDate: new Date(),
                nextInvoice: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            };
            // Save to database
            const stmt = this.db.prepare(`
        INSERT INTO clients (id, name, email, company, services, monthly_value, status, onboarded_date, next_invoice)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            stmt.run([
                client.id,
                client.name,
                client.email,
                client.company,
                JSON.stringify(client.services),
                client.monthlyValue,
                client.status,
                client.onboardedDate.toISOString(),
                client.nextInvoice.toISOString()
            ]);
            stmt.finalize();
            this.clients.push(client);
            // Generate onboarding checklist
            await this.generateOnboardingChecklist(client);
            console.log(chalk_1.default.green(`✅ Client ${client.name} onboarded successfully`));
            this.emit('client-onboarded', client);
            return client.id;
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Client onboarding failed'));
            throw error;
        }
    }
    async generateOnboardingChecklist(client) {
        const checklist = `
# Client Onboarding Checklist: ${client.name}

## Technical Setup
- [ ] Create dedicated Kubernetes namespace
- [ ] Set up GPU resource allocation
- [ ] Configure monitoring and alerts
- [ ] Deploy client-specific inference endpoints

## Business Setup  
- [ ] Generate service agreement
- [ ] Set up billing automation
- [ ] Create project documentation
- [ ] Schedule kickoff meeting

## Security & Compliance
- [ ] Implement data encryption
- [ ] Set up access controls
- [ ] HIPAA compliance review (if medical AI)
- [ ] Security audit completion

## Services: ${client.services.join(', ')}
## Monthly Value: $${client.monthlyValue}
## Next Invoice: ${client.nextInvoice.toDateString()}
`;
        const checklistPath = path.join(process.cwd(), 'data', 'checklists', `${client.id}_onboarding.md`);
        if (!fs.existsSync(path.dirname(checklistPath))) {
            fs.mkdirSync(path.dirname(checklistPath), { recursive: true });
        }
        fs.writeFileSync(checklistPath, checklist);
        console.log(chalk_1.default.blue(`📋 Onboarding checklist created: ${checklistPath}`));
    }
    async generateInvoice(clientId) {
        try {
            const client = this.clients.find(c => c.id === clientId);
            if (!client)
                throw new Error('Client not found');
            console.log(chalk_1.default.blue(`📄 Generating invoice for ${client.name}`));
            const invoiceData = {
                invoiceNumber: `INV-${Date.now()}`,
                client: client,
                items: [
                    {
                        description: `${client.services.join(', ')} - Monthly Service`,
                        quantity: 1,
                        rate: client.monthlyValue,
                        amount: client.monthlyValue
                    }
                ],
                subtotal: client.monthlyValue,
                tax: client.monthlyValue * 0.08, // 8% tax
                total: client.monthlyValue * 1.08,
                dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days
            };
            const invoice = `
# INVOICE ${invoiceData.invoiceNumber}

**From:** MineChain Operations  
**To:** ${client.name} (${client.company})  
**Date:** ${new Date().toDateString()}  
**Due:** ${invoiceData.dueDate.toDateString()}

## Services
${invoiceData.items.map(item => `- ${item.description}: $${item.amount.toFixed(2)}`).join('\n')}

**Subtotal:** $${invoiceData.subtotal.toFixed(2)}  
**Tax (8%):** $${invoiceData.tax.toFixed(2)}  
**Total:** $${invoiceData.total.toFixed(2)}

## Payment Instructions
- Crypto: Send to wallet address [TBD]
- Wire: Bank details [TBD]
- Terms: Net 15 days
`;
            const invoicePath = path.join(process.cwd(), 'data', 'invoices', `${invoiceData.invoiceNumber}.md`);
            if (!fs.existsSync(path.dirname(invoicePath))) {
                fs.mkdirSync(path.dirname(invoicePath), { recursive: true });
            }
            fs.writeFileSync(invoicePath, invoice);
            // Record revenue
            await this.recordRevenue({
                source: client.name,
                amount: invoiceData.total,
                period: 'monthly',
                category: 'consulting',
                date: new Date()
            });
            console.log(chalk_1.default.green(`✅ Invoice generated: ${invoicePath}`));
            this.emit('invoice-generated', { client, invoice: invoiceData });
            return invoicePath;
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Invoice generation failed'));
            throw error;
        }
    }
    async recordRevenue(revenue) {
        try {
            const stmt = this.db.prepare(`
        INSERT INTO revenue (source, amount, period, category, date)
        VALUES (?, ?, ?, ?, ?)
      `);
            stmt.run([
                revenue.source,
                revenue.amount,
                revenue.period,
                revenue.category,
                revenue.date.toISOString()
            ]);
            stmt.finalize();
            this.revenue.push(revenue);
            console.log(chalk_1.default.green(`💰 Revenue recorded: $${revenue.amount} from ${revenue.source}`));
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Revenue recording failed'));
        }
    }
    async generateRevenueReport(period) {
        try {
            console.log(chalk_1.default.blue(`📊 Generating ${period} revenue report...`));
            // Calculate date range
            const now = new Date();
            let startDate;
            switch (period) {
                case 'weekly':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'monthly':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'quarterly':
                    const quarter = Math.floor(now.getMonth() / 3);
                    startDate = new Date(now.getFullYear(), quarter * 3, 1);
                    break;
            }
            // Query revenue data
            this.db.all(`
        SELECT category, SUM(amount) as total, COUNT(*) as transactions
        FROM revenue 
        WHERE date >= ? AND date <= ?
        GROUP BY category
      `, [startDate.toISOString(), now.toISOString()], (err, rows) => {
                if (err) {
                    console.log(chalk_1.default.red('❌ Revenue report query failed'));
                    return;
                }
                let totalRevenue = 0;
                const report = `
# ${period.toUpperCase()} REVENUE REPORT
**Period:** ${startDate.toDateString()} - ${now.toDateString()}

## Revenue by Category
${rows.map((row) => {
                    totalRevenue += row.total;
                    return `- **${row.category}:** $${row.total.toFixed(2)} (${row.transactions} transactions)`;
                }).join('\n')}

**Total Revenue:** $${totalRevenue.toFixed(2)}

## Growth Metrics
- Average per transaction: $${rows.length > 0 ? (totalRevenue / rows.reduce((sum, row) => sum + row.transactions, 0)).toFixed(2) : '0.00'}
- Active revenue streams: ${rows.length}

## Recommendations
${this.generateRevenueRecommendations(rows, totalRevenue)}
`;
                const reportPath = path.join(process.cwd(), 'data', 'reports', `revenue_${period}_${now.toISOString().split('T')[0]}.md`);
                if (!fs.existsSync(path.dirname(reportPath))) {
                    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
                }
                fs.writeFileSync(reportPath, report);
                console.log(chalk_1.default.green(`✅ Revenue report generated: ${reportPath}`));
                console.log(chalk_1.default.cyan(`💰 Total ${period} revenue: $${totalRevenue.toFixed(2)}`));
            });
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Revenue report generation failed'));
        }
    }
    generateRevenueRecommendations(data, total) {
        const recommendations = [];
        if (total < 1000) {
            recommendations.push('- Focus on acquiring new clients through Web3 communities');
            recommendations.push('- Consider offering premium MONAI medical AI services');
        }
        if (data.find(d => d.category === 'akash')?.total < total * 0.3) {
            recommendations.push('- Increase Akash provider utilization for passive income');
        }
        if (data.find(d => d.category === 'consulting')?.total > total * 0.5) {
            recommendations.push('- Scale consulting services with more automated offerings');
        }
        return recommendations.length > 0 ? recommendations.join('\n') : '- Maintain current strategy, performance is optimal';
    }
    async addLead(leadData) {
        try {
            const lead = {
                id: `lead_${Date.now()}`,
                source: leadData.source || 'unknown',
                contact: leadData.contact || '',
                interest: leadData.interest || '',
                score: leadData.score || 5,
                notes: leadData.notes || '',
                followUpDate: leadData.followUpDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            };
            const stmt = this.db.prepare(`
        INSERT INTO leads (id, source, contact, interest, score, notes, follow_up_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
            stmt.run([
                lead.id,
                lead.source,
                lead.contact,
                lead.interest,
                lead.score,
                lead.notes,
                lead.followUpDate.toISOString()
            ]);
            stmt.finalize();
            this.leads.push(lead);
            console.log(chalk_1.default.green(`🎯 Lead added: ${lead.contact} (Score: ${lead.score}/10)`));
            this.emit('lead-added', lead);
            return lead.id;
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Lead addition failed'));
            throw error;
        }
    }
    getBusinessMetrics() {
        const activeClients = this.clients.filter(c => c.status === 'active').length;
        const monthlyRecurring = this.clients.reduce((sum, client) => sum + client.monthlyValue, 0);
        const highValueLeads = this.leads.filter(l => l.score >= 8).length;
        return {
            activeClients,
            monthlyRecurring,
            highValueLeads,
            totalRevenue: this.revenue.reduce((sum, r) => sum + r.amount, 0)
        };
    }
}
exports.BusinessManager = BusinessManager;

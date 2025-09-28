#!/bin/bash
echo "🏭 Setting up MineChain boot service..."

# Create systemd service
sudo tee /etc/systemd/system/minechain.service << 'EOSERVICE'
[Unit]
Description=MineChain Datacenter Operations
After=network.target docker.service

[Service]
Type=simple
User=rig1
WorkingDirectory=/home/rig1/minechain-cli
ExecStart=/home/rig1/minechain-cli/node_modules/.bin/node dist/index.js datacenter autonomous
Restart=always

[Install]
WantedBy=multi-user.target
EOSERVICE

sudo systemctl daemon-reload
sudo systemctl enable minechain.service
echo "✅ MineChain will now start on boot!"
echo "Commands: sudo systemctl start/stop/status minechain"

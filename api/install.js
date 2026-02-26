const express = require('express');
const { NodeSSH } = require('node-ssh');
const router = express.Router();

router.post('/run', async (req, res) => {
    const { ip, pass, domain, action } = req.body;
    const ssh = new NodeSSH();

    try {
        await ssh.connect({ host: ip, username: 'root', password: pass, port: 22, readyTimeout: 25000 });
        
        let command = "";
        
        if (action === 'panel' || action === 'all') {
            command += `bash <(curl -s https://pterodactyl-installer.se) <<EOF
0
admin123
admin123

Asia/Jakarta
admin@${domain}
admin@${domain}
admin
admin
admin
admin123
${domain}
y
y
y
EOF\n`;
        }
        
        if (action === 'wings' || action === 'all') {
            command += `bash <(curl -s https://pterodactyl-installer.se) <<EOF
y
${domain}
dbuser123
dbpass123
${domain}
y
admin@${domain}
y
y
EOF\n`;
        }
        
        if (action === 'ssl') {
            command = `systemctl stop nginx certbot || true
pkill -f certbot || true
rm -rf /var/lib/letsencrypt/.lock /var/log/letsencrypt/.lock /etc/letsencrypt/.certbot.lock || true
certbot certonly --standalone -d ${domain} --non-interactive --agree-tos -m admin@${domain} --keep-until-expiring
systemctl start nginx || true
systemctl reload nginx || true`;
        }

        if (action === 'uninstall_panel') {
            command = `systemctl stop pteroq || true
rm -f /etc/systemd/system/pteroq.service
systemctl daemon-reload
rm -rf /var/www/pterodactyl /etc/pterodactyl
rm -f /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/pterodactyl.conf
nginx -t && systemctl reload nginx || true`;
        }
        
        if (action === 'uninstall_wings') {
            command = `systemctl stop wings || true
rm -f /etc/systemd/system/wings.service
systemctl daemon-reload
rm -rf /usr/local/bin/wings /srv/daemon-data /srv/daemon /root/.config/pterodactyl`;
        }
        
        if (action === 'uninstall_all') {
            command = `systemctl stop pteroq wings nginx || true
rm -f /etc/systemd/system/pteroq.service /etc/systemd/system/wings.service
systemctl daemon-reload
rm -rf /var/www/pterodactyl /etc/pterodactyl /usr/local/bin/wings /srv/daemon-data /srv/daemon /root/.config/pterodactyl
rm -f /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/pterodactyl.conf`;
        }

        const execRes = await ssh.execCommand(command);
        ssh.dispose();

        res.json({ message: "Eksekusi selesai", log: execRes.stdout + '\n' + execRes.stderr });
    } catch (error) {
        res.status(500).json({ message: "SSH Gagal: " + error.message });
    }
});

module.exports = router;
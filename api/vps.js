const express = require('express');
const router = express.Router();

router.post('/create', async (req, res) => {
    const { apiKey, hostname, spec, region, image } = req.body;
    try {
        const password = Math.random().toString(36).slice(-10);
        const dropletData = {
            name: hostname.toLowerCase().trim(),
            region: region,
            size: spec,
            image: image,
            ssh_keys: null, 
            backups: false, 
            ipv6: true,
            user_data: `#cloud-config\npassword: ${password}\nchpasswd: { expire: False }\nssh_pwauth: True`,
            tags: ["SatriaVps", new Date().toISOString().split("T")[0]]
        };

        const response = await fetch("https://api.digitalocean.com/v2/droplets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(dropletData)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        res.json({ message: "VPS Created", id: data.droplet.id, password: password, ip: "Sedang proses booting" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/list', async (req, res) => {
    const { apiKey } = req.body;
    try {
        const response = await fetch("https://api.digitalocean.com/v2/droplets", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        const droplets = data.droplets.map(d => ({
            id: d.id,
            name: d.name,
            ip: d.networks.v4.find(n => n.type === "public")?.ip_address || "No IP",
            status: d.status,
            region: d.region.slug,
            image: d.image.slug
        }));
        
        res.json({ droplets });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
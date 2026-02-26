const express = require('express');
const router = express.Router();

router.post('/create', async (req, res) => {
    const { domain, apiKey, username, memory, nodeId, eggId, locId } = req.body;
    try {
        const url = domain.replace(/\/+$/, "");
        const email = `${username}@satriavps.com`;
        const password = username + Math.random().toString(36).slice(2, 5);

        const userRes = await fetch(`${url}/api/application/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ 
                email: email, 
                username: username, 
                first_name: username, 
                last_name: 'user', 
                language: 'en', 
                password: password 
            })
        });
        const userData = await userRes.json();
        if (userData.errors) throw new Error(JSON.stringify(userData.errors[0]));

        const srvRes = await fetch(`${url}/api/application/servers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                name: `${username}-server`,
                user: userData.attributes.id,
                egg: parseInt(eggId),
                docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
                startup: "npm start",
                environment: { "CMD_RUN": "npm start", "INST": "npm", "USER_UPLOAD": "0", "AUTO_UPDATE": "0" },
                limits: { memory: parseInt(memory), swap: 0, disk: 10000, io: 500, cpu: 100 },
                feature_limits: { databases: 5, backups: 5, allocations: 1 },
                deploy: { locations: [parseInt(locId)], dedicated_ip: false, port_range: [] }
            })
        });
        const srvData = await srvRes.json();
        if (srvData.errors) throw new Error(JSON.stringify(srvData.errors[0]));

        res.json({ email, username, password });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
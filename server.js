const express = require('express');
const cors = require('cors');

const vpsRoutes = require('./api/vps');
const installRoutes = require('./api/install');
const protectRoutes = require('./api/protect');
const panelRoutes = require('./api/panel');
const encryptRoutes = require('./api/encrypt');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/vps', vpsRoutes);
app.use('/api/install', installRoutes);
app.use('/api/protect', protectRoutes);
app.use('/api/panel', panelRoutes);
app.use('/api/encrypt', encryptRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`[SATRIA-VPS] Backend API berjalan di http://localhost:${PORT}`);
});
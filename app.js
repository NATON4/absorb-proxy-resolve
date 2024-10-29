const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3100;

const targetServer = 'https://rest.developer.infuse.myabsorb.com';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, X-API-Version, X-API-Key, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.options('*', (req, res) => {
    res.sendStatus(200);
});

app.use(
    '/',
    createProxyMiddleware({
        target: targetServer,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            console.log(`Proxying request to: ${targetServer}${req.originalUrl}`);
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log(`Response received with status: ${proxyRes.statusCode}`);
        },
        onError: (err, req, res) => {
            console.error(`Proxy error: ${err.message}`);
            res.status(500).send('Something went wrong.');
        },
    })
);

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});

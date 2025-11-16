const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:5000',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/' // удаляем /api из пути
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(503).json({ 
            error: 'API Service Unavailable', 
            message: 'Python API сервер запускается, пожалуйста, подождите несколько секунд и попробуйте снова.'
        });
    },
    onProxyReq: (proxyReq, req, res) => {
        // Добавляем таймаут для ожидания запуска Python API
        req.setTimeout(30000);
    }
});

module.exports = apiProxy;
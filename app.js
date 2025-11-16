const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { spawn } = require('child_process');
const apiProxy = require('./middleware/apiProxy');

const app = express();
const port = 3000;

// Запуск Python API сервера
function startPythonAPI() {
    const pythonProcess = spawn('python', [
        '-m', 'uvicorn',
        'ai_modul.api_server:app',
        '--host', '127.0.0.1',
        '--port', '5000'
    ], {
        cwd: __dirname,
        stdio: 'pipe'
    });

    pythonProcess.stdout.on('data', (data) => {
        console.log('Python API:', data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error('Python API Error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python API process exited with code ${code}`);
            // Перезапуск при ошибке через 5 секунд
            setTimeout(startPythonAPI, 5000);
        }
    });

    // Очистка при завершении Node.js процесса
    process.on('SIGINT', () => {
        pythonProcess.kill();
        process.exit();
    });
}

// Запуск Python API при старте приложения
startPythonAPI();

const http = require('http');
const https = require('https');
const fs = require('fs');

const schoolInfo = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'school-info.json'), 'utf-8')
);
// keep dependencies minimal

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    extname: 'handlebars'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Логирование всех запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Логирование ошибок Express
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).send('Internal server error');
});


app.get('/', (req, res) => {
    res.render('home', {
        title: 'Главная страница',
        style: [
            '<link rel="stylesheet" href="/css/style.css">',
            '<link rel="stylesheet" href="/css/components.css">',
            '<link rel="stylesheet" href="/css/color-schemes.css">'
        ],
        script: [
            '<script src="/js/main.js"></script>',
            '<script src="/js/components.js"></script>',
            '<script src="/js/color-switcher.js"></script>'
        ]
    });
});


app.get('/about', (req, res) => {
    res.render('about', {
        title: 'О нас',
        style: [
            '<link rel="stylesheet" href="/css/style.css">',
            '<link rel="stylesheet" href="/css/components.css">',
            '<link rel="stylesheet" href="/css/color-schemes.css">'
        ],
        script: [
            '<script src="/js/main.js"></script>',
            '<script src="/js/components.js"></script>',
            '<script src="/js/color-switcher.js"></script>'
        ]
    });
});

app.get('/news', (req, res) => {
    // страница новостей была удалена — перенаправляем на главную
    res.redirect('/');
});

// Маршруты для страниц экзаменов
app.get('/exams/ege', (req, res) => {
    res.render('pages/ege', {
        title: 'ЕГЭ - Единый государственный экзамен',
        style: [
            '<link rel="stylesheet" href="/css/style.css">',
            '<link rel="stylesheet" href="/css/components.css">',
            '<link rel="stylesheet" href="/css/color-schemes.css">'
        ],
        script: [
            '<script src="/js/main.js"></script>',
            '<script src="/js/components.js"></script>',
            '<script src="/js/color-switcher.js"></script>'
        ]
    });
});

app.get('/exams/oge', (req, res) => {
    res.render('pages/oge', {
        title: 'ОГЭ - Основной государственный экзамен',
        style: [
            '<link rel="stylesheet" href="/css/style.css">',
            '<link rel="stylesheet" href="/css/components.css">',
            '<link rel="stylesheet" href="/css/color-schemes.css">'
        ],
        script: [
            '<script src="/js/main.js"></script>',
            '<script src="/js/components.js"></script>',
            '<script src="/js/color-switcher.js"></script>'
        ]
    });
});

app.get('/exams/vpr', (req, res) => {
    res.render('pages/vpr', {
        title: 'ВПР - Всероссийские проверочные работы',
        style: [
            '<link rel="stylesheet" href="/css/style.css">',
            '<link rel="stylesheet" href="/css/components.css">',
            '<link rel="stylesheet" href="/css/color-schemes.css">'
        ],
        script: [
            '<script src="/js/main.js"></script>',
            '<script src="/js/components.js"></script>',
            '<script src="/js/color-switcher.js"></script>'
        ]
    });
});

// ----- Страница образовательных материалов -----
app.get('/materials', (req, res) => {
    res.render('pages/materials', {
        title: 'Образовательные материалы',
        style: [
            '<link rel="stylesheet" href="/css/style.css">',
            '<link rel="stylesheet" href="/css/components.css">',
            '<link rel="stylesheet" href="/css/color-schemes.css">'
        ],
        script: [
            '<script src="/js/main.js"></script>',
            '<script src="/js/components.js"></script>',
            '<script src="/js/color-switcher.js"></script>'
        ]
    });
});

app.get('/parents', (req, res) => {
    res.render('pages/parents', {
        title: 'Родителям',
        style: [
            '<link rel="stylesheet" href="/css/style.css">',
            '<link rel="stylesheet" href="/css/components.css">',
            '<link rel="stylesheet" href="/css/color-schemes.css">'
        ],
        script: [
            '<script src="/js/main.js"></script>',
            '<script src="/js/components.js"></script>',
            '<script src="/js/color-switcher.js"></script>'
        ]
    });
});
app.get('/info', (req, res) => {
    res.render('pages/info', {
        title: 'Сведения об образовательной организации',
        info: schoolInfo,
        style: [
            '<link rel="stylesheet" href="/css/style.css">',
            '<link rel="stylesheet" href="/css/components.css">',
            '<link rel="stylesheet" href="/css/color-schemes.css">',
            '<link rel="stylesheet" href="/css/info.css">'
        ],
        script: [
            '<script src="/js/main.js"></script>',
            '<script src="/js/color-switcher.js"></script>'
        ]
    });
});
app.get('/ai', (req, res) => {
    res.render('pages/ai', {
        title: 'AI Ассистент',
        style: [
            '<link rel="stylesheet" href="/css/style.css">',
            '<link rel="stylesheet" href="/css/components.css">',
            '<link rel="stylesheet" href="/css/color-schemes.css">',
            '<link rel="stylesheet" href="/css/ai.css">'
        ],
        script: [
            '<script src="/js/main.js"></script>',
            '<script src="/js/components.js"></script>',
            '<script src="/js/color-switcher.js"></script>',
            '<script src="/js/ai.js"></script>'
        ]
    });
});

// Proxy text prompts to Python service using native http (no axios required)
app.post('/api/ai/text', (req, res) => {
    const { model, prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    const postData = JSON.stringify({ model, prompt });
    const options = {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/generate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        }
    };

    const pyReq = http.request(options, (pyRes) => {
        let data = '';
        pyRes.setEncoding('utf8');
        pyRes.on('data', (chunk) => { data += chunk; });
        pyRes.on('end', () => {
            try {
                const parsed = JSON.parse(data);
                res.status(pyRes.statusCode || 200).json(parsed);
            } catch (e) {
                res.status(502).json({ error: 'Invalid response from AI service' });
            }
        });
    });

    pyReq.on('error', (e) => {
        console.error('Error proxying to Python service:', e && e.message);
        // Return a clear instructive response so the frontend can show a friendly message.
        return res.status(503).json({
            error: 'AI service unavailable',
            message: 'The local Python AI service is not running. Start it with: python -m uvicorn ai_modul.api_server:app --host 127.0.0.1 --port 5000'
        });
    });

    pyReq.write(postData);
    pyReq.end();
});

// Upload file and proxy to Python analyze endpoint by piping request stream
// This avoids multer/form-data dependencies: incoming multipart is streamed
// directly to the Python service.
app.post('/api/ai/file', (req, res) => {
    // forward headers but adjust host
    const headers = Object.assign({}, req.headers);
    // ensure host header matches python service
    headers.host = '127.0.0.1:5000';

    const options = {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/analyze-file',
        method: 'POST',
        headers,
    };

    const pyReq = http.request(options, (pyRes) => {
        res.writeHead(pyRes.statusCode || 200, pyRes.headers);
        pyRes.pipe(res);
    });

    pyReq.on('error', (err) => {
        console.error('Error proxying file to Python service:', err.message);
        res.status(502).json({ error: 'AI service unavailable' });
    });

    // pipe incoming request body (multipart) directly to Python
    req.pipe(pyReq);
});

// Health check that probes Python AI service
app.get('/api/ai/health', (req, res) => {
    const options = { hostname: '127.0.0.1', port: 5000, path: '/generate', method: 'OPTIONS', timeout: 1000 };
    const probe = http.request(options, (pRes) => {
        res.status(200).json({ ok: true });
    });
    probe.on('error', () => res.status(503).json({ ok: false }));
    probe.end();
});

// API proxy middleware (ДОЛЖЕН БЫТЬ ПОСЛЕ всех ручных /api/ai/* маршрутов)
app.use('/api', apiProxy);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

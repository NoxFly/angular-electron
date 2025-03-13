import http from 'http';

const httpServer = http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write('[');

    for(let i = 0; i < 100; i++) {
        res.write('{"id":' + i + ',"name":"test"}');
        if(i < 99) {
            res.write(',');
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
    }

    res.write(']');
    res.end();
});

httpServer.listen(3000, 'localhost', () => {
    console.log('HTTP Server is running on http://localhost:3000');
});

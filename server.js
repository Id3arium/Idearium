import next from 'next';
import { createServer } from 'http';
import { parse } from 'url';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    // Parse the request url
    const parsedUrl = parse(req.url, true);

    // Custom route handler
    if (parsedUrl.pathname === '/custom-route') {
      res.end('Hello, world!');
      return;
    }

    // Default route handler
    handle(req, res, parsedUrl);
  }).listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});


const http = require('http');
const url = require('url');
const { connect, disconnect } = require('./src/db/conn');
const port = process.env.PORT || 3000;
const { handleRegister, handleLogin, handleLogout } = require('./src/controller/userHandlers');
const { handleCreateTicket, handleFetchTickets } = require('./src/controller/tambulaHandlers');

connect(); // Connect to MongoDB

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'POST' && parsedUrl.pathname === '/user/register') {
    handleRegister(req, res);
  } else if (req.method === 'POST' && parsedUrl.pathname === '/user/login') {
    handleLogin(req, res);
  } else if (req.method === 'POST' && parsedUrl.pathname === '/user/logout') {
    handleLogout(req, res);
  } else if (req.method === 'POST' && parsedUrl.pathname === '/tambula/create') {
    handleCreateTicket(req, res);
  } else if (req.method === 'GET' && parsedUrl.pathname === '/tambula/fetch') {
    handleFetchTickets(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  // Disconnect from MongoDB
  disconnect();
  process.exit(0);
});

// Start the server
server.listen(port, () => {
  console.log('Server started on port:', port);
});

module.exports = server;

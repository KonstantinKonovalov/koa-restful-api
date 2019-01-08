const http = require('http');
const { app } = require('./app');

const port = process.env.PORT || 80;

const server = http.createServer(app.callback());

/* eslint-disable no-console */
server.listen(port, () => console.log(`Server running on port: ${port}`));

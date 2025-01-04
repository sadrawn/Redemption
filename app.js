const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

const myRouter = require('./router.js/router')










const ip = 'localhost';
const port = 3000;

app.listen(ip, port, () => {
    console.log(`App is runnig on http://${ip}:${port}`);
})
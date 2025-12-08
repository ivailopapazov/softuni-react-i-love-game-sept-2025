const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

const server = require('./server/server');

exports.server = onRequest((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    if (req.method === "OPTIONS") {
        res.status(204).send(""); // Do NOT forward OPTIONS to your internal server
        return;
    }

    server.emit('request', req, res);
});

setGlobalOptions({ maxInstances: 1, region: 'europe-west1' });

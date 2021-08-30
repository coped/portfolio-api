#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var debug_1 = __importDefault(require("debug"));
var http_1 = require("http");
var app_1 = require("../app");
(0, debug_1["default"])("portfolio-api:server");
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || "8000");
app_1.app.set("port", port);
/**
 * Create HTTP server.
 */
var server = (0, http_1.createServer)(app_1.app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (Number.isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    if (addr) {
        var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        (0, debug_1["default"])("Listening on " + bind);
    }
}
/**
 * Gracefully handle shutdowns
 */
process.on("SIGTERM", function () {
    (0, debug_1["default"])("SIGTERM signal received: closing HTTP server");
    server.close(function () {
        (0, debug_1["default"])("HTTP server closed");
    });
    process.exit();
});
process.on("uncaughtException", function () {
    (0, debug_1["default"])("uncaughtException: closing HTTP server");
    server.close(function () {
        (0, debug_1["default"])("HTTP server closed");
    });
    process.exit();
});

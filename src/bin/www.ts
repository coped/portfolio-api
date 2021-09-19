import debug from "debug";
import { createServer } from "http";
import dotenv from "dotenv";
import { app } from "../app.js";

dotenv.config();

debug("portfolio-api:server");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "8000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): string | number | false {
  const port = parseInt(val, 10);

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

function onError(error: any): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  const addr = server.address();
  if (addr) {
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  }
}

/**
 * Gracefully handle shutdowns
 */

process.on("SIGTERM", (): void => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
  process.exit();
});

process.on("uncaughtException", (): void => {
  debug("uncaughtException: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
  process.exit();
});

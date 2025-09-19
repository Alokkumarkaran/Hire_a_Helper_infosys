let ioRef = null;
export function registerSocket(io) {
  ioRef = io;
  // Make io accessible to routes
  // (Express instance set in server.js via app.set('io', io))
  io.engine.on('connection_error', (err) => {
    console.log('Socket error', err);
  });
  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (userId) {
      socket.join(String(userId));
    }
  });
}
export function getIO() { return ioRef; }

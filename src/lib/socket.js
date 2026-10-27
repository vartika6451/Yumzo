// Helper to emit events to connected Socket.io clients
export const emitSocketEvent = (event, data) => {
  if (typeof global !== 'undefined' && global.io) {
    global.io.emit(event, data);
  }
};

let ioInstance = null;

/**
 * Store Socket.IO instance (called once from server.js)
 */
const setIO = (io) => {
  ioInstance = io;
};

/**
 * Get Socket.IO instance (used in cron jobs, controllers, etc.)
 */
const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized");
  }
  return ioInstance;
};

module.exports = {
  setIO,
  getIO,
};

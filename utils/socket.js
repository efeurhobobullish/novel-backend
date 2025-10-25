module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔗 User connected:", socket.id);

    socket.on("notify", (msg) => {
      io.emit("notifyAll", msg);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

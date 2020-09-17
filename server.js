const express = require("express");
const path = require("path")
const http = require("http");
const socketio = require("socket.io")
const publicDir = path.resolve(__dirname, "public")


const app = express();
app.use(express.static(publicDir));

const server = http.createServer(app)
const io = socketio(server);

io.on('connection', socket => {
    console.log("New WS connection");

    socket.emit("message", "Sup client")
})


const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
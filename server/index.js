const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://192.168.29.196:4000",
        methods: ["GET", "POST"]
    }
});

let clients = {};

io.on("connection", (socket) => {
    console.log("CONNECTED : ", socket.handshake.address);

    // Add the new client to the clients list with its unique ID
    socket.on("set_profile", (profileInfo) => {
        clients[socket.id] = { ...profileInfo, id: socket.id };
        io.emit("clients_list", clients);
    });

    socket.on("send_message", (data) => {
        console.log("receive_message : ", data);
        if (data.to) {
            io.to(data.to).emit("receive_message", { ...data, send: false });
        }
    });

    socket.on("disconnect", () => {
        delete clients[socket.id];

        io.emit("clients_list", clients);
    });
});

server.listen(3005, () => {
    console.log("<<<<<<<<<<<<<<<<<<< SERVER STARTED >>>>>>>>>>>>>>>>> ");
});

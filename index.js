const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const iceServers  = require("./config/ice-config");
const { ExpressPeerServer } = require("peer");
const peerController = require("./controllers/peer-controller");

app.use(express.json());
app.use(cors());

dotenv.config();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const port = process.env.PORT || 4000;
iceServers.start();

const errorHandler = (err, req, res, next) => {
    if (err.headerSent) {
        return next(err);
    }
    res.status(500).json({
        message: err.message,
    });
};

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const options = {
    debug: true,
    path: "/",
    secure: false,
};

const peerServer = ExpressPeerServer(server, options);

peerServer.on("connection", peerController.connection);

peerServer.on("disconnect", peerController.disconnect);

peerServer.on("error", peerController.error);

app.use("/peer", peerServer);


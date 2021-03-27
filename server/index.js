const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 8000;

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

let interval;
io.on("connection", (socket) => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

const hcmBoundingBox = {
    latMin: 10.73265,
    latMax: 10.8422,
    longMin: 106.620651,
    longMax: 106.725327,
};

const renderData = (sizeData) => {
    let data = [];
    for (let i = 0; i < sizeData; i++) {
        const latitude =
            Math.random() * (hcmBoundingBox.latMax - hcmBoundingBox.latMin) +
            hcmBoundingBox.latMin;
        const longitude =
            Math.random() * (hcmBoundingBox.longMax - hcmBoundingBox.longMin) +
            hcmBoundingBox.longMin;
        data.push([longitude, latitude]);
    }

    // console.log("data", data);
    return data;
};

const geojson = () => {
    return {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    // coordinates: [
                    //   [106.6910636, 10.7715341],
                    //   [106.695753, 10.7904879],
                    //   [106.6975553, 10.7675313],
                    //   [106.6676433, 10.7929163],
                    // ],
                    coordinates: renderData(3),
                },
            },
        ],
    };
};

const getApiAndEmit = (socket) => {
    socket.emit("getDataMap", geojson());
};
server.listen(port, () => console.log(`Listening on port ${port}`));
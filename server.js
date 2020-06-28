const path = require("path");
const mqtt = require("mqtt");
const mosca = require("mosca");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const moment = require("moment");

//------------NODE SERVER-------------------
const port = process.env.PORT || 80;
server.listen(port);

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

//
io.on("connection", function (socket) {
  socket.emit("news", { hello: "world" });
});

//-------------MQTT SERVER-------------------
var settings = {
  port: 1883,
};
var MQTTserver = new mosca.Server(settings);

MQTTserver.on("ready", function setup() {
  console.log("Mosca server is up and running");
});

MQTTserver.on("clientConnected", function (client) {
  console.log("client connected", client.id);
});

//-----------------------MQTT CLIENT----------------------
var client = mqtt.connect("mqtt://localhost");

client.subscribe("temperature");

client.on("message", function (topic, message) {
  const data = {
    sensorData: JSON.parse(message),
    //temperature: message.toString()
    time: moment().format("HH:mm:ss"),
  };
  console.log(data);
  io.emit("temperature", data);
});

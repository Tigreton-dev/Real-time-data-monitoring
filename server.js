const path = require("path");
const mqtt = require("mqtt");
const mosca = require("mosca");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const moment = require("moment");

//------------NODE SERVER-------------------
const port = process.env.PORT || 3000;
server.listen(port);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//
io.on("connection", function (socket) {
  socket.emit("news", { hello: "world" });
});

//-------------MQTT SERVER-------------------
var settings = {
  port: 1883,
};
var server = new mosca.Server(settings);

server.on("ready", function setup() {
  console.log("Mosca server is up and running");
});

server.on("clientConnected", function (client) {
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

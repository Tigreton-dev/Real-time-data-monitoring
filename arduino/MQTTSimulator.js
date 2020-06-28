const mqtt = require("mqtt");
var client = mqtt.connect("mqtt://localhost");

(function () {
  setInterval(function () {
    var value = Math.floor(Math.random() * 100);
    var value2 = Math.floor(Math.random() * 100);
    let values = {
      temperature: value.toString(),
      humidity: value2.toString(),
    };
    values = JSON.stringify(values);
    client.publish("temperature", values);
    //client.end();
  }, 5000);
})();

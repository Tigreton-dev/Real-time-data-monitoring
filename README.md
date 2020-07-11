# Real Time data monitoring through MQTT and WebSockets

This is a Demo for monitoring data from an Arduino that send the temperature and humidity from a sensor conected to it. The data is sending to a NodeJS server through MQTT. The client that represent the data in a web APP in a very beatufully way is conected to the server by websockets so it allow to show the data in real time.

---

## Live Demo

https://real-time-data-monitoring.web.app/

![Texto alternativo](/image.png)

Tools

---

Key tools used in this project are:

- ES6
- Arduino
- C++
- MQTT
- WebSockets
- Chart.js
- Bootstrap

Installation

---

Execute the following command on your terminal to install all the needed packages:

    npm install

Start the server:

    npm run start-server

The server will start automatically

There is a file call MQTTSimulator.js inside the arduino folder, wich basically is a JS MQTT client that conect to de MQTT broker and send random data every 5 seconds in order to simulate the arduino. To execute the simulator, run:

    npm run start-simulator

Copyright and license

---

The MIT License (MIT). Please see License File for more information.

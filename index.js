var socket = io.connect('http://localhost');
let temperature = [];
let humidity = [];
var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [],
            fill: false,
        }, {
            label: 'Humidity',
            fill: false,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [],
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Real time Temperature/Humidity monitor'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            },
            y: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                }
            }
        }
    }
};


window.onload = function () {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);
};

socket.on('temperature', (content) => {
    temperature.push(content.sensorData.temperature);
    humidity.push(content.sensorData.humidity);
    config.data.labels.push(content.time);
    config.data.datasets.map((element, index) => {
        element.label == "Temperature" ? element.data.push(content.sensorData.temperature) : null;
        element.label == "Humidity" ? element.data.push(content.sensorData.humidity) : null;
    })
    window.myLine.update();
    let template = "<tr><td>" + content.sensorData.temperature + "ºC</td>" + "<td>" + content.sensorData.humidity + "%</td>" + "<td>" + content.time + "</td> </tr> "
    $('.table-body').append(template);
    document.getElementById('showTemperature').innerHTML = content.sensorData.temperature + 'ºC';
    document.getElementById('showHumidity').innerHTML = content.sensorData.humidity + '%';
    document.getElementById('showTime').innerHTML = content.time;
});


document.getElementById('addTemperature').addEventListener('click', function () {
    let result = false;
    config.data.datasets.map(element => { if (element.label == "Temperature") result = true });
    if (!result) {
        var newDataset = {
            label: 'Temperature',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [...temperature],
            fill: false,
        };
        config.data.datasets.push(newDataset);
    }
    window.myLine.update();
});

document.getElementById('addHumidity').addEventListener('click', function () {
    let result = false;
    config.data.datasets.map(element => { if (element.label == "Humidity") result = true });
    if (!result) {
        var newDataset = {
            label: 'Humidity',
            fill: false,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [...humidity],
        };
        config.data.datasets.push(newDataset);
    }
    window.myLine.update();
});

document.getElementById('removeTemperature').addEventListener('click', function () {
    config.data.datasets.map((element, index) => {
        element.label == "Temperature" ? config.data.datasets.splice(index, 1) : null;
    })
    window.myLine.update();
});

document.getElementById('removeHumidity').addEventListener('click', function () {
    config.data.datasets.map((element, index) => {
        element.label == "Humidity" ? config.data.datasets.splice(index, 1) : null;
    })
    window.myLine.update();
});

document.getElementById('removeData').addEventListener('click', function () {
    config.data.labels.splice(0, 1); // remove the label first
    temperature.splice(0, 1);
    humidity.splice(0, 1);
    config.data.datasets.forEach(function (dataset) {
        dataset.data.splice(0, 1);
    });
    window.myLine.update();
});

document.getElementById('remove10').addEventListener('click', function () {
    config.data.labels.splice(0, 10); // remove the label first
    temperature.splice(0, 10);
    humidity.splice(0, 10);
    config.data.datasets.forEach(function (dataset) {
        dataset.data.splice(0, 10);
    });
    window.myLine.update();
});

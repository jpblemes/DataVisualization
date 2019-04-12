var csv = "csvFiles/T1_POX.csv"
var data = [];
var idata = 0;
$.ajax({
    url: csv,
    async: false,
    success: function (csvd) {
        data = $.csv.toObjects(csvd);
    },
    dataType: "text",
    complete: function () {
        // call a function on complete 
    }
});

function imprime(teste){
    console.log(teste)
}

var lineArr = [];
var MAX_LENGTH = 100;
var duration = 500;
var chart = realTimeLineChart();

function randomNumberBounds(min, max) {
    return Math.floor(Math.random() * max) + min;
}



function updateData() {
    
    var now = new Date();
    var lineData = {
    time: now,
    csv1: data[idata].POX,
    csv2: 0,
    csv3: 0
    };
    lineArr.push(lineData);

    if (lineArr.length > 30) {
    lineArr.shift();
    }
    d3.select("#chart").datum(lineArr).call(chart);
    idata++
}

function resize() {
    if (d3.select("#chart svg").empty()) {
    return;
    }
    chart.width(+d3.select("#chart").style("width").replace(/(px)/g, ""));
    d3.select("#chart").call(chart);
}


function seedData(data) {
    var now = new Date();
    for (var i = 0; i < MAX_LENGTH; ++i) {
        lineArr.push({
            time: new Date(now.getTime() - ((MAX_LENGTH - i) * duration)),
            csv1: data[0].POX,
            csv2: 0,
            csv3: 0
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    seedData(data);
    window.setInterval(updateData, 500);
    d3.select("#chart").datum(lineArr).call(chart);
    d3.select(window).on('resize', resize);
});
document.addEventListener("para", function() {
    seedData(data);
    window.setInterval(updateData, 500);
    d3.select("#chart").datum(lineArr).call(chart);
    d3.select(window).on('resize', resize);
});





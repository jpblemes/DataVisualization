
var lineArr = [];
var MAX_LENGTH = 100;
var duration = 500;
var chart = realTimeLineChart();

function randomNumberBounds(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function seedData() {
    var now = new Date();
    for (var i = 0; i < MAX_LENGTH; ++i) {
    lineArr.push({
        time: new Date(now.getTime() - ((MAX_LENGTH - i) * duration)),
        x: 10,
        y: randomNumberBounds(0, 10),
        z: 0
    });
    }
}

function updateData() {
    var now = new Date();

    var lineData = {
    time: now,
    x: 10,
    y: randomNumberBounds(0, 10),
    z: 0
    };
    lineArr.push(lineData);

    if (lineArr.length > 30) {
    lineArr.shift();
    }
    d3.select("#chart").datum(lineArr).call(chart);
}

function resize() {
    if (d3.select("#chart svg").empty()) {
    return;
    }
    chart.width(+d3.select("#chart").style("width").replace(/(px)/g, ""));
    d3.select("#chart").call(chart);
}

document.addEventListener("DOMContentLoaded", function() {
    seedData();
    window.setInterval(updateData, 500);
    d3.select("#chart").datum(lineArr).call(chart);
    d3.select(window).on('resize', resize);
});

var gsrv = [];
function NewValue(){
    return gsrv[clickevent]; 
}
//ficheiro começa aqui
var rowToHtml = function( row ) {
    var result = "";
    var x = 1;
    for (key in row) {

        result += key + ":" + row[key] + "<br/>"
    }
    return result;
}

var previewCsvUrl = function( csvUrl ) {
d3.timeout=500;
    d3.csv( csvUrl, function( rows ) {
        var str = "";
        var aux = "";
        for(var i = 0; i < rows.length-1; i++){
            aux = rowToHtml(rows[i]);
            str +=   aux;
            gsrv[i]=aux.substr(-8);
            var sub1 = gsrv[i];
            gsrv[i]=gsrv[i].substring(0,3);
            
            gsrv[i]=Number(gsrv[i]);
        }
    })
}

function imprime(item){
    console.log(item);
}

previewCsvUrl("T1_POX.csv")
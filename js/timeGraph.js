'use strict';

//////////////////////////////////////////////////////////////////

var csvObject = {
  indice: 0,
  data: 0,
  horario: 0,
  DATA: 0
}
var csv = "csvFiles/T1_POX.csv"
var csvData1 = new Array(csvObject);
var setCsv1 = 1;
var idata1 = 0;

function getValue(numCsv){
  if(numCsv == 1){
      if(setCsv1 == 1){
          idata1++;
          return csvData1[idata1-1].DATA;
      }  
      else
          return 0;
  }
}

$.ajax({
  url: csv,
  async: false,
  success: function (csvd) {
      csvData1 = $.csv.toObjects(csvd);
      setCsv1 = 1;
  },
  dataType: "text",
  complete: function () {
      // call a function on complete 
  }
});

$(document).ready(function() {    

  // The event listener for the file upload
  document.getElementById('csvData1').addEventListener('change', upload, false);
  
  // Method that checks that the browser supports the HTML5 File API
  function browserSupportFileUpload() {
      var isCompatible = false;
      if (window.File && window.FileReader && window.FileList && window.Blob) {
      isCompatible = true;
      }
      return isCompatible;
  }

  // Method that reads and processes the selected file
  function upload(evt) {
  if (!browserSupportFileUpload()) {
      alert('Este API não é completamente compatível com este navegador!');
      } else {
          var data = null;
          var file = evt.target.files[0];
          var reader = new FileReader();
          reader.readAsText(file);
          reader.onload = function(event) {
              var csvData = event.target.result;
              data = $.csv.toObjects(csvData);
              if (data && data.length > 0) {
                csvData1 = data;
                setCsv1 = 1;
                
              } else {
                  alert('Sem dados para importar!');
              }
          };
          reader.onerror = function() {
              alert('Não foi possível ler ' + file.fileName);
          };
      }
  }
});

$(document).ready(function() {  
  $("#buttonRestartData").click(function(){
      idata1 = 0;
      var save1 = setCsv1;
      setCsv1 = 0;
      setTimeout(function(){
      setCsv1 = save1;
    },2000);
       
  });
});


/////////////////////////////////////////////////////////////////////////

// mean and deviation for time interval
var meanMs = 1000, // milliseconds
    dev = 150;

// define time scale
var timeScale = d3.scale.linear()
    .domain([300, 1700])
    .range([300, 1700])
    .clamp(true);

// define value scale
var valueScale = d3.scale.linear()
    .domain([0, 1])
    .range([30, 95]);

// generate initial data
var normal = d3.random.normal(1000, 150);
var currMs = new Date().getTime() - 1;
var data = d3.range(300).map(function(d, i, arr) {
  var value = valueScale(Math.random()); // random data
  //var value = Math.round((d % 60) / 60 * 95); // ramp data
  var interval = Math.round(timeScale(normal()));
  currMs += interval;
  var time = new Date(currMs);
  var obj = { interval: interval, value: value, time: time, ts: currMs }
  return obj;
})

// create the real time chart
var chart = realTimeChart()
    .title("Gráfico do arquivo .csv")
    .yTitle("Y Scale")
    .xTitle("X Scale")
    .border(true)
    .width(600)
    .height(290)
    .barWidth(1)
    .initialData(data);

console.log("Version: ", chart.version);
console.dir("Dir++");
console.trace();
console.warn("warn")

// invoke the chart
var chartDiv = d3.select("#viewDiv").append("div")
    .attr("id", "chartDiv")
    .call(chart);

// alternative invocation
//chart(chartDiv); 


// drive data into the chart roughly every second
// in a normal use case, real time data would arrive through the network or some other mechanism
var d = 0;
function dataGenerator() {

  var timeout = Math.round(timeScale(normal()));

  setTimeout(function() {

    // create new data item
    var now = new Date();
    var obj = {
      value: getValue(1), // random data
      //value: Math.round((d++ % 60) / 60 * 95), // ramp data
      time: now,
      color: "red",
      ts: now.getTime(),
      interval: timeout
    };

    // send the datum to the chart
    chart.datum(obj);

    // do forever
    dataGenerator();

  }, timeout);
}

// start the data generator
dataGenerator();
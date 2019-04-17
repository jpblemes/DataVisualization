var csvObject = {
    indice: 0,
    data: 0,
    horario: 0,
    POX: 0
}
var csv = "csvFiles/T1_POX.csv"
var csvPox1 = new Array(csvObject);
var csvPox2 = new Array(csvObject);
var csvPox3 = new Array(csvObject);
var setCsv1 = 1;
var setCsv2 = 0;
var setCsv3 = 0;
var idata1 = 0;
var idata2 = 0;
var idata3 = 0;

function getValue(numCsv){
    if(numCsv == 1){
        if(setCsv1 == 1){
            idata1++;
            return csvPox1[idata1-1].POX;
        }  
        else
            return 0;
    }
    if(numCsv == 2){
        if(setCsv2 == 1){
            idata2++;
            return csvPox2[idata2-1].POX;
        }  
        else
            return 0;
    }
    if(numCsv == 3){
        if(setCsv3 == 1){
            idata3++;
            return csvPox3[idata3-1].POX;
        }  
        else
            return 0;
    }
    
}

$.ajax({
    url: csv,
    async: false,
    success: function (csvd) {
        csvPox1 = $.csv.toObjects(csvd);
        setCsv1 = 1;
    },
    dataType: "text",
    complete: function () {
        // call a function on complete 
    }
});

// var formdata = new FormData($("form[name='nome_do_form']")[0]);
// var link = "form/insert";
//     $.ajax({
//         type: 'POST',
//         url: link,
//         data: formdata ,
//         processData: false,
//         contentType: false

//     }).done(function (data) {
//         $("div.container-fluid").html(data);
//     });

$(document).ready(function() {    

    // The event listener for the file upload
    document.getElementById('csvPox1').addEventListener('change', upload, false);
    
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
        alert('The File APIs are not fully supported in this browser!');
        } else {
            var data = null;
            var file = evt.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event) {
                var csvData = event.target.result;
                data = $.csv.toObjects(csvData);
                if (data && data.length > 0) {
                  csvPox1 = data;
                  setCsv1 = 1;
                  
                } else {
                    alert('No data to import!');
                }
            };
            reader.onerror = function() {
                alert('Unable to read ' + file.fileName);
            };
        }
    }
});

$(document).ready(function() {    

    // The event listener for the file upload
    document.getElementById('csvPox2').addEventListener('change', upload, false);
    
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
        alert('The File APIs are not fully supported in this browser!');
        } else {
            var data = null;
            var file = evt.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event) {
                var csvData = event.target.result;
                data = $.csv.toObjects(csvData);
                if (data && data.length > 0) {
                  csvPox2 = data;
                  setCsv2 = 1;
                  
                } else {
                    alert('No data to import!');
                }
            };
            reader.onerror = function() {
                alert('Unable to read ' + file.fileName);
            };
        }
    }
});

$(document).ready(function() {    

    // The event listener for the file upload
    document.getElementById('csvPox3').addEventListener('change', upload, false);
    
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
        alert('The File APIs are not fully supported in this browser!');
        } else {
            var data = null;
            var file = evt.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event) {
                var csvData = event.target.result;
                data = $.csv.toObjects(csvData);
                if (data && data.length > 0) {
                  csvPox3 = data;
                  setCsv3 = 1;
                  
                } else {
                    alert('No data to import!');
                }
            };
            reader.onerror = function() {
                alert('Unable to read ' + file.fileName);
            };
        }
    }
});

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
        csv1: getValue(1),
        csv2: getValue(2),
        csv3: getValue(3)
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


function seedData() {
    var now = new Date();
    for (var i = 0; i < MAX_LENGTH; ++i) {
        lineArr.push({
            time: new Date(now.getTime() - ((MAX_LENGTH - i) * duration)),
            csv1: 0,
            csv2: 0,
            csv3: 0
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    seedData(csvPox1);
    window.setInterval(updateData, 500);
    d3.select("#chart").datum(lineArr).call(chart);
    d3.select(window).on('resize', resize);
});
document.addEventListener("para", function() {
    seedData(csvPox1);
    window.setInterval(updateData, 500);
    d3.select("#chart").datum(lineArr).call(chart);
    d3.select(window).on('resize', resize);
});


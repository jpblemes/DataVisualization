var csvObject = {
  indice: 0,
  data: 0,
  horario: 0,
  DATA: 0
}
var csv = "csvFiles/test.csv"
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

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 60},
    width = 400 - margin.left - margin.right,
    height = 240 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
          

//Read the data
d3.csv(csv,

  // When reading the csv, I must format variables:
  function(d){
    return { id : d.id, date : d.date, time : d3.timeParse("%H:%M:%S")(d.time), DATA : d.DATA }
  },

  // Now I can use this dataset:
  function(data) {
    console.log(data);
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.time; }))
      .range([ 0, width ]);
    xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

      xAxis = svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style("font-size", "12px") 
      .text("Tempo");
      
        
        
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 1100])
      //.domain([0, d3.max(data, function(d) { return +d.DATA; })]) a linha de cima era assim
      .range([ height, 0 ]);
    yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);
        

    // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    var line = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Add the line
    line.append("path")
      .datum(data)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.time) })
        .y(function(d) { return y(d.DATA) })
        )

    // Add the brushing
    line
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart() {

      // What are the selected boundaries?
      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      line
          .select('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.time) })
            .y(function(d) { return y(d.DATA) })
          )
          xAxis = svg.append("text")
          .attr("transform",
              "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
          .style("text-anchor", "middle")
          .style("font-size", "12px") 
          .text("Tempo");
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick",function(){
      x.domain(d3.extent(data, function(d) { return d.time; }))
      xAxis.transition().call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d) { return x(d.time) })
          .y(function(d) { return y(d.DATA) })
        
          
      )
      xAxis = svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style("font-size", "12px") 
      .text("Tempo");
    });

})

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////


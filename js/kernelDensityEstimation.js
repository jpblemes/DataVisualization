var csv = "csvFiles/test.csv"

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = {top: 20, right: 30, bottom: 30, left: 40};

var x = d3.scaleLinear()
    .domain([0, 1200])
    .range([margin.left, width - margin.right]);

var y = d3.scaleLinear()
    .domain([0, 0.5])
    .range([height - margin.bottom, margin.top]);

svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(d3.axisBottom(x))
  .append("text")
    .attr("x", width)
    .attr("y", +30)
    .attr("fill", "#000")
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .text("Valores de GSR/POX");

svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y).ticks(null, "%"));

//d3.json("faithful.json", function(error, faithful) {

d3.csv(csv,

  // When reading the csv, I must format variables:
  function(d){
    return { id : d.id, date : d.date, time : d3.timeParse("%H:%M:%S")(d.time), DATA : d.DATA }
  },  
  
  function(data) {
  var n = data.length,
      bins = d3.histogram().domain(x.domain()).thresholds(25)(faithful),
      density = kernelDensityEstimator(kernelEpanechnikov(1), x.ticks(25))(faithful);

  svg.insert("g", "*")
      .attr("fill", "#bbb")
    .selectAll("rect")
    .data(bins)
    .enter().append("rect")
      .attr("x", function(d) { return x(d.x0) + 1; })
      .attr("y", function(d) { return y(d.length / n); })
      .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
      .attr("height", function(d) { return y(0) - y(d.length / n); });

  svg.append("path")
      .datum(density)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
          .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); }));
});

function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}

function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}
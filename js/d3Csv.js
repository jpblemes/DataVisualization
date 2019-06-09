d3.csv("T1_GSR.csv")
    .row(function(d) { return {indice: d.indice, data: d.data, horario: d.horario, gsr: +d.gsr}; })
    .get(function(error, rows) { console.log("111"); });

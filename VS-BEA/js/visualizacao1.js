var gauge1 = loadLiquidFillGauge("fillgauge1", 0);
var config1 = liquidFillGaugeDefaultSettings();
config1.circleColor = "#FF7778";
config1.textColor = "#FF4444";
config1.waveTextColor = "#FFAAAA";
config1.waveColor = "#FFDDDD";
config1.circleThickness = 0.2;
config1.textVertPosition = 0.2;
config1.waveAnimateTime = 1000;
var gsrv = [];
var clickevent=0;
function NewValue(){
return gsrv[clickevent]; 
}
function updateclickevent(){
clickevent = clickevent+1;
}
//ficheiro começa aqui
var rowToHtml = function( row ) {
    var result = "";
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
        gsrv[i]=gsrv[i].substring(0,3);
        gsrv[i]=Number(gsrv[i]);
        }
    d3.select("div#preview").html(
        //"<b>First row:</b><br/>"+str
        );    
    })
}

d3.select("html")
    .style("height","100%")

d3.select(".gsr")
    .style("height","100%")
    .style("font", "12px sans-serif")
    
    .append("input")
    .attr("type", "file")
    .attr("accept", ".csv")
    .style("margin", "5px")
    .on("change", function() {
    var file = d3.event.target.files[0];
        if (file) {
            var reader = new FileReader();
            clickevent=0;
            reader.onloadend = function(evt) {
                var dataUrl = evt.target.result;
                // The following call results in an "Access denied" error in IE.
                previewCsvUrl(dataUrl);
            };
            reader.readAsDataURL(file);
        }
    })

d3.select("body")
.append("div")
    .attr("id", "preview")
    .style("margin", "5px")

// Initialize with csv file from server
previewCsvUrl("T1_GSR.csv")
//ficheiro termina aqui
    
var inter = setInterval(function() {
    gauge1.update(NewValue());
    updateclickevent();
}, 4000); 
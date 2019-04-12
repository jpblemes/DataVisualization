$(document).ready(function(){
    $('.gsr').tooltip();
});

$(document).ready(function(){
    $('.pox').tooltip();
});
      
document.getElementById("uploadBtn").onchange = function () {
    document.getElementById("uploadFile").value = this.value;
};
var problem = {
    id: "",
    LocalDoProblema: "",
    HeuristicaProblema: "",
    Consequencia: "",
    Criticidade: "",
    Recomendacoes: "",
    Status: "",
    Comentarios: ""
}
var lines = [];
var count = 0;

jQuery.get('problemas.txt', function(text) {

    lines = text.split("\n");
    
    for(var x = 0; x < lines.length; x++){
        if(count == 0){
            problem.id = lines[x];
            count++;
        }else if(count == 1){
            problem.LocalDoProblema = lines[x];
            count++;
        }else if(count == 2){
            problem.HeuristicaProblema = lines[x];
            count++;
        }else if(count == 3){
            problem.Consequencia = lines[x];
            count++;
        }else if(count == 4){
            problem.Criticidade = lines[x];
            count++;
        }else if(count == 5){
            problem.Recomendacoes = lines[x];
            count++;
        }else if(count == 6){
            problem.Status = lines[x];
            count++;
        }else if(count == 7){
            problem.Comentarios = lines[x];
            insereTabela();
            count = 0;
        }
    }
 });

 function insereTabela() {
    var corpoTabela = $(".tabela").find("tbody");

    var linha = novaLinha();

    corpoTabela.append(linha);
    $(".tabela").slideDown(500);

}

function novaLinha() {

    var linha = $("<tr>");
    var colunaId = $("<td>").text(problem.id);
    var colunaLocalDoProblema = $("<td>").text(problem.LocalDoProblema);
    var colunaHeuristicaProblema  = $("<td>").text(problem.HeuristicaProblema);
    var colunaConsequencia  = $("<td>").text(problem.Consequencia);
    var colunaCriticidade  = $("<td>").text(problem.Criticidade);
    var colunaRecomendacoes  = $("<td>").text(problem.Recomendacoes);
    var colunaStatus  = $("<td>").text(problem.Status);
    var conlunaComentarios  = $("<td>").text(problem.Comentarios);


    linha.append(colunaId);
    linha.append(colunaLocalDoProblema);
    linha.append(colunaHeuristicaProblema);
    linha.append(colunaConsequencia);
    linha.append(colunaCriticidade);
    linha.append(colunaRecomendacoes);
    linha.append(colunaStatus);
    linha.append(conlunaComentarios);

    return linha;
}

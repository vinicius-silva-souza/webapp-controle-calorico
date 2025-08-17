import { request, cardRefeicoes, associarEventos, visualizarRefeicao, inativarRefeicao, feedback } from "./Main";

let containerRefeicoes = document.querySelector(".container-refeicoes");
let btnUltimosRegistros = document.getElementById('btn-ultimos-registros');
let codUsuario = 1;
let url = `http://127.0.0.1:3000/refeicoes/usuario/${codUsuario}/hoje`;

window.addEventListener('load', function(){
    request(url, (data)=>{
        containerRefeicoes.innerHTML = '';
        for (const refeicao of data) 
        {
            cardRefeicoes(
                refeicao.Cod_Refeicao,
                refeicao.Nome_Refeicao,
                refeicao.Data_Refeicao,
                refeicao.Hora,
                refeicao.Qtd_Alimentos,
                refeicao.Alimentos_Na_Refeicao,
                refeicao.Total_kcal
            );
        }
        associarEventos('.card-refeicoes-btn-visualizar', 'onclick', function(element){
            let codRefeicao = element.getAttribute('cod-refeicao');
            visualizarRefeicao(codRefeicao);
        });
        associarEventos('.card-refeicoes-btn-inativar', 'onclick', function(element){
            let codRefeicao = element.getAttribute('cod-refeicao');
            inativarRefeicao(codRefeicao).then(
                ()=>{
                    feedback(
                        'Alimento removido com sucesso!',
                        'palegreen',
                        'white'
                    );
                },
                msgErro => {
                    feedback(msgErro, 'indianred', 'white');
                }
            );
        });
    });
});

btnUltimosRegistros.addEventListener('click', function(){
    let elTituloFuncao = document.getElementById("titulo-funcao");
    let icone = document.getElementById("titulo-funcao-icone");
    elTituloFuncao.innerText = 'Registros de hoje';
    icone.setAttribute('name', 'history');
    request(url, (data)=>{
        containerRefeicoes.innerHTML = '';
        for (const refeicao of data) 
        {
            cardRefeicoes(
                refeicao.Cod_Refeicao,
                refeicao.Nome_Refeicao,
                refeicao.Data_Refeicao,
                refeicao.Hora,
                refeicao.Qtd_Alimentos,
                refeicao.Alimentos_Na_Refeicao,
                refeicao.Total_kcal
            );
        }
        associarEventos('.card-refeicoes-btn-visualizar', 'onclick', function(element){
            let codRefeicao = element.getAttribute('cod-refeicao');
            visualizarRefeicao(codRefeicao);
        });
        associarEventos('.card-refeicoes-btn-inativar', 'onclick', function(element){
            let codRefeicao = element.getAttribute('cod-refeicao');
            inativarRefeicao(codRefeicao, element).then(
                ()=>{
                    feedback(
                        'Refeição removida com sucesso!',
                        'palegreen',
                        'white'
                    );
                },
                msgErro => {
                    feedback(msgErro, 'indianred', 'white');
                }
            );
        });
    });
});


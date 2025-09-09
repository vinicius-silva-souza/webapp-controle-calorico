
import { request, cardRefeicoes, associarEventos, visualizarRefeicao, inativarRefeicao, feedback } from "./Main";
import { ocultarGrafico } from "./Graficos";

let containerRefeicoes = document.querySelector(".container-refeicoes");
let btnFiltrarPeriodos = document.getElementById("btn-filtrar-periodo");
let inpDataInicial = document.getElementById("date-periodo-inicial");
let inpDataFinal = document.getElementById("date-periodo-final");

btnFiltrarPeriodos.addEventListener("click", function(){
    ocultarGrafico();
    let elTituloFuncao = document.getElementById("titulo-funcao");
    let icone = document.getElementById("titulo-funcao-icone");
    elTituloFuncao.innerText = 'Registros encontrados';
    icone.setAttribute('name', 'search-alt');
    if(inpDataInicial.value === "" && inpDataFinal.value === ""){
        window.alert("Há campos a serem preenchidos com data válida");
    } else  {
        if(inpDataInicial.valueAsNumber > inpDataFinal.valueAsNumber){
            window.alert("A data inicial não pode ser maior que a data final");
        } else {
            let dataInicial = inpDataInicial.value;
            let dataFinal = inpDataFinal.value;
            let codUsuario = 1;
            let statusRefeicao = 0;
            let url = `http://127.0.0.1:3000/refeicoes/usuario/${codUsuario}/${statusRefeicao}/periodo/${dataInicial}/${dataFinal}`;
            
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
        }
    }
})



import { feedback, limparCriarRegistros } from "./Main";

let inserirRefeicao = function(objProdutos){
    let promise = new Promise((resolve, reject)=>{
        fetch(
            'http://127.0.0.1:3000/refeicoes/criar', 
            {method: 'POST', body: objProdutos}
        )
        .then((response)=>{
            if(response.status === 201){
                return resolve(response);
            } else {
                let msgErro = "Houve um erro: ".concat(
                    response.status,
                    response.statusText
                );
                console.error(msgErro);
                return reject(msgErro);
            }
        })
        .catch((err)=>{
           console.error('Houve um problema com a requisição Fetch:', err);
        });
    });
    return promise;
};

document.getElementById("btn-salvar-registro").
    addEventListener("click", function(){
        let jsonText = '';
        let jsonRefeicao = dadosRefeicao();
        let jsonProduto = dadosProduto();   
        jsonRefeicao.Alimentos = jsonProduto;
        jsonText = JSON.stringify(jsonRefeicao);
        
        inserirRefeicao(jsonText).then(
            ()=>{
                feedback(
                    'Refeição adicionada com sucesso!',
                    'palegreen',
                    'white'
                );
                limparCriarRegistros();
                document.querySelector('#form-adicionar-registro').style.display = 'none';
            },
            msgErro => {console.error(msgErro);}
        );
    }
);

function dadosProduto(){
    let produtosHTMLCollection =  document.getElementById("container-itens-registro").children;
    let i = 1;
    let arr = [];
    for (const element of produtosHTMLCollection) {
        let produto = {};
        let prodCodBarras = element.getAttribute("id-produto");
        let prodNome = element.querySelector(".produto-nome");
        let prodConsumo = element.querySelector(".produto-consumo");
        let prodPorcaoConsumida = element.querySelector(".produto-porcoes-consumidas");
        let prodPorcaoPadrao = element.querySelector(".produto-porcao-padrao");
        let prodKcalConsumida = element.querySelector(".produto-kcal-consumida");
        let prodKcalPorcao = element.querySelector(".produto-kcal-porcao");
        let prodEmbalagem = element.querySelector(".produto-embalagem");
        produto.Id = i;
        produto.Cod_Barras = prodCodBarras;
        produto.Cod_Refeicao = null;
        produto.Nome_Alimento = prodNome.innerText;
        produto.Consumo = prodConsumo.value;
        produto.Porcoes_Consumidas = prodPorcaoConsumida.innerText;
        produto.Porcao_Padrao = prodPorcaoPadrao.innerText;
        produto.Kcal_Consumidas = prodKcalConsumida.innerText;
        produto.Kcal_Por_Porcao = prodKcalPorcao.innerText;
        produto.Qtd_Embalagem = prodEmbalagem.innerText;
        arr.push(produto);
        i++;
    }
    return arr;
}

function dadosRefeicao(){
    let refeicao = {
        "Alimentos": [],
        "Cod_Usuario": 1,
        "Nome_Refeicao": "",
        "Data_Refeicao": "",
        "Hora": "",
        "Total_kcal": "",
        "Refeicao_Inativa": 0,
        "Qtd_Alimentos": 1,
        "Alimentos_Na_Refeicao": "",
        "Set_Data_Refeicao": function(dateObj){
            if(dateObj instanceof Date){
                let mes = dateObj.getMonth() + 1;
                let dia = dateObj.getDate();
                let ano = dateObj.getFullYear();
                if(dateObj.getMonth() < 10) mes = "0" + mes;
                if(dateObj.getDate() < 10) dia = "0" + dia;
                this.Data_Refeicao = ano + "-" + mes + "-" + dia;
            } else {
                console.error("Tipo de dado incorreto passado como parâmetro");
                this.Data_Refeicao = "";
            }
        },
        "Set_Hora": function(dateObj){
             if(dateObj instanceof Date){
                let hora = dateObj.getHours(); 
                let minuto = dateObj.getMinutes();
                if(dateObj.getHours() < 10) hora = "0" + dateObj.getHours();
                if(dateObj.getMinutes() < 10) minuto = "0" + dateObj.getMinutes();
                this.Hora = hora + ":" + minuto;
            } else {
                console.error("Tipo de dado incorreto passado como parâmetro");
                this.Hora = "";
            }
        }
    };
    let elNomeRefeicao = document.querySelector('[name="refeicao-nome"]');
    let elDataRefeicao = document.querySelector('[name="refeicao-data"]');
    let elTotalKcalRefeicao = document.querySelector("#criar-registro-total-kcal");
    let elContainerRegistros = document.querySelector("#container-itens-registro");
    let date = new Date(elDataRefeicao.value);
    let alimentos = ()=>{
        let str = "";
        let elProdNome = document.querySelectorAll(".produto-nome");
        for (const element of elProdNome) {
            str += " > " + element.innerText;
        }
        return str;
    }
    
    refeicao.Cod_Usuario = 1;
    refeicao.Nome_Refeicao = elNomeRefeicao.value;
    refeicao.Set_Data_Refeicao(date);
    refeicao.Set_Hora(date);
    refeicao.Total_kcal = elTotalKcalRefeicao.innerText;
    refeicao.Refeicao_Inativa = 0;
    refeicao.Qtd_Alimentos = elContainerRegistros.childElementCount;
    refeicao.Alimentos_Na_Refeicao = alimentos();
    return refeicao;
}
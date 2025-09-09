import { calculaCaloria} from "./AdicionarItem";
import { grafico } from "./Graficos";

let request = function(url, callback){
    fetch(url, {method: 'GET'})
    .then((response)=>{
        if(response.status === 200){
            return response.json();
        } 
        else {
            let msgErro = "Houve um erro: ".concat(
                response.status,
                response.statusText
            );
            console.error(msgErro);
        }
    })
    .then(
        response =>{callback(response);},
        msgErro=>{console.error(msgErro);}
    )
    .catch((err)=>{
        console.error('Houve um problema com a requisição Fetch:', err);
    });
}

function getParents(target, parentNumber){
    let arr = [target.parentElement];
    let obj = {};
    for(let i = 0; i < parentNumber; i++){
        arr.push(arr[i].parentElement);
    }
    obj.firstParent = arr[0];
    obj.parents = arr;
    obj.lastParent = arr[arr.length - 1];
    return obj;
}

function limparCriarRegistros(){
    document.querySelector('[name="refeicao-nome"]').value = '';
    document.querySelector('[name="refeicao-data"]').value = '';
    document.querySelector('#container-itens-registro').innerHTML = '';
    document.querySelector('#criar-registro-total-kcal').innerText = '0';
}

function cardRefeicoes(codRefeicao, nomeRefeicao, data, hora, qtdAlimentos, alimentosNaRefeicao, totalKcal){
    let containerRefeicoes = document.querySelector(".container-refeicoes");
    containerRefeicoes.innerHTML +=
    '<div class="w3-col s12 m10 l6 card-refeicoes">'
        + '<div class="card-refeicoes-conteudo">'
            + `<h4 class="card-refeicoes-titulo">${nomeRefeicao}</h4>`
            + '<div class="card-refeicoes-icone-container">'
                + '<div class="card-refeicoes-icone">'
                    + '<box-icon class="w3-cell w3-cell-middle w3-small" type="regular" name="calendar" size="sm"></box-icon>'
                    + `<small><b>${data}</b></small>`
                + '</div>'
                + '<div class="card-refeicoes-icone">'
                    + '<box-icon class="w3-cell w3-cell-middle w3-small" type="regular" name="time" size="sm"></box-icon>'
                    + `<small><b>${hora}</b></small>`
                + '</div>'
            + '</div>'
        + '</div>'
        + '<div class="card-refeicoes-conteudo">'
            + '<details class="card-refeicoes-alimentos">'
                + `<summary>Alimentos (${qtdAlimentos})</summary>`
                + `<small>${alimentosNaRefeicao}</small>`
            + '</details>'
            + '<div class="card-refeicoes-icone-container">'
                + '<div class="card-refeicoes-icone">'
                    + '<box-icon class="w3-cell w3-cell-middle w3-small" type="solid" name="hot" size="sm"></box-icon>'
                    + `<small><b>${totalKcal} kcal</b></small>`
                + '</div>'
            + '</div>'
        + '</div>'
        + '<div class="card-refeicoes-btn-container">'
            + `<button class="card-refeicoes-icone card-refeicoes-btn card-refeicoes-btn-visualizar w3-pale-green" type="button" cod-refeicao="${codRefeicao}">`
                + '<box-icon class="w3-cell w3-cell-middle w3-small w3-round-large" type="regular" name="show" size="sm"></box-icon>'
                + '<small><b>Visualizar</b></small>'
            + '</button>'
            + `<button class="card-refeicoes-icone card-refeicoes-btn card-refeicoes-btn-inativar w3-pale-red" type="button" cod-refeicao="${codRefeicao}">`
                + '<box-icon class="w3-cell w3-cell-middle w3-small w3-round-large" type="regular" name="x-circle" size="sm"></box-icon>'
                + '<small><b>Inativar</b></small>'
            + '</button>'
        + '</div>'
    + '</div>'; 
}

function associarEventos(cssSelector, evento, funcao){
    let collection = document.querySelectorAll(cssSelector);
    if(collection.length > 0){
        for (const elemento of collection) {
            elemento[evento] = function(){
                funcao(this);
            };
        }
    }
}

function desassociarEventos(cssSelector, evento){
    let collection = document.querySelectorAll(cssSelector);
    if(collection.length > 0){
        for (const elemento of collection) {
            elemento[evento] = null;
        }
    }
}

function getDate(dateObj, what){
    try {
        let date = undefined;  
        if(dateObj === null){
            date = new Date();
        } else if(dateObj instanceof Date){
            date = dateObj;
        } else {
            throw new TypeError('O argumento fornecido ao parâmetro "dateObj" não é válido');
        }

        if(typeof what === "string"){
            switch(what){
                case "day":
                    return date.getDate();
                case "weekday":
                    return date.getDay() + 1;
                case "month":
                    return date.getMonth() + 1;
                case "year":
                    return date.getFullYear();
                case "date":
                    return date.toLocaleDateString();
                case "dateUS":
                    let mes = date.getMonth() + 1;
                    let dia = date.getDate();
                    let ano = date.getFullYear();
                    if(date.getMonth() < 10) mes = "0" + mes;
                    if(date.getDate() < 10) dia = "0" + dia;
                    return ano + "/" + mes + "/" + dia;
                default:
                  throw new TypeError(`O argumento ${what} não é válido para o parâmetro "what"`);
            }
        } else {
            throw new TypeError('É necessário fornecer o tipo "string" ao parâmetro "what"');
        }
    } catch (err) {
        console.error(err.name + ": " + err.message);
    } 
}

function getMonthName(dateObj){
    try {
        let date = undefined; 
        let month = undefined; 

        if(dateObj === null){
            date = new Date();
        } else if(dateObj instanceof Date){
            date = dateObj;
        } else {
            throw new TypeError('O argumento fornecido ao parâmetro "dateObj" não é válido');
        }

        month = date.getMonth() + 1;
        switch(month){
            case 1: return "Janeiro";
            case 2: return "Fevereiro";
            case 3: return "Março";
            case 4: return "Abril";
            case 5: return "Maio";
            case 6: return "Junho";
            case 7: return "Julho";
            case 8: return "Agosto";
            case 9: return "Setembro";
            case 10: return "Outubro";
            case 11: return "Novembro";
            case 12: return "Dezembro";
        }
    } catch (err) {
        console.error(err.name + ": " + err.message);
    }
}

function adicionaItem(alimento){
    let codAlimento = alimento.Cod_Alimento;
    let codRefeicao = alimento.Cod_Refeicao;
    let codBarras = alimento.Cod_Barras;
    let nome = alimento.Nome_Alimento;
    let consumo = alimento.Consumo;
    let porcaPadrao = alimento.Porcao_Padrao;
    let porcoesConsumidas = alimento.Porcoes_Consumidas;
    let kcalPorPorcao = alimento.Kcal_Por_Porcao;
    let kcalConsumidas = alimento.Kcal_Consumidas;
    let qtdEmbalagem = alimento.Qtd_Embalagam;
    let containerItensRegistro = document.getElementById("container-itens-registro");
    
    containerItensRegistro.innerHTML += 
    `<div id="card-item-${codBarras}" id-produto="${codBarras}" class="w3-panel w3-padding-small w3-pale-green w3-round-large">`
        + `<div class="w3-col w3-padding-small">`
            + `<div class="w3-col s7">`
                + `<b class="w3-small produto-nome">${nome}</b>`
            + `</div>`
            + `<div class="btn-atualizar-remover s5">`
                + `<button id="btn-atualiza-item-${codAlimento}" id-produto="${codBarras}" cod-alimento="${codAlimento}" cod-refeicao="${codRefeicao}" type="button" class="btn-atualiza-item w3-border-0 w3-padding-small w3-round-large w3-light-gray">`
                    + `<box-icon class="w3-cell-top" name='refresh' type='regular' size="sm"></box-icon>`
                + `</button>`
                + `<button id="btn-remove-item-${codAlimento}" id-produto="${codBarras}" cod-alimento="${codAlimento}" type="button" class="btn-remove-item w3-border-0 w3-padding-small w3-round-large w3-light-gray">`
                    + `<box-icon class="w3-cell-top" name='trash' type='regular' size="sm"></box-icon>`
                + `</button>`
            + `</div>`
        + `</div>`
        + `<div class="w3-col w3-center w3-padding-small">`
            + `<div class="w3-col w3-tiny">`
                + `<div class="w3-show-inline-block w3-padding-small w3-margin-5 w3-round-large w3-pale-red">`
                    + `<b>Consumo (g): </b>`
                    + `<input id="inp-consumo-${codAlimento}" id-produto="${codBarras}" class="produto-consumo" step="0.1" type="number" min="0.1" value="${consumo}" style="width: 70px;">`
                + `</div>`
            + `</div>`
            + `<div class="w3-col w3-tiny">`
                + `<div class="w3-show-inline-block w3-margin-5">`
                    + `<b>Porções consumidas: </b>`
                    + `<b id="porcoes-consumidas-${codAlimento}" class="w3-pale-red w3-padding-small w3-round-large produto-porcoes-consumidas" tag-id="porcoes-consumidas-${codBarras}">${porcoesConsumidas}</b>`
                + `</div>`
                + `<div class="w3-show-inline-block w3-margin-5">`
                    + `<b>Porção padrão: </b>`
                    + `<span class="produto-porcao-padrao" tag-id="porcao-padrao-${codBarras}">${porcaPadrao}</span>`
                + `</div>`
                + `<div class="w3-show-inline-block w3-margin-5">`
                    + `<b>Kcal consumida: </b>`
                    + `<b id="kcal-consumida-${codAlimento}" class="w3-pale-red w3-padding-small w3-round-large produto-kcal-consumida" tag-id="kcal-consumida-${codBarras}">${kcalConsumidas}</b>`
                + `</div>`
                + `<div class="w3-show-inline-block w3-margin-5">`
                    + `<b>Kcal p/ porção: </b>`
                    + `<span class="produto-kcal-porcao" tag-id="kcal-porcao-${codBarras}">${kcalPorPorcao}</span>`
                + `</div>`
                + `<div class="w3-show-inline-block w3-margin-5">`
                    + `<b>Embalagem: </b>`
                    + `<span class="produto-embalagem">${qtdEmbalagem}</span>`
                + `</div>`
            + `</div>`
        + `</div>` +
    `</div>`;
}

let atualizarNomeRefeicao = function(){
    let elNomeRefeicao = document.querySelector('[name="refeicao-nome"]');
    let nomeRefeicao = elNomeRefeicao.value;
    let codRefeicao = elNomeRefeicao.getAttribute('cod-refeicao');
    let obj = {Nome_Refeicao: nomeRefeicao};
    let url = `http://127.0.0.1:3000/refeicao/${codRefeicao}/atualizarNome`;
    let promise = new Promise((resolve, reject)=>{
        fetch(url, {
                method: 'PATCH', 
                body: JSON.stringify(obj), 
                headers: {"Content-Type": "application/json"}
            }
        )
        .then((response)=>{
            if(response.status === 204){
                return resolve();
            } 
            else {
                let msgErro = "Houve um erro: ".concat(
                    response.status, ' ',
                    response.statusText
                );
                return reject(msgErro);
            }
        })
        .catch((err)=>{
            feedback(
                `Houve um problema com a requisição Fetch: ${err}`,
                'indianred',
                'white'
            );
            console.error('Houve um problema com a requisição Fetch: ', err);
        });
    });
    return promise;
}

let atualizarDataRefeicao = function(){
    let elDataRefeicao = document.querySelector('[name="refeicao-data"]');
    let dataRefeicao = elDataRefeicao.value;
    let codRefeicao = elDataRefeicao.getAttribute('cod-refeicao');
    let obj = {};
    let url = `http://127.0.0.1:3000/refeicao/${codRefeicao}/atualizarDataHora`;
    let promise = new Promise((resolve, reject)=>{
        if(dataRefeicao === ""){
            reject('Data inválida');
        }
        obj = {
            Data_Refeicao: dataRefeicao.split('T')[0],
            Hora: dataRefeicao.split('T')[1]
        };
        fetch(url, {
                method: 'PATCH', 
                body: JSON.stringify(obj), 
                headers: {"Content-Type": "application/json"}
            }
        )
        .then((response)=>{
            if(response.status === 204){
                return resolve();
            } 
            else {
                let msgErro = "Houve um erro: ".concat(
                    response.status, ' ',
                    response.statusText
                );
                return reject(msgErro);
            }
        })
        .catch((err)=>{
            feedback(
                `Houve um problema com a requisição Fetch: ${err}`,
                'indianred',
                'white'
            );
            console.error('Houve um problema com a requisição Fetch: ', err);
        });
    });
    return promise;
}

function atualizarAlimento(element){
    let codAlimento = Number.parseInt(element.getAttribute("cod-alimento"));
    let codRefeicao = Number.parseInt(element.getAttribute("cod-refeicao"));
    let inpConsumo = document.getElementById(`inp-consumo-${codAlimento}`);
    let elPorcoesConsumidas = document.getElementById(`porcoes-consumidas-${codAlimento}`);
    let elKcalConsumidas = document.getElementById(`kcal-consumida-${codAlimento}`);
    let elTotalKcalRefeicao = document.querySelector("#criar-registro-total-kcal");
    let consumo = Number.parseFloat(inpConsumo.value);
    let porcoesConsumidas = Number.parseFloat(elPorcoesConsumidas.innerText);
    let kcalConsumidas = Number.parseFloat(elKcalConsumidas.innerText);
    let totalKcal = Number.parseFloat(elTotalKcalRefeicao.innerText);
    let obj = {
        alimento: {
            Cod_Alimento: codAlimento,
            Consumo: consumo,
            Porcoes_Consumidas: porcoesConsumidas,
            Kcal_Consumidas: kcalConsumidas
        },
        refeicao: {
            Total_kcal: totalKcal
        }
    };
    let url = `http://127.0.0.1:3000/refeicao/${codRefeicao}/alimento/${codAlimento}/atualizar`
    let promise = new Promise((resolve, reject)=>{
        fetch(url, {
                method: 'PATCH', 
                body: JSON.stringify(obj), 
                headers: {"Content-Type": "application/json"}
            }
        )
        .then((response)=>{
            if(response.status === 204){
                return resolve();
            } 
            else {
                let msgErro = "Houve um erro: ".concat(
                    response.status, ' ',
                    response.statusText
                );
                return reject(msgErro);
            }
        })
        .catch((err)=>{
            feedback(
                `Houve um problema com a requisição Fetch: ${err}`,
                'indianred',
                'white'
            );
            console.error('Houve um problema com a requisição Fetch: ', err);
        });
    });
    return promise;
}

function removerAlimento(element){
    let confirm = window.confirm(''.concat(
        'Deseja mesmo remover o alimento de sua refeição?\n',
        'Se sim, selecione "OK". ',
        'Caso contrário, selecione "Cancelar"\n',
        '[ESSA AÇÃO É IRREVERSÍVEL]'
    ));
    let promise = new Promise((resolve, reject)=>{
       if(confirm){
            let codAlimento = element.getAttribute('cod-alimento');
            let url = `http://127.0.0.1:3000/alimento/${codAlimento}/inativar`;
            fetch(url, {
                method: 'PATCH', 
                headers: {"Content-Type": "application/json"}
            })
            .then((response)=>{
                if(response.status === 204){
                    let itemRemovido = getParents(element, 2).lastParent;
                    itemRemovido.remove();
                    return resolve();
                } 
                else {
                    let msgErro = "Houve um erro: ".concat(
                        response.status, ' ',
                        response.statusText
                    );
                    return reject(msgErro);
                }
            })
            .catch((err)=>{
                feedback(
                    `Houve um problema com a requisição Fetch: ${err}`,
                    'indianred',
                    'white'
                );
                console.error('Houve um problema com a requisição Fetch: ', err);
            });
       } 
       else {
        return reject("Operação cancelada");
       }
    });
    return promise;
}

function feedback(texto, bgColor, color){
    let div = document.createElement('div');
    let b = document.createElement('b');
    div.setAttribute('class', 'feedback');
    div.style.setProperty('background-color', bgColor);
    div.style.setProperty('color', color);
    div.appendChild(b);
    b.innerText = texto;
    document.body.insertAdjacentElement('afterbegin', div);
    window.setTimeout(()=> div.remove(), 3000);
}

function inativarRefeicao(codRefeicao, element){
    let confirm = window.confirm(''.concat(
        'Deseja mesmo inativar a refeição?\n',
        'Se sim, selecione "OK". ',
        'Caso contrário, selecione "Cancelar"\n',
        '[ESSA AÇÃO É IRREVERSÍVEL]'
    ));
    let promise = new Promise((resolve, reject)=>{
       if(confirm){
            let url = `http://127.0.0.1:3000/refeicao/${codRefeicao}/inativar`;
            fetch(url, {
                method: 'PATCH', 
                headers: {"Content-Type": "application/json"}
            })
            .then((response)=>{
                if(response.status === 204){
                    let itemRemovido = getParents(element, 1).lastParent;
                    itemRemovido.remove();
                    return resolve();
                } 
                else {
                    let msgErro = "Houve um erro: ".concat(
                        response.status, ' ',
                        response.statusText
                    );
                    return reject(msgErro);
                }
            })
            .catch((err)=>{
                feedback(
                    `Houve um problema com a requisição Fetch: ${err}`,
                    'indianred',
                    'white'
                );
                console.error('Houve um problema com a requisição Fetch: ', err);
            });
       } 
       else {
        return reject("Operação cancelada");
       }
    });
    return promise;
}

function visualizarRefeicao(codRefeicao){
    let formAdicionarRegistros = document.getElementById("form-adicionar-registro");
    let url = `http://127.0.0.1:3000/refeicao/${codRefeicao}`;
    formAdicionarRegistros.style.display = "block"; 
    request(url, (refeicao)=>{
        let nome = refeicao[0].Nome_Refeicao;
        let dataHora = refeicao[0].Data_Refeicao + 'T' + refeicao[0].Hora;
        let totalKcal = refeicao[0].Total_kcal;
        let containerItensRegistro = document.getElementById("container-itens-registro");
        let inpNomeRefeicao = document.querySelector('[name="refeicao-nome"]');
        let inpDataRefeicao = document.querySelector('[name="refeicao-data"]');
        let elTotalKcalRefeicao = document.querySelector('#criar-registro-total-kcal');

        url = `http://127.0.0.1:3000/alimentos/${codRefeicao}`;
        inpNomeRefeicao.value = nome;
        inpNomeRefeicao.setAttribute('cod-refeicao', codRefeicao);
        inpDataRefeicao.value = dataHora;
        inpDataRefeicao.setAttribute('cod-refeicao', codRefeicao);
        elTotalKcalRefeicao.innerText = totalKcal;
        containerItensRegistro.innerHTML = '';

        request(url, (alimentos)=>{
            for (const element of alimentos) {
                adicionaItem(element);
            }
            associarEventos('.produto-consumo', 'oninput', function(element){
                calculaCaloria(element);
            });
            associarEventos('[name="refeicao-nome"]', 'onblur', function(){
                atualizarNomeRefeicao().then(
                ()=>{
                    feedback(
                        'Nome atualizado com sucesso!',
                        'palegreen',
                        'white'
                    );
                },
                (msgErro)=>{
                    feedback(msgErro, 'indianred', 'white');
                })
            });
            associarEventos('[name="refeicao-data"]', 'onblur', function(element){
                atualizarDataRefeicao().then(
                ()=>{
                    feedback(
                        'Data atualizada com sucesso!',
                        'palegreen',
                        'white'
                    );
                },
                (msgErro)=>{
                    feedback(msgErro, 'indianred', 'white');
                })
            });
            associarEventos('.btn-atualiza-item', 'onclick', function(element){
                atualizarAlimento(element).then(
                ()=>{
                    feedback(
                        'Alimento atualizado com sucesso!',
                        'palegreen',
                        'white'
                    );
                },
                (msgErro)=>{
                    feedback(msgErro, 'indianred', 'white');
                });
            });
            associarEventos('.btn-remove-item', 'onclick', function(element){
                removerAlimento(element).then(
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
}

/* JANELA: PESQUISAR REGISTROS */

    let formPesquisarRegistros = document.getElementById("form-pesquisar-registros");
    let btnPesquisarRegistros = document.getElementById("btn-pesquisar-registros");
    
    btnPesquisarRegistros.addEventListener("click", function(){
        formPesquisarRegistros.style.display = "block"; 
    });

    // BOTÕES DE ACIONAMENTO: JANELA - PESQUISAR REGISTROS

    let btnFiltrarPeriodo1 = document.getElementById("btn-filtrar-periodo");
    let btnFecharRegistros = document.getElementById("btn-fechar-registros"); 

    btnFecharRegistros.addEventListener("click", function(){
        formPesquisarRegistros.style.display = "none";
    })

/* JANELA: VER RELATÓRIOS */

    let formVerRelatorios = document.getElementById("form-ver-relatorios");
    let btnVerRelatorios = document.getElementById("btn-ver-relatorios");

    btnVerRelatorios.addEventListener("click", function(){
        formVerRelatorios.style.display = "block";
        let dateObj = new Date();
        let date = getDate(dateObj, "dateUS");
        let month = getMonthName(dateObj);
        let inpDateSemanal = document.getElementById('inp-date-semanal');
        let selectMeses = document.getElementById('select-meses');
        let inpAno1 = document.getElementById('inp-ano-1');
        let inpAno2 = document.getElementById('inp-ano-2');

        inpDateSemanal.value = date.replaceAll("/", "-");;
        selectMeses.namedItem(month).selected = true;
        inpAno1.value = getDate(dateObj, "year");
        inpAno2.value = getDate(dateObj, "year");
    });
    
    // BOTÕES DE ACIONAMENTO: JANELA - VER RELATÓRIOS

    let btnGerarRelatorios = document.getElementById("btn-gerar-relatorios");
    let btnFecharRelatorios = document.getElementById("btn-fechar-relatorios");
    let opcaoRelatorio = document.getElementById('select-opcoes-relatorios');

    function desabilitarCampos(bool){
        document.getElementById('radio-semanal').disabled = bool;
        document.getElementById('radio-mensal').disabled = bool;
        document.getElementById('inp-date-semanal').disabled = bool;
        document.getElementById('select-meses').disabled = bool;
        document.getElementById('inp-ano-1').disabled = bool;
        document.getElementById('select-opcoes-graficos').disabled = bool;
    }

    opcaoRelatorio.addEventListener('change', function(){
        let index = opcaoRelatorio.selectedIndex + 1;
        if(index === 4){
            desabilitarCampos(true);
            document.getElementById('radio-anual').checked = true;
        } else {
            desabilitarCampos(false);
        }
    });

    btnGerarRelatorios.addEventListener("click", function(){
        document.querySelector('.container-refeicoes').innerHTML = '';
        let periodoSelecionado = document.querySelector('input[name="radio-periodos"]:checked');
        let selectOpcoesGrafico = document.getElementById('select-opcoes-graficos');
        let index = opcaoRelatorio.selectedIndex + 1;
        let opcoesGrafico = selectOpcoesGrafico.item(selectOpcoesGrafico.selectedIndex).text;
        let url = 'http://127.0.0.1:3000/relatorio/';

        if(index === 4){
            let ano = document.getElementById('inp-ano-2').value;
            url += `${index}/anual/${ano}`
            request(url, (data)=>{
                console.log(data);
                grafico("Linha", data);
            })
        } else {
            if(periodoSelecionado.value === "Semanal"){
                let inpDateSemanal = document.getElementById('inp-date-semanal');
                const [ano, mes, dia] = inpDateSemanal.value.split("-");
                url += `${index}/semanal/${ano}/${mes}/${dia}`;
                request(url, (data)=>{
                    console.log(data);
                    grafico(opcoesGrafico, data);
                });
            } else if(periodoSelecionado.value === "Mensal"){
                let selectMeses = document.getElementById('select-meses');
                let ano = document.getElementById('inp-ano-1').value;
                let mes = selectMeses.value;
                url += `${index}/mensal/${ano}/${mes}`;
                request(url, (data)=>{
                    console.log(data);
                    grafico(opcoesGrafico, data);
                });
            } else if(periodoSelecionado.value === "Anual"){
                let ano = document.getElementById('inp-ano-2').value;
                url += `${index}/anual/${ano}`;
                request(url, (data)=>{
                    console.log(data);
                    grafico(opcoesGrafico, data);
                });
            }
        }
        formVerRelatorios.style.display = 'none';
    })

    btnFecharRelatorios.addEventListener("click", function(){
        formVerRelatorios.style.display = "none";
    })

/* JANELA: ADICIONAR REGISTRO */

    let formAdicionarRegistros = document.getElementById("form-adicionar-registro");
    let btnAddRegistro = document.getElementById("btn-add-registro");
    
    btnAddRegistro.addEventListener("click", function(){
       formAdicionarRegistros.style.display = "block";
    })

    // BOTÕES DE ACIONAMENTO: JANELA - ADICIONAR REGISTRO
    let btnAddItem = document.getElementById("btn-add-item");
    let btnFecharCriarRegistro = document.getElementById("btn-fechar-criar-registros");
    let btnFecharAddEdtItem = document.getElementById("btn-fechar-add-edt-item");

    btnAddItem.addEventListener("click", function(){
        formAdicionarItem.style.display = "block";
    })

    btnFecharCriarRegistro.addEventListener("click", function(){
        limparCriarRegistros();
        desassociarEventos('.produto-consumo', 'oninput');
        desassociarEventos('[name="refeicao-nome"]', 'onblur');
        desassociarEventos('[name="refeicao-data"]', 'onblur');
        desassociarEventos('.btn-atualiza-item', 'onclick');
        desassociarEventos('.btn-remove-item', 'onclick');
        formAdicionarRegistros.style.display = "none";
    })

/* JANELA : CRIAR REGISTRO */

    let formAdicionarItem = document.getElementById("form-adicionar-item");

    btnFecharAddEdtItem.addEventListener("click", function(){
        formAdicionarItem.style.display = "none";
    })

export {
    request, 
    cardRefeicoes, 
    associarEventos, 
    visualizarRefeicao, 
    feedback, 
    limparCriarRegistros,
    inativarRefeicao
}
import { associarEventos } from "./Main";

let dadosApi = {};
let urlAPICodBarras = 'https://world.openfoodfacts.org/api/v2/product/[BAR-CODE]?product_type=food&fields=code%2Cproduct_name%2Cbrands%2Cquantity%2Cserving_size%2Cenergy-kcal_serving';
let urlAPINomeMarca = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=[SEARCH-TERMS]&page=1&page_size=10&fields=code,product_name,brands,quantity,serving_size,serving_quantity,serving_quantity_unit,energy-kcal_serving&sort_by=popularity&timestamp=${Date.now()}&json=true`;

let btnCodBarras = document.getElementById("btn-pesq-cod-barras");
let btnPesqProduto = document.getElementById("btn-pesq-produto");
let inpCodBarras = document.getElementById("inp-pesq-cod-barras");
let inpNomeProduto = document.getElementById("inp-nome-produto");
let inpMarcaProduto =  document.getElementById("inp-marca-produto");
let divProdutos = document.getElementById("div-produtos");

async function reqAPICodBarras(urlReq, value){
    try {
        divProdutos.innerHTML = 
            `<div class="w3-col w3-padding w3-center" id="div-produtos-loader">`
                + `<box-icon type="solid" color="#8c8c8c" name="hourglass" size="lg" style="text-align: ;"></box-icon>`
                + `<b style="display: block; color: #8c8c8c">Buscando itens, aguarde.</b>` +
            `</div>`
        let req = urlReq.replace("[BAR-CODE]", value);
        const resp = await fetch(req, {method: "GET"});

        if (!resp.ok) {
            throw new Error(`HTTP error: ${resp.status}`);
          }

        const data = await resp.json();
        return data;

    } catch (error) {
        console.error(`Não foi possível obter os produtos: ${error}`);
        window.alert(`Não foi possível obter os produtos: ${error}`);
    }
}

async function reqAPINomeMarca(urlReq, nome, marca) {
    try {
        divProdutos.innerHTML = 
            `<div class="w3-col w3-padding w3-center" id="div-produtos-loader">`
                + `<box-icon type="solid" color="#8c8c8c" name="hourglass" size="lg" style="text-align: ;"></box-icon>`
                + `<b style="display: block; color: #8c8c8c">Buscando itens, aguarde.</b>` +
            `</div>`
        
        let req = urlReq.replace("[SEARCH-TERMS]", `${nome}+${marca}`);
        
        const resp = await fetch(req, {method: "GET"});

        if (!resp.ok) {
            throw new Error(`HTTP error: ${resp.status}`);
          }

        const data = await resp.json();
        return data;

    } catch (error) {
        console.error(`Não foi possível obter os produtos: ${error}`);
        window.alert(`Não foi possível obter os produtos: ${error}`);
    }
}

btnCodBarras.addEventListener("click", function(){
    divProdutos.innerHTML = '';
    if(inpCodBarras.value.length >= 8){
        const promise = reqAPICodBarras(urlAPICodBarras, inpCodBarras.value);
        promise.then((data) => {
            divProdutos.innerHTML = '';
            inpCodBarras.value = '';
            exibeProdutos(data);
        });
    } else {
        window.alert(
            "O campo código de barras, " + 
            "deve estar preenchido de entre 8 a 13 dígitos");
    }
})

btnPesqProduto.addEventListener("click", function(){
    divProdutos.innerHTML = '';
    if(inpNomeProduto.value.length >= 3 && inpMarcaProduto.value.length >= 3){
        let inpNomeProdValue = inpNomeProduto.value.replaceAll(" ", "+");
        let inpMarcaProdValue = inpMarcaProduto.value.replaceAll(" ", "+");
        const promise = reqAPINomeMarca(urlAPINomeMarca, inpNomeProdValue, inpMarcaProdValue);
        promise.then((data) => {
            divProdutos.innerHTML = '';
            inpNomeProduto.value = '';
            inpMarcaProduto.value = '';
            exibeProdutos(data);
        });
    } else {
        window.alert("Os campos Nome e Marca devem ter no mínimo 3 caracteres.");
    }
})

function exibeProdutos(dataObject){
    let props = Object.getOwnPropertyNames(dataObject);
    let bool = props.includes("products");
    
    if(bool){
        let arrProdutos = Object.values(dataObject.products);
        for (let prod of arrProdutos) {
            Object.defineProperty(
                dadosApi, 
                prod["code"], {
                    value: prod,
                    writable: true,
                    enumerable: true,
                    configurable: false
                }
            )
            estruturaProdutos(
                prod["code"],
                prod["product_name"],
                prod["brands"],
                prod["energy-kcal_serving"],
                prod["serving_size"],
                prod["serving_quantity"],
                prod["serving_quantity_unit"],
                prod["quantity"]
             )
        }
    } else {
        let prod = dataObject.product;
        Object.defineProperty(
            dadosApi, 
            prod["code"], {
                value: prod,
                writable: true,
                enumerable: true,
                configurable: false
            }
        )
        estruturaProdutos(
            prod["code"],
            prod["product_name"],
            prod["brands"],
            prod["energy-kcal_serving"],
            prod["serving_size"],
            prod["serving_quantity"],
            prod["serving_quantity_unit"],
            prod["quantity"]
        )
    }
    associarEventos('.btn-selecionar', 'onclick', function(element){
        adicionaItem(element);
        associarEventos('.btn-remove-item', 'onclick', function(element){
            removerItem(element);
        });
        associarEventos('.produto-consumo', 'oninput', function(element){
            calculaCaloria(element);
        })
    });
}

function estruturaProdutos(code, productName, brands, energyKcalServing, servingSize, servingQuantity, servingQuantityUnit, quantity){
    divProdutos.innerHTML += ''
    + `<div class="w3-col w3-card w3-round-large w3-section">` 
        + `<div class="w3-col w3-padding-small">`
            + `<div class="w3-col"><b>${productName}</b></div>`
            + `<div class="w3-col w3-small">`
                + `<b>Cod. Bar: </b>`
                + `<span>${code}</span>`
            + `</div>`
            + `<div class="w3-col w3-small">`
                + `<b>Marca: </b>`
                + `<span>${brands}</span>`
            +  `</div>`
        + `</div>`
        + `<div class="w3-col w3-center">`
            + `<div class="w3-col w3-small w3-green">`
                + `<b>Info. Nutricionais</b>`
            + `</div>`
            + `<div class="w3-col w3-padding-small">`
                + `<div class="w3-col w3-tiny">`
                    + `<b>Qtd: </b>`
                    + `<span>${quantity}&nbsp;</span>`
                    + `<b>Porção: </b>`
                    + `<span>${servingSize}&nbsp;</span>`
                + `</div>`
                + `<div class="w3-col w3-tiny">`
                    + `<b>Porção (kcal): </b>`
                    + `<span>${energyKcalServing}&nbsp;</span>`
                + `</div>`
            +  `</div>`
        + `</div>`
        + `<div class="w3-col w3-padding-small">`
            + `<button id-produto='${code}' class="btn-selecionar w3-button w3-col w3-light-gray" type="button">`
                + `<b class="w3-small">Selecionar</b>`
            + `</button>`
        + `</div>`
    + `</div>`;
}

function adicionaItem(element){
    try {
        let itemId = element.getAttribute("id-produto");
        let produto = dadosApi[itemId];
        let ContainerItensRegistro = document.getElementById("container-itens-registro");
    
        ContainerItensRegistro.innerHTML += 
        `<div id="card-item-${itemId}" id-produto="${itemId}" class="w3-panel w3-padding-small w3-pale-green w3-round-large">`
            + `<div class="w3-col w3-padding-small">`
                + `<div class="w3-col s7">`
                    + `<b class="w3-small produto-nome">${produto["product_name"]}</b>`
                + `</div>`
                + `<div class="w3-col w3-right-align s5">`
                    + `<button id-produto="${itemId}" type="button" class="btn-remove-item w3-border-0 w3-padding-small w3-round-large w3-pale-red">`
                        + `<box-icon class="w3-cell-top" name='trash' type='solid' size="xs"></box-icon>`
                        + `<b class="w3-tiny w3-cell-middle">Remover</b>`
                    + `</button>`
                + `</div>`
            + `</div>`
            + `<div class="w3-col w3-center w3-padding-small">`
                + `<div class="w3-col w3-tiny">`
                    + `<div class="w3-show-inline-block w3-padding-small w3-margin-5 w3-round-large w3-pale-red">`
                        + `<b>Consumo (g): </b>`
                        + `<input id-produto="${itemId}" class="produto-consumo" step="0.1" type="number" min="0.1" value="${Number.parseFloat(produto["serving_size"])}" style="width: 70px;">`
                    + `</div>`
                + `</div>`
                + `<div class="w3-col w3-tiny">`
                    + `<div class="w3-show-inline-block w3-margin-5">`
                        + `<b>Porções consumidas: </b>`
                        + `<b class="w3-pale-red w3-padding-small w3-round-large produto-porcoes-consumidas" tag-id="porcoes-consumidas-${itemId}">1</b>`
                    + `</div>`
                    + `<div class="w3-show-inline-block w3-margin-5">`
                        + `<b>Porção padrão: </b>`
                        + `<span class="produto-porcao-padrao" tag-id="porcao-padrao-${itemId}">${produto["serving_size"]}</span>`
                    + `</div>`
                    + `<div class="w3-show-inline-block w3-margin-5">`
                        + `<b>Kcal consumida: </b>`
                        + `<b class="w3-pale-red w3-padding-small w3-round-large produto-kcal-consumida" tag-id="kcal-consumida-${itemId}">${produto["energy-kcal_serving"]}</b>`
                    + `</div>`
                    + `<div class="w3-show-inline-block w3-margin-5">`
                        + `<b>Kcal p/ porção: </b>`
                        + `<span class="produto-kcal-porcao" tag-id="kcal-porcao-${itemId}">${produto["energy-kcal_serving"]}</span>`
                    + `</div>`
                    + `<div class="w3-show-inline-block w3-margin-5">`
                        + `<b>Embalagem: </b>`
                        + `<span class="produto-embalagem">${produto["quantity"]}</span>`
                    + `</div>`
                + `</div>`
            + `</div>` +
        `</div>`;
        
        let formAdicionarItem = document.getElementById("form-adicionar-item");
        let tagTotalKcal = document.getElementById("criar-registro-total-kcal");

        formAdicionarItem.style.display = "none";
        divProdutos.innerHTML = "";
        let totalKcal = Number.parseFloat(tagTotalKcal.innerText);
        tagTotalKcal.innerText = totalKcal + produto["energy-kcal_serving"];
        dadosApi = {};
        window.alert("Item adicionado com sucesso!");
    } catch (error) {
        window.alert(error);
    }
}

function removerItem(element){
    let idProduto = element.getAttribute("id-produto");
    let cardItem = document.getElementById(`card-item-${idProduto}`);
    let tagTotalKcal = document.getElementById("criar-registro-total-kcal");
    let tagKcalConsumida = document.querySelector(`[tag-id='kcal-consumida-${idProduto}'`);
    if(document.getElementById("container-itens-registro").childElementCount > 1){
        tagTotalKcal.innerText = `${Number.parseFloat(tagTotalKcal.innerText) - Number.parseFloat(tagKcalConsumida.innerText)}`;
    } else {
        tagTotalKcal.innerText = "0";
    }
    cardItem.remove();
}

function calculaCaloria(element){
    let idProduto = element.getAttribute("id-produto");
    let tagPorcoesConsumidas = document.querySelector(`[tag-id='porcoes-consumidas-${idProduto}'`);
    let tagKcalPorcao = document.querySelector(`[tag-id='kcal-porcao-${idProduto}'`);
    let tagPorcaoPadrao = document.querySelector(`[tag-id='porcao-padrao-${idProduto}'`);
    let tagKcalConsumida = document.querySelector(`[tag-id='kcal-consumida-${idProduto}'`);
    let consumoCalorico = (Number.parseFloat(element.value) * Number.parseFloat(tagKcalPorcao.innerText)) / Number.parseFloat(tagPorcaoPadrao.innerText);
    let porcoesConsumidas = Number.parseFloat(element.value) / Number.parseFloat(tagPorcaoPadrao.innerText);
    let tagTotalKcal = document.getElementById("criar-registro-total-kcal");

    tagKcalConsumida.innerText = consumoCalorico.toFixed(2);
    tagPorcoesConsumidas.innerText = porcoesConsumidas.toFixed(2);

    if(document.getElementById("container-itens-registro").childElementCount > 1){
        let NodeListKcalConsumida = document.querySelectorAll("[tag-id*=kcal-consumida]");
        let calorias = 0;
        for (const element of NodeListKcalConsumida) {
            calorias += Number.parseFloat(element.innerText);
        }
        tagTotalKcal.innerText = calorias.toFixed(2);
    } else {
        tagTotalKcal.innerText = tagKcalConsumida.innerText;
    }
}

export {calculaCaloria, removerItem}
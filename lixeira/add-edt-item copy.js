
const urlAPICodBarras = 'https://world.openfoodfacts.net/api/v2/product/';
let urlAPINomeMarca = 'https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=[SEARCH-TERMS]&sort_by=unique_scans_n&page=1&page_size=10?sort_by=popularity&json=true';

// https://world.openfoodfacts.org/cgi/search.pl?search_terms=Batata+Lays&sort_by=unique_scans_n&page=1&page_size=8&fields=code,product_name,brands,quantity,serving_quantity,serving_quantity_unit,energy-kcal_serving&action=process&sort_by=popularity&json=true

let btnCodBarras = document.getElementById("btn-pesq-cod-barras");
let btnPesqProduto = document.getElementById("btn-pesq-produto");
let inpCodBarras = document.getElementById("inp-pesq-cod-barras");
let inpNomeProduto = document.getElementById("inp-nome-produto");
let inpMarcaProduto =  document.getElementById("inp-marca-produto");
let divProdutos = document.getElementById("div-produtos");

async function reqAPICodBarras(urlReq, value){
    try {
        let req = urlReq + value;
        const resp = await fetch(req, {"method": "GET"});

        if (!resp.ok) {
            throw new Error(`HTTP error: ${resp.status}`);
          }

        const data = await resp.json();
        return data;

    } catch (error) {
        console.error(`Não foi possível obter os produtos: ${error}`);
    }
}

async function reqAPINomeMarca(urlReq, nome, marca) {
    try {
        let req = urlReq.replace("[SEARCH-TERMS]", `${nome}+${marca}`);

        const resp = await fetch(req, {"method": "GET"});

        if (!resp.ok) {
            throw new Error(`HTTP error: ${resp.status}`);
          }

        const data = await resp.json();
        return data;

    } catch (error) {
        console.error(`Não foi possível obter os produtos: ${error}`);
    }
}

btnCodBarras.addEventListener("click", function(){
    divProdutos.innerHTML = '';
    if(inpCodBarras.value.length >= 8){
        const promise = reqAPICodBarras(urlAPICodBarras, inpCodBarras.value);
        promise.then((data) => {
           exibeProdutos(data);
           inpCodBarras.value = '';
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
        const promise = reqAPINomeMarca(urlAPINomeMarca, inpNomeProduto.value, inpMarcaProduto.value);
        promise.then((data) => {
           exibeProdutos(data);
           inpNomeProduto.value = '';
           inpMarcaProduto.value = '';
        });
    } else {
        window.alert("Os campos Nome e Marca devem ter no mínimo 3 caracteres.");
    }
})

function exibeProdutos(dataObject){
    let props = Object.getOwnPropertyNames(dataObject);
    let bool = props.includes("products");
    let strPattern1 = /energy-kcal_serving":\d*\.*\d*/;
    let strPattern2 = /energy-kcal_100g":\d*\.*\d*/;  

    function validarDados(data){
        let strDataObject, kcalServing, kcal100g; 
        strDataObject = JSON.stringify(data);
        if(strDataObject.match(strPattern1) === null){
            kcalServing = "???";
        } else {
            kcalServing = strDataObject.match(strPattern1)[0].split(":")[1];
        }
        if (strDataObject.match(strPattern2) === null) {
            kcal100g = "???";
        } else {
            kcal100g = strDataObject.match(strPattern2)[0].split(":")[1];
        }
        return [kcalServing, kcal100g];
    }

    if(bool){
        let arrProdutos = dataObject.products;
        for (let prod of arrProdutos) {
            let x = validarDados(prod.nutriments);
            estruturaProdutos(
                prod.product_name,
                prod.code,
                prod.brands,
                prod.serving_quantity,
                prod.serving_quantity_unit,
                x[0],
                x[1],
                prod.nutriments.energy_value,
                prod.nutriments.energy_unit
            )
        }
    } else {
        let produto = dataObject.product;
        let x = validarDados(produto.nutriments);
        
        estruturaProdutos(
            produto.product_name,
            produto.code,
            produto.brands,
            produto.serving_quantity,
            produto.serving_quantity_unit,
            x[0],
            x[1],
            produto.nutriments.energy_value,
            produto.nutriments.energy_unit
        )
    }
}

function estruturaProdutos(nomeProd, codBar, marcaProd, porcao, undPorcao, porcKcal, porc100g, valEnerg, undValEnerg){
    let obj = {
        nome: nomeProd, codBar: codBar,
        marca: marcaProd, porcao: porcao,
        undPorcao: undPorcao, porcKcal: porcKcal,
        porc100g: porc100g, valEnerg: valEnerg,
        undValEnerg: undValEnerg
    }
    divProdutos.innerHTML += ``
    + `<div class="w3-col w3-card w3-round-large w3-section">` 
        + `<div class="w3-col w3-padding-small">`
            + `<div class="w3-col"><b>${nomeProd}</b></div>`
            + `<div class="w3-col w3-small">`
                + `<b>Cod. Bar: </b>`
                + `<span>${codBar}</span>`
            + `</div>`
            + `<div class="w3-col w3-small">`
                + `<b>Marca: </b>`
                + `<span>${marcaProd}</span>`
            +  `</div>`
        + `</div>`
        + `<div class="w3-col w3-center">`
            + `<div class="w3-col w3-small w3-green">`
                + `<b>Info. Nutricionais</b>`
            + `</div>`
            + `<div class="w3-col w3-padding-small">`
                + `<div class="w3-col w3-tiny">`
                    + `<b>Porção: </b>`
                    + `<span>${porcao}&nbsp;</span>`
                    + `<b>Und. porção: </b>`
                    + `<span>${undPorcao}&nbsp;</span>`
                + `</div>`
                + `<div class="w3-col w3-tiny">`
                    + `<b>Porção (kcal): </b>`
                    + `<span>${porcKcal}&nbsp;</span>`
                    + `<b>Porção 100g (kcal): </b>`
                    + `<span>${porc100g}&nbsp;</span>`
                + `</div>`
                + `<div class="w3-col w3-tiny">`
                    + `<b>Val. energ: </b>`
                    + `<span>${valEnerg}&nbsp;</span>`
                    + `<b>Und. val. energ: </b>`
                    + `<span>${undValEnerg}&nbsp;</span>`
                + `</div>`
            +  `</div>`
        + `</div>`
        + `<div class="w3-col w3-padding-small">`
            + `<button class="w3-button w3-col w3-light-gray" type="button" onclick="add(event)">`
                + `<b class="w3-small">Selecionar</b>`
                + `<span class="product-json" style="display: none;">${JSON.stringify(obj)}</span>`
            + `</button>`
        + `</div>`
    + `</div>`;
}

function add(e){
    let btn = e.target;
    let tagIframeAddEdtItem = document.getElementById("iframe-add-edt-item").contentDocument;
    const json = btn.querySelector(".product-json").innerText;
    window.alert(json);
}
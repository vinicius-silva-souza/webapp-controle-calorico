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
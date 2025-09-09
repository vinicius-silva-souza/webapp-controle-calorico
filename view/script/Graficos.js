function graficoColuna(data){
    try{
        let canvas = document.getElementById('graficos');
        let dataRefeicao = [];
        let calorias = [];
        
        function createCanvas(){
            let el = document.createElement('canvas');
            el.setAttribute('id', 'graficos');
            canvas = document.querySelector('#graficos-container')
                .insertAdjacentElement('afterbegin', el);
            return canvas;
        }

        if(canvas === null){
            canvas = createCanvas();
        } else if (canvas instanceof HTMLCanvasElement){
            canvas.remove();
            canvas = createCanvas();
        } 

        if(data instanceof Array){
            data.forEach((element)=>{
                dataRefeicao.unshift(element.Data_Refeicao);
                calorias.unshift(element.Total_kcal);
            });
        }
        
        new Chart(canvas.getContext('2d'), {
            type: 'bar', // Tipo de gráfico: 'bar' para colunas
            data: {
                labels: dataRefeicao, // Rótulos do eixo X
                datasets: [{
                    label: 'Calorias', // Rótulo da série de dados
                    data: calorias, // Dados do eixo Y
                    backgroundColor: 'rgba(221 255 221,1)', // Cor de fundo das colunas
                    borderColor: 'rgba(152, 251, 152, 1)', // Cor da borda das colunas
                    borderWidth: 1 // Largura da borda
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true // Começa o eixo Y em zero
                    }
                }
            }
        });

        canvas = null;

    } catch(err){
        console.error(err.name + ": " + err.message);
    }
}

function graficoLinha(data){
    try{
        let canvas = document.getElementById('graficos');
        let dataRefeicao = [];
        let calorias = [];
        
        function createCanvas(){
            let el = document.createElement('canvas');
            el.setAttribute('id', 'graficos');
            canvas = document.querySelector('#graficos-container')
                .insertAdjacentElement('afterbegin', el);
            return canvas;
        }

        if(canvas === null){
            canvas = createCanvas();
        } else if (canvas instanceof HTMLCanvasElement){
            canvas.remove();
            canvas = createCanvas();
        } 

        if(data instanceof Array){
            data.forEach((element)=>{
                dataRefeicao.unshift(element.Data_Refeicao);
                calorias.unshift(element.Total_kcal);
            });
        }
        
        new Chart(canvas.getContext('2d'), {
            type: 'line', // Tipo de gráfico: 'bar' para colunas
            data: {
                labels: dataRefeicao, // Rótulos do eixo X
                datasets: [{
                    label: 'Calorias', // Rótulo da série de dados
                    data: calorias, // Dados do eixo Y
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo das colunas
                    borderColor: 'rgba(75, 192, 192, 1)', // Cor da borda das colunas
                    borderWidth: 1 // Largura da borda
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true // Começa o eixo Y em zero
                    }
                }
            }
        });

        canvas = null;

    } catch(err){
        console.error(err.name + ": " + err.message);
    }
}

function graficoBarra(data){
    try{
        let canvas = document.getElementById('graficos');
        let dataRefeicao = [];
        let calorias = [];
        
        function createCanvas(){
            let el = document.createElement('canvas');
            el.setAttribute('id', 'graficos');
            canvas = document.querySelector('#graficos-container')
                .insertAdjacentElement('afterbegin', el);
            return canvas;
        }

        if(canvas === null){
            canvas = createCanvas();
        } else if (canvas instanceof HTMLCanvasElement){
            canvas.remove();
            canvas = createCanvas();
        } 

        if(data instanceof Array){
            data.forEach((element)=>{
                dataRefeicao.unshift(element.Data_Refeicao);
                calorias.unshift(element.Total_kcal);
            });
        }
        
        new Chart(canvas.getContext('2d'), {
            type: 'bar', // Tipo de gráfico: 'bar' para colunas
            data: {
                labels: dataRefeicao, // Rótulos do eixo X
                datasets: [{
                    label: 'Calorias', // Rótulo da série de dados
                    data: calorias, // Dados do eixo Y
                    backgroundColor: 'rgba(221 255 221,1)', // Cor de fundo das colunas
                    borderColor: 'rgba(152, 251, 152, 1)', // Cor da borda das colunas
                    borderWidth: 1 // Largura da borda
                }]
            },
            options: {
                indexAxis: 'y', // Define o eixo X como o eixo horizontal
                scales: {
                    x: {
                        beginAtZero: true // Começar o eixo X em zero
                    }
                },
                responsive: true, // Tornar o gráfico responsivo
                plugins: {
                    legend: {
                        position: 'top', // Posição da legenda
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw; // Formatação do tooltip
                            }
                        }
                    }
                }
            }
        });

        canvas = null;

    } catch(err){
        console.error(err.name + ": " + err.message);
    }
}

function graficoPizza(data){
    try{
        let canvas = document.getElementById('graficos');
        let dataRefeicao = [];
        let calorias = [];
        
        function createCanvas(){
            let el = document.createElement('canvas');
            el.setAttribute('id', 'graficos');
            canvas = document.querySelector('#graficos-container')
                .insertAdjacentElement('afterbegin', el);
            return canvas;
        }

        if(canvas === null){
            canvas = createCanvas();
        } else if (canvas instanceof HTMLCanvasElement){
            canvas.remove();
            canvas = createCanvas();
        } 

        if(data instanceof Array){
            data.forEach((element)=>{
                dataRefeicao.unshift(element.Data_Refeicao);
                calorias.unshift(element.Total_kcal);
            });
        }
        
        new Chart(canvas.getContext('2d'), {
            type: 'pie', // Tipo de gráfico: 'bar' para colunas
            data: {
                labels: dataRefeicao, // Rótulos do eixo X
                datasets: [{
                    label: 'Calorias', // Rótulo da série de dados
                    data: calorias, // Dados do eixo Y
                    backgroundColor: [ // Cores das fatias
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [ // Cor da borda das fatias
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1 // Largura da borda
                }]
            },
            options: {
                responsive: true, // Tornar o gráfico responsivo
                plugins: {
                    legend: {
                        position: 'top', // Posição da legenda
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw; // Formatação do tooltip
                            }
                        }
                    }
                }
            }
        });

        canvas = null;

    } catch(err){
        console.error(err.name + ": " + err.message);
    }
}

function graficoRosca(data){
    try{
        let canvas = document.getElementById('graficos');
        let dataRefeicao = [];
        let calorias = [];
        
        function createCanvas(){
            let el = document.createElement('canvas');
            el.setAttribute('id', 'graficos');
            canvas = document.querySelector('#graficos-container')
                .insertAdjacentElement('afterbegin', el);
            return canvas;
        }

        if(canvas === null){
            canvas = createCanvas();
        } else if (canvas instanceof HTMLCanvasElement){
            canvas.remove();
            canvas = createCanvas();
        } 

        if(data instanceof Array){
            data.forEach((element)=>{
                dataRefeicao.unshift(element.Data_Refeicao);
                calorias.unshift(element.Total_kcal);
            });
        }
        
        new Chart(canvas.getContext('2d'), {
            type: 'doughnut', // Tipo de gráfico: 'bar' para colunas
            data: {
                labels: dataRefeicao, // Rótulos do eixo X
                datasets: [{
                    label: 'Calorias', // Rótulo da série de dados
                    data: calorias, // Dados do eixo Y
                    backgroundColor: [ // Cores das fatias
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [ // Cor da borda das fatias
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1 // Largura da borda
                }]
            },
            options: {
                responsive: true, // Tornar o gráfico responsivo
                plugins: {
                    legend: {
                        position: 'top', // Posição da legenda
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw; // Formatação do tooltip
                            }
                        }
                    }
                }
            }
        });

        canvas = null;

    } catch(err){
        console.error(err.name + ": " + err.message);
    }
}

function grafico(tipo, data){
    try {
        if(typeof 'string'){
            switch(tipo){
                case "Coluna":
                    graficoColuna(data);
                    break;
                case "Barra":
                    graficoBarra(data);
                    break;
                case "Pizza":
                    graficoPizza(data);
                    break;
                case "Rosca":
                    graficoRosca(data);
                    break;
                case "Linha":
                    graficoLinha(data);
                    break;
                default:
                    throw new TypeError(`O argumento "${tipo}" não é válido`);
            }
        } else {
            throw new TypeError('Era esperado o tipo "string" para o parâmetro tipo');
        }
    } catch (err) {
        console.error(err.name + ": " + err.message);
    }
}

function ocultarGrafico(){
    let canvas = document.querySelector('canvas#graficos');
    if(canvas !== null && canvas instanceof HTMLCanvasElement){
        canvas.remove();
    }
}

export {grafico, ocultarGrafico}
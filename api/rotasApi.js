'use strict'

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./api/sqlite_database.db');
const Hapi = require('@hapi/hapi');

let obterDados = (sqlString, parametros)=>{
    //https://stackoverflow.com/questions/55532702/hapi-handler-method-is-not-returning-a-value
    let promise = new Promise((resolve, reject)=>{
        db.all(sqlString, parametros, (err, rows)=>{
            if(err){
                let msgErro = "".concat(
                    `Erro ao executar a consulta:" + ${err.message}`,
                    `Código do erro:" ${err.code}`
                );
                return reject(msgErro); 
            }
            return resolve(rows);
        })
    })
    return promise;
}

let atualizarDados = function(sql, parametros){
    let promise = new Promise((resolve, reject)=>{
        db.serialize(()=>{
            db.run('BEGIN TRANSACTION;');
            db.run(sql, parametros, (err)=>{
                if(err){
                    let msgErro = "".concat(
                        `Mensagem: ${err.message}, `,
                        `Código do erro: ${err.code}, `,
                        `Consulta SQL: ${sql}, `,
                        `Stack: ${err.stack}, `,
                        `Errno: ${err.errno}`
                    );
                    db.run('ROLLBACK;', (err)=>{
                        if(err){
                            let msgErro = "".concat(
                               `Mensagem: ${err.message}, `,
                                `Código do erro: ${err.code}, `,
                                `Consulta SQL: ROLLBACK de ${sql}, `,
                                `Stack: ${err.stack}, `,
                                `Errno: ${err.errno}`
                            );
                            return reject(msgErro); 
                        }
                    });
                    return reject(msgErro); 
                }
                db.run('COMMIT;', (err)=>{
                    if(err){
                        let msgErro = "".concat(
                        `Mensagem: ${err.message}, `,
                            `Código do erro: ${err.code}, `,
                            `Consulta SQL: COMMIT, `,
                            `Stack: ${err.stack}, `,
                            `Errno: ${err.errno}`
                        );
                        db.run('ROLLBACK;', (err)=>{
                            if(err){
                                let msgErro = "".concat(
                                    `Mensagem: ${err.message}, `,
                                    `Código do erro: ${err.code}, `,
                                    `Consulta SQL: ROLLBACK do COMMIT, `,
                                    `Stack: ${err.stack}, `,
                                    `Errno: ${err.errno}`
                                );
                                return reject(msgErro); 
                            }
                        });
                        return reject(msgErro); 
                    }
                    return resolve();
                });
            });
        });
    });
    return promise;
}

let insertTblRefeicao = function(data){
    let promise = new Promise((resolve, reject)=>{
        let parametrosRefeicao = [
            data["Cod_Usuario"], 
            data["Nome_Refeicao"],
            data["Data_Refeicao"], 
            data["Hora"],
            data["Total_kcal"], 
            data["Refeicao_Inativa"],
            data["Qtd_Alimentos"], 
            data["Alimentos_Na_Refeicao"]
        ];
        let parametrosAlimento = data["Alimentos"];
        let insertRefeicao = 'INSERT INTO TBL_Refeicao '.concat(
            '("Cod_Usuario", "Nome_Refeicao", "Data_Refeicao",',
            '"Hora", "Total_kcal", "Refeicao_Inativa",',
            '"Qtd_Alimentos", "Alimentos_Na_Refeicao") ',
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        let sequencia = "SELECT Cod_Refeicao ".concat(
            "FROM 'TBL_Refeicao'",
            "ORDER BY Cod_Refeicao DESC LIMIT 1"
        );
        let insertAlimento = 'INSERT INTO TBL_Alimento '.concat(
            '("Cod_Barras", "Cod_Refeicao", "Nome_Alimento", ',
            '"Consumo", "Porcoes_Consumidas", "Porcao_Padrao", ',
            '"Kcal_Consumidas", "Kcal_Por_Porcao", "Qtd_Embalagam", "Alimento_Inativo") ',
            `VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
        );

        db.serialize(()=>{
            db.run('BEGIN TRANSACTION');
            db.run(insertRefeicao, parametrosRefeicao, (err)=>{
                if(err){
                    let msgErro = "".concat(
                        `Mensagem: ${err.message}, `,
                        `Código do erro: ${err.code}, `,
                        `Consulta SQL: ${insertRefeicao}, `,
                        `Stack: ${err.stack}, `,
                        `Errno: ${err.errno}`
                    );
                    db.run('ROLLBACK', (err)=>{
                        if(err){
                            let msgErro = "".concat(
                               `Mensagem: ${err.message}, `,
                                `Código do erro: ${err.code}, `,
                                `Consulta SQL: ROLLBACK de ${insertRefeicao}, `,
                                `Stack: ${err.stack}, `,
                                `Errno: ${err.errno}`
                            );
                            return reject(msgErro); 
                        }
                    });
                    return reject(msgErro); 
                }
            });
            db.get(sequencia, (err, row)=>{
                if(err){
                    let msgErro = "".concat(
                        `Mensagem: ${err.message}, `,
                        `Código do erro: ${err.code}, `,
                        `Consulta SQL: ${sequencia}, `,
                        `Stack: ${err.stack}, `,
                        `Errno: ${err.errno}`
                    );
                    db.run('ROLLBACK', (err)=>{
                        if(err){
                            let msgErro = "".concat(
                                `Mensagem: ${err.message}, `,
                                `Código do erro: ${err.code}, `,
                                `Consulta SQL: ROLLBACK de ${sequencia}, `,
                                `Stack: ${err.stack}, `,
                                `Errno: ${err.errno}`
                            );
                            return reject(msgErro); 
                        }
                    });
                    return reject(msgErro); 
                }
                
                let codRefeicao = Number.parseInt(row.Cod_Refeicao);
                for(const alimento of parametrosAlimento){
                    alimento.Cod_Refeicao = codRefeicao;
                    db.run(
                        insertAlimento, 
                        [
                            alimento["Cod_Barras"],
                            alimento["Cod_Refeicao"],
                            alimento["Nome_Alimento"],
                            alimento["Consumo"],
                            alimento["Porcoes_Consumidas"],
                            alimento["Porcao_Padrao"],
                            alimento["Kcal_Consumidas"],
                            alimento["Kcal_Por_Porcao"],
                            alimento["Qtd_Embalagem"]
                        ],
                        (err)=>{
                            if(err){
                                let msgErro = "".concat(
                                    `Mensagem: ${err.message}, `,
                                    `Código do erro: ${err.code}, `,
                                    `Consulta SQL: ${insertAlimento}, `,
                                    `Stack: ${err.stack}, `,
                                    `Errno: ${err.errno}`
                                );
                                db.run('ROLLBACK', (err)=>{
                                    if(err){
                                        let msgErro = "".concat(
                                            `Mensagem: ${err.message}, `,
                                            `Código do erro: ${err.code}, `,
                                            `Consulta SQL: ROLLBACK de ${insertAlimento}, `,
                                            `Stack: ${err.stack}, `,
                                            `Errno: ${err.errno}`
                                        );
                                        return reject(msgErro); 
                                    }
                                });
                                return reject(msgErro); 
                            }
                        }
                    );
                }
            })
            
            db.run('COMMIT', (err)=>{
                if(err){
                    let msgErro = "".concat(
                       `Mensagem: ${err.message}, `,
                        `Código do erro: ${err.code}, `,
                        `Consulta SQL: COMMIT, `,
                        `Stack: ${err.stack}, `,
                        `Errno: ${err.errno}`
                    );
                    db.run('ROLLBACK', (err)=>{
                        if(err){
                            let msgErro = "".concat(
                                `Mensagem: ${err.message}, `,
                                `Código do erro: ${err.code}, `,
                                `Consulta SQL: ROLLBACK do COMMIT, `,
                                `Stack: ${err.stack}, `,
                                `Errno: ${err.errno}`
                            );
                            return reject(msgErro); 
                        }
                    });
                    return reject(msgErro); 
                } else {
                    resolve();
                }
            });
        });
    });
    return promise;
}

function relatorios(cod, periodo){
    try {
        let dataSemanal = 'BETWEEN date(?) AND date(?, "+6 days")';
        let dataMensal = 'BETWEEN date(?) AND date(?, "+1 months", "-1 days")';
        let dataAnual =  'BETWEEN date(?) AND date(?)';
        let objRelatorios = {
            rel1: function(periodo){
                // (1) Consumo calórico por data
                return 'SELECT Data_Refeicao, '.concat(
                    'count(Data_Refeicao) AS "Num_Refeicoes", ',
                    'sum(Total_kcal) AS "Total_kcal" ',
                    'FROM TBL_Refeicao ',
                    'WHERE Data_Refeicao ',
                    `${periodo} `,
                    'GROUP BY Data_Refeicao ',
                    'ORDER BY Total_kcal DESC'
                );
            },
            rel2: function(periodo){
                // (2) Refeições com maior quantidade de caloria (agrupado por data)
                return 'SELECT Nome_Refeicao, '.concat(
                    'Data_Refeicao, ',
                    'Hora, ',
                    'max(Total_kcal) AS "Total_kcal" ',
                    'FROM TBL_Refeicao ',
                    'WHERE Data_Refeicao ',
                    `${periodo} `,
                    'GROUP BY Data_Refeicao ',
                    'ORDER BY Total_kcal DESC'
                );
            },
            rel3: function(periodo){
                // (3) Refeições com menor quantidade de caloria (agrupado por data)
                return 'SELECT Nome_Refeicao, '.concat(
                    'Data_Refeicao, ',
                    'Hora, ',
                    'min(Total_kcal) AS "Total_kcal" ',
                    'FROM TBL_Refeicao ',
                    'WHERE Data_Refeicao ',
                    `${periodo} `,
                    'GROUP BY Data_Refeicao ',
                    'ORDER BY Total_kcal ASC'
                );
            },
            rel4: function(periodo){
                // (4) Evolução calórica
                return 'SELECT Data_Refeicao, '.concat(
                    'count(Data_Refeicao) AS "Num_Refeicoes", ',
                    'sum(Total_kcal) AS "Total_kcal" ',
                    'FROM TBL_Refeicao ',
                    'WHERE Data_Refeicao ',
                    `${periodo} `,
                    'GROUP BY Data_Refeicao ',
                    'ORDER BY Hora ASC'
                );
            }
        }
    
        if(typeof cod === 'number'){
            if(typeof periodo === 'string'){
                let index = `rel${cod}`;
                let relatorio = objRelatorios[index];
                switch (periodo) {
                    case "semanal":
                        return relatorio(dataSemanal);
                    case "mensal":
                        return relatorio(dataMensal);
                    case "anual":
                        return relatorio(dataAnual);
                    default: 
                        throw new TypeError("Código de relatório não encontrado");
                }
            } else {
                throw new TypeError('O argumento fornecido ao parâmetro "periodo" não é do tipo "string"');
            }
        } else {
            throw new TypeError('O argumento fornecido ao parâmetro "cod" não é do tipo "number"');
        }
    } catch (err) {
        console.error(err.name + ": " + err.message);
        return null;
    }
}

async function iniciaServidor(){
    const server = new Hapi.Server({
        address: '127.0.0.1',
        host: 'localhost',
        port: '3000'
    });
    // https://stackoverflow.com/questions/48375126/typeerror-server-connection-is-not-a-function-in-hapi-nodejs
    console.log(server.info);

    /* server.ext('onPreResponse', (request, h) => {
        const response = request.response;

        // Adiciona cabeçalhos CORS se a resposta não for um erro
        if (response.isBoom) {
            return h.continue; // Se for um erro, não adiciona os cabeçalhos
        }

        // Adiciona os cabeçalhos CORS
        response.headers['Access-Control-Allow-Origin'] = '*'; // Ou especifique a origem
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'; // Métodos permitidos
        response.headers['Access-Control-Allow-Headers'] = 'Accept, Content-Type, Authorization'; // Cabeçalhos permitidos

        return h.continue;
    });
 */
    server.route({
        method: "GET",
        path: "/",
        handler: function(request, reply){
            //https://hapi.dev/api/?v=21.4.0#response-toolkit
            console.log(request);
            console.log(reply);
            const resp = reply.response('OK');
            resp.code(200);
            resp.type('text/plain');
            // https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/MIME_types
            return resp;
        }
    });

    server.route({
        method: 'GET',
        path: '/refeicoes/usuario/{codUsuario}',
        handler: function(request, reply){
            //https://hapi.dev/tutorials/routing/?lang=pt_BR
            let codUsuario = encodeURIComponent(request.params.codUsuario); 
            let sql = ""  
                + "SELECT "
                    + "TBL_Refeicao.Cod_Refeicao,"
                    + "TBL_Refeicao.Nome_Refeicao,"
                    + "TBL_Refeicao.Data_Refeicao,"
                    + "TBL_Refeicao.Hora,"
                    + "TBL_Refeicao.Total_kcal,"
                    + "TBL_Refeicao.Qtd_Alimentos,"
                    + "TBL_Refeicao.Alimentos_Na_Refeicao "
                + "FROM TBL_Refeicao "
                + "WHERE "
                    + "TBL_Refeicao.Cod_Usuario = ? AND "
                    + "TBL_Refeicao.Refeicao_Inativa = 0 "
                + "ORDER BY TBL_Refeicao.Data_Refeicao DESC LIMIT 5"  
            return obterDados(sql, [codUsuario]).then(
                dados =>{
                    let resp = reply.response(dados);
                    resp.code(200);
                    resp.type('application/json');
                    return resp;
                }, 
                msgErro =>{
                    let resp = reply.response(msgErro);
                    resp.code(204);
                    resp.type('text/plain');
                    return resp;
                }
            );
        }
    });

    server.route({
        method: 'GET',
        options: {cors: {origin: ['*']}},
        path: "/refeicoes/usuario/{codUsuario}/{refeicaoInativa}/periodo/{dataInicial}/{dataFinal}",
        handler: function(request, reply){
            let codUsuario = encodeURIComponent(request.params.codUsuario);
            let refeicaoInativa = encodeURIComponent(request.params.refeicaoInativa);
            let dataInicial = encodeURIComponent(request.params.dataInicial);
            let dataFinal = encodeURIComponent(request.params.dataFinal);
            let sql = "SELECT ".concat(
                "TBL_Refeicao.Cod_Refeicao, ",
                "TBL_Refeicao.Nome_Refeicao, ",
                "TBL_Refeicao.Data_Refeicao, ",
                "TBL_Refeicao.Hora, ",
                "TBL_Refeicao.Total_kcal, ",
                "TBL_Refeicao.Qtd_Alimentos, ",
                "TBL_Refeicao.Alimentos_Na_Refeicao ",
                "FROM TBL_Refeicao ",
                "WHERE TBL_Refeicao.Cod_Usuario = ? AND ",
                "TBL_Refeicao.Refeicao_Inativa = ? AND ",
                "TBL_Refeicao.Data_Refeicao BETWEEN ? AND ?"
            );
            return obterDados(sql, [codUsuario, refeicaoInativa, dataInicial, dataFinal]).then(
                dados =>{
                    let resp = reply.response(dados);
                    resp.code(200);
                    resp.type('application/json');
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    resp.code(204);
                    resp.type('text/plain');
                    return resp;
                }
            );
        }
    });

    server.route({
        method: 'GET',
        path: "/refeicoes/usuario/{codUsuario}/hoje",
        options: {cors: {origin: ['*']}},
        handler: function(request, reply){
            let codUsuario = encodeURIComponent(request.params.codUsuario);
            let sql = "SELECT ".concat(
                "TBL_Refeicao.Cod_Refeicao,",
                "TBL_Refeicao.Nome_Refeicao,",
                "TBL_Refeicao.Data_Refeicao, ",
                "TBL_Refeicao.Hora,",
                "TBL_Refeicao.Total_kcal,",
                "TBL_Refeicao.Qtd_Alimentos,",
                "TBL_Refeicao.Alimentos_Na_Refeicao ",
                "FROM TBL_Refeicao ",
                "WHERE TBL_Refeicao.Cod_Usuario = ? AND ",
                "TBL_Refeicao.Refeicao_Inativa = 0 AND ",
                "TBL_Refeicao.Data_Refeicao = date('now', 'localtime') ", 
                "ORDER BY TBL_Refeicao.Cod_Refeicao DESC"
            );
            return obterDados(sql, [codUsuario]).then(
                dados =>{
                    let resp = reply.response(dados);
                    resp.code(200);
                    resp.type('application/json');
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    resp.code(204);
                    resp.type('text/plain');
                    return resp;
                }
            );
        }
    });

    server.route({
        method: 'GET', 
        path: '/refeicao/{codRefeicao}',
        options: {cors: {origin: ['*']}},
        handler: function(request, reply){
           let codRefeicao = encodeURIComponent(request.params.codRefeicao); 
           let sql = "".concat(
                "SELECT TBL_Refeicao.Cod_Refeicao, ",
                "TBL_Refeicao.Nome_Refeicao, ",
                "TBL_Refeicao.Data_Refeicao, ",
                "TBL_Refeicao.Hora, ",
                "TBL_Refeicao.Total_kcal ",
                "FROM TBL_Refeicao ",
                "WHERE TBL_Refeicao.Cod_Refeicao = ? AND ",
                "TBL_Refeicao.Refeicao_Inativa = 0"
           );
            return obterDados(sql, [codRefeicao]).then(
                dados =>{
                    let resp = reply.response(dados);
                    resp.code(200);
                    resp.type('application/json');
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    resp.code(204);
                    resp.type('text/plain');
                    return resp;
                }
            )
        }
    });

    server.route({
        method: 'GET', 
        path: '/alimentos/{codRefeicao}',
        options: {cors: {origin: ['*']}},
        handler: function(request, reply){
           let codRefeicao = encodeURIComponent(request.params.codRefeicao); 
           let sql = "".concat(
                "SELECT TBL_Alimento.Cod_Barras, ",
                "TBL_Alimento.Cod_Alimento, ",
                "TBL_Alimento.Cod_Refeicao, ",
                "TBL_Alimento.Nome_Alimento, ",
                "TBL_Alimento.Consumo, ",
                "TBL_Alimento.Porcoes_Consumidas, ",
                "TBL_Alimento.Porcao_Padrao, ",
                "TBL_Alimento.Kcal_Consumidas, ",
                "TBL_Alimento.Kcal_Por_Porcao, ",
                "TBL_Alimento.Qtd_Embalagam ",
                "FROM TBL_Alimento ",
                "WHERE TBL_Alimento.Cod_Refeicao = ? AND ",
                "TBL_Alimento.Alimento_Inativo = 0"
           );
            return obterDados(sql, [codRefeicao]).then(
                dados =>{
                    let resp = reply.response(dados);
                    resp.code(200);
                    resp.type('application/json');
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    resp.code(204);
                    resp.type('text/plain');
                    return resp;
                }
            )
        }
    });

    server.route({
        method: 'POST',
        path: '/refeicoes/criar',
        options: {
            cors: {
                origin: ['*'], // Permite todas as origens. Para produção, especifique as origens permitidas.
                credentials: true, // Se você precisar enviar cookies ou cabeçalhos de autenticação.
                headers: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'], // Cabeçalhos permitidos
                exposedHeaders: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'] // Cabeçalhos que você deseja expor
            }
        },
        handler: function(request, reply){
            let jsonReq = JSON.parse(request.payload);
            return insertTblRefeicao(jsonReq).then(
                ()=>{
                    let resp = reply.response('Created');
                    resp.code(201);
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    console.log(msgErro);
                    resp.code(204);
                    resp.type('text/plain');
                    return resp;
                }
            ).catch(
                msgErro => { // Use catch para capturar erros
                    let resp = reply.response(msgErro);
                    console.error("Erro:", msgErro); // Log do erro
                    resp.code(204);
                    resp.type('text/plain');
                    return resp;
                }
            );
        }
    });

    // Rota para o método OPTIONS
    server.route({
        method: 'OPTIONS',
        path: '/refeicoes/criar',
        options: {
            cors: {
                origin: ['*'], // Permite todas as origens. Para produção, especifique as origens permitidas.
                credentials: true, // Se você precisar enviar cookies ou cabeçalhos de autenticação.
                headers: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'], // Cabeçalhos permitidos
                exposedHeaders: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'] // Cabeçalhos que você deseja expor
            }
        },
        handler: (request, reply) => {
            return reply.response().code(204); // Retorna um status 204 No Content
        }
    });

    server.route({
        method: 'PATCH',
        path: '/refeicao/{codRefeicao}/atualizarNome',
        options: {
            cors: {
                origin: ['*'], // Permite todas as origens. Para produção, especifique as origens permitidas.
                credentials: true, // Se você precisar enviar cookies ou cabeçalhos de autenticação.
                headers: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'], // Cabeçalhos permitidos
                exposedHeaders: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'] // Cabeçalhos que você deseja expor
            }
        },
        handler: function(request, reply){
            let codRefeicao = encodeURIComponent(request.params.codRefeicao);
            let data =  request.payload;
            let sql = "UPDATE TBL_Refeicao ".concat(
                "SET Nome_Refeicao = ? ",
                "WHERE Cod_Refeicao = ?"
            );
            return atualizarDados(sql, [data.Nome_Refeicao, codRefeicao]).then(
                ()=>{
                    let resp = reply.response('No Content');
                    resp.type('text/plain');
                    resp.code(204);
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    console.log(msgErro);
                    resp.code(400);
                    resp.type('text/plain');
                    return resp;
                }
            ).catch(
                msgErro => { 
                    let resp = reply.response(msgErro);
                    console.error('Erro: ', msgErro); 
                    resp.code(500);
                    resp.type('text/plain');
                    return resp;
                }
            );
        }
    });

    server.route({
        method: 'PATCH',
        path: '/refeicao/{codRefeicao}/atualizarDataHora',
        options: {
            cors: {
                origin: ['*'], // Permite todas as origens. Para produção, especifique as origens permitidas.
                credentials: true, // Se você precisar enviar cookies ou cabeçalhos de autenticação.
                headers: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'], // Cabeçalhos permitidos
                exposedHeaders: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'] // Cabeçalhos que você deseja expor
            }
        },
        handler: function(request, reply){
            let codRefeicao = encodeURIComponent(request.params.codRefeicao);
            let data =  request.payload;
            let sql = "UPDATE TBL_Refeicao ".concat(
                "SET Data_Refeicao = ? ,",
                "Hora = ? ",
                "WHERE Cod_Refeicao = ?"
            );
            let parametros = [
                data.Data_Refeicao, 
                data.Hora, 
                codRefeicao
            ];
            return atualizarDados(sql, parametros).then(
                ()=>{
                    let resp = reply.response('No Content');
                    resp.type('text/plain');
                    resp.code(204);
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    console.log(msgErro);
                    resp.code(400);
                    resp.type('text/plain');
                    return resp;
                }
            ).catch(
                msgErro => { 
                    let resp = reply.response(msgErro);
                    console.error('Erro: ', msgErro); 
                    resp.code(500);
                    resp.type('text/plain');
                    return resp;
                }
            );
        }
    });

    server.route({
        method: 'PATCH',
        path: '/refeicao/{codRefeicao}/alimento/{codAlimento}/atualizar',
        options: {
            cors: {
                origin: ['*'], // Permite todas as origens. Para produção, especifique as origens permitidas.
                credentials: true, // Se você precisar enviar cookies ou cabeçalhos de autenticação.
                headers: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'], // Cabeçalhos permitidos
                exposedHeaders: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'] // Cabeçalhos que você deseja expor
            }
        },
        handler: function(request, reply){
            let codRefeicao = encodeURIComponent(request.params.codRefeicao);
            let codAlimento = encodeURIComponent(request.params.codAlimento)
            let alimento =  request.payload.alimento;
            let refeicao = request.payload.refeicao;
            let sqlAlimento = "UPDATE TBL_Alimento ".concat(
                "SET Consumo = ?, ",
                "Porcoes_Consumidas =  ?, ",
                "Kcal_Consumidas = ? ",
                "WHERE Cod_Alimento = ?;"
            );
            let sqlRefeicao = "UPDATE TBL_Refeicao ".concat(
                "SET Total_kcal = ? ",
                "WHERE Cod_Refeicao = ?"
            );
            let parametrosAlimento = [
                alimento.Consumo,
                alimento.Porcoes_Consumidas,
                alimento.Kcal_Consumidas,
                codAlimento
            ];
            let parametrosRefeicao = [
                refeicao.Total_kcal,
                codRefeicao
            ];
            return atualizarDados(sqlAlimento, parametrosAlimento)
            .then(()=>{
                return atualizarDados(sqlRefeicao, parametrosRefeicao)
                .then(()=>{
                    let resp = reply.response('No Content');
                    resp.type('text/plain');
                    resp.code(204);
                    return resp;
                }, msgErro => {
                    let resp = reply.response(msgErro);
                    console.log(msgErro);
                    resp.code(400);
                    resp.type('text/plain');
                    return resp;
                })
                .catch(msgErro => { 
                    let resp = reply.response(msgErro);
                    console.error('Erro: ', msgErro); 
                    resp.code(500);
                    resp.type('text/plain');
                    return resp;
                });
            }, msgErro => {
                let resp = reply.response(msgErro);
                console.log(msgErro);
                resp.code(400);
                resp.type('text/plain');
                return resp;
            })
            .catch(msgErro => { 
                let resp = reply.response(msgErro);
                console.error('Erro: ', msgErro); 
                resp.code(500);
                resp.type('text/plain');
                return resp;
            });
        }
    });

    server.route({
        method: 'PATCH',
        path: '/alimento/{codAlimento}/inativar',
        options: {
            cors: {
                origin: ['*'], // Permite todas as origens. Para produção, especifique as origens permitidas.
                credentials: true, // Se você precisar enviar cookies ou cabeçalhos de autenticação.
                headers: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'], // Cabeçalhos permitidos
                exposedHeaders: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'] // Cabeçalhos que você deseja expor
            }
        },
        handler: function(request, reply){
            let codAlimento = encodeURIComponent(request.params.codAlimento);
            let sql = "UPDATE TBL_Alimento ".concat(
                "SET Alimento_Inativo = 1 ",
                "WHERE Cod_Alimento = ?"
            );
            return atualizarDados(sql, codAlimento).then(
                ()=>{
                    let resp = reply.response('No Content');
                    resp.type('text/plain');
                    resp.code(204);
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    console.log(msgErro);
                    resp.code(400);
                    resp.type('text/plain');
                    return resp;
                }
            ).catch(
                msgErro => { 
                    let resp = reply.response(msgErro);
                    console.error('Erro: ', msgErro); 
                    resp.code(500);
                    resp.type('text/plain');
                    return resp;
                }
            );
        }
    });

    server.route({
        method: 'PATCH',
        path: '/refeicao/{codRefeicao}/inativar',
        options: {
            cors: {
                origin: ['*'], // Permite todas as origens. Para produção, especifique as origens permitidas.
                credentials: true, // Se você precisar enviar cookies ou cabeçalhos de autenticação.
                headers: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'], // Cabeçalhos permitidos
                exposedHeaders: ['Accept', 'Content-Type', 'Authorization', 'Cache-Control'] // Cabeçalhos que você deseja expor
            }
        },
        handler: function(request, reply){
            let codRefeicao = encodeURIComponent(request.params.codRefeicao);
            let sql = "UPDATE TBL_Refeicao ".concat(
                "SET Refeicao_Inativa = 1 ",
                "WHERE Cod_Refeicao = ?"
            );
            return atualizarDados(sql, codRefeicao).then(
                ()=>{
                    let resp = reply.response('No Content');
                    resp.type('text/plain');
                    resp.code(204);
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    console.log(msgErro);
                    resp.code(400);
                    resp.type('text/plain');
                    return resp;
                }
            ).catch(
                msgErro => { 
                    let resp = reply.response(msgErro);
                    console.error('Erro: ', msgErro); 
                    resp.code(500);
                    resp.type('text/plain');
                    return resp;
                }
            );
        }
    });

    server.route({
        method: 'GET', 
        path: '/relatorio/{cod}/mensal/{ano}/{mes}',
        options: {cors: {origin: ['*']}},
        handler: function(request, reply){
            let ano = encodeURIComponent(request.params.ano); 
            let mes = encodeURIComponent(request.params.mes); 
            let cod = Number.parseInt(request.params.cod); 
            let data = `${ano}-${mes}-01`;
            let sql = relatorios(cod, "mensal");
            return obterDados(sql, [data, data]).then(
                dados =>{
                    let resp = reply.response(dados);
                    resp.code(200);
                    resp.type('application/json');
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    resp.code(204);
                    resp.type('text/plain');
                    return resp;
                }
            )
        }
    });

    server.route({
        method: 'GET', 
        path: '/relatorio/{cod}/semanal/{ano}/{mes}/{dia}',
        options: {cors: {origin: ['*']}},
        handler: function(request, reply){
            let ano = encodeURIComponent(request.params.ano); 
            let mes = encodeURIComponent(request.params.mes); 
            let dia = encodeURIComponent(request.params.dia); 
            let cod = Number.parseInt(request.params.cod); 
            let data = `${ano}-${mes}-${dia}`;
            let sql = relatorios(cod, "semanal");
            return obterDados(sql, [data, data]).then(
                dados =>{
                    let resp = reply.response(dados);
                    resp.code(200);
                    resp.type('application/json');
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    resp.code(204);
                    resp.type('text/plain');
                    return resp;
                }
            )
        }
    });

    server.route({
        method: 'GET', 
        path: '/relatorio/{cod}/anual/{ano}',
        options: {cors: {origin: ['*']}},
        handler: function(request, reply){
            let ano = encodeURIComponent(request.params.ano); 
            let cod = Number.parseInt(request.params.cod); 
            let dataInicial = `${ano}-01-01`;
            let dataFinal = `${ano}-12-31`
            let sql = relatorios(cod, "anual");
            return obterDados(sql, [dataInicial, dataFinal]).then(
                dados =>{
                    let resp = reply.response(dados);
                    resp.code(200);
                    resp.type('application/json');
                    return resp;
                },
                msgErro => {
                    let resp = reply.response(msgErro);
                    resp.code(204);
                    resp.type('text/plain');
                    return resp;
                }
            )
        }
    });

   

    await server.start();
    console.log('Server started at: ' + server.info.uri);
}

iniciaServidor();


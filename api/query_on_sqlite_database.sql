-- CONSULTA TABELA DE SEQUENCIAS

SELECT seq + 1 AS "Sequencia" FROM sqlite_sequence WHERE name = "TBL_Refeicao";

-- INSERTS

INSERT INTO TBL_Usuario("Login", "Senha", "Nome") VALUES("manager", "teste01@", "super usuário")
INSERT INTO TBL_Refeicao("Cod_Usuario", "Nome_Refeicao", "Data_Refeicao", "Hora", "Total_kcal") VALUES (1, "Café da manhã", "2025-5-19", "13:15", 265, 0)
INSERT INTO TBL_Alimento VALUES (7891000379691, 1, "Achocolatado em pó", 20, 1, "20.0g", 76, 76, "370g")
INSERT INTO TBL_Alimento VALUES (7894900911510, 1, "Refrigerante Guaraná Kuat Garrafa 2l", 200, 1, "200ml", 82, 82, "2l")
INSERT INTO TBL_Alimento VALUES (7622210596413, 1, "Wafers, barras recheadas e tabletes sortidos", 20.71, 1, "20.71g", 107, 107, "250.6g")

SELECT * FROM "TBL_Usuario"
SELECT * FROM "TBL_Refeicao"
SELECT * FROM "TBL_Alimento"


-- REFEICOES REGISTRADAS NA DATA ATUAL

SELECT 
	TBL_Refeicao.Cod_Refeicao, 
	TBL_Refeicao.Nome_Refeicao, 
	TBL_Refeicao.Hora, 
	TBL_Refeicao.Total_kcal, 
	TBL_Refeicao.Qtd_Alimentos, 
	TBL_Refeicao.Alimentos_Na_Refeicao
FROM 
	TBL_Refeicao
WHERE 
	TBL_Refeicao.Cod_Usuario = 1 AND
	TBL_Refeicao.Refeicao_Inativa = 0 AND
	TBL_Refeicao.Data_Refeicao = date('now', 'localtime')
ORDER BY TBL_Refeicao.Cod_Refeicao DESC

-- REFEICOES FILTRADAS POR DATA

SELECT 
	TBL_Refeicao.Cod_Refeicao, 
	TBL_Refeicao.Nome_Refeicao, 
	TBL_Refeicao.Data_Refeicao,
	TBL_Refeicao.Hora, 
	TBL_Refeicao.Total_kcal, 
	TBL_Refeicao.Qtd_Alimentos, 
	TBL_Refeicao.Alimentos_Na_Refeicao
FROM 
	TBL_Refeicao 
WHERE 
	TBL_Refeicao.Cod_Usuario = 1 AND
	TBL_Refeicao.Refeicao_Inativa = 0 AND
	TBL_Refeicao.Data_Refeicao BETWEEN "2025-07-16" AND "2025-07-19"

-- ITENS DE UMA REFEICAO
SELECT 
	TBL_Refeicao.Cod_Refeicao,
	TBL_Refeicao.Nome_Refeicao,
	TBL_Refeicao.Hora,
	TBL_Refeicao.Qtd_Alimentos,
	TBL_Refeicao.Total_kcal,
	TBL_Alimento.Nome_Alimento,
	TBL_Alimento.Consumo, 
	TBL_Alimento.Porcoes_Consumidas, 
	TBL_Alimento.Porcao_Padrao, 
	TBL_Alimento.Kcal_Consumidas, 
	TBL_Alimento.Kcal_Por_Porcao, 
	TBL_Alimento.Qtd_Embalagam
FROM TBL_Alimento 
	INNER JOIN TBL_Refeicao ON TBL_Alimento.Cod_Refeicao = TBL_Refeicao.Cod_Refeicao
		INNER JOIN TBL_Usuario ON TBL_Usuario.Cod_Usuario = TBL_Refeicao.Cod_Usuario
WHERE
	TBL_Usuario.Cod_Usuario = 1 AND
	TBL_Refeicao.Refeicao_Inativa = 0 AND
	TBL_Refeicao.Cod_Refeicao = 48 AND
	(TBL_Refeicao.Data_Refeicao >= "2025-01-01" AND TBL_Refeicao.Data_Refeicao <= "2025-07-19")
ORDER BY 
	TBL_Refeicao.Cod_Refeicao DESC
LIMIT 10

-- DADOS REFEICAO (CRIAR REGISTRO)

SELECT
	TBL_Refeicao.Cod_Refeicao,
	TBL_Refeicao.Nome_Refeicao,
	TBL_Refeicao.Data_Refeicao,
	TBL_Refeicao.Hora,
	TBL_Refeicao.Total_kcal
FROM
	TBL_Refeicao
WHERE 
	TBL_Refeicao.Cod_Refeicao = 60 AND
	TBL_Refeicao.Refeicao_Inativa = 0
	
--  ALIMENTOS DE UMA REFEICAO (CRIAR REGISTRO)

SELECT
	TBL_Alimento.Cod_Alimento,
	TBL_Alimento.Cod_Refeicao,
	TBL_Alimento.Cod_Barras,
	TBL_Alimento.Nome_Alimento,
	TBL_Alimento.Consumo,
	TBL_Alimento.Porcoes_Consumidas,
	TBL_Alimento.Porcao_Padrao,
	TBL_Alimento.Kcal_Consumidas,
	TBL_Alimento.Kcal_Por_Porcao,
	TBL_Alimento.Qtd_Embalagam
FROM
	TBL_Alimento
WHERE 
	TBL_Alimento.Cod_Refeicao = 63 AND
	TBL_Alimento.Alimento_Inativo = 0
	
-- ATUALIZAÇÃO (ALIMENTO)
BEGIN TRANSACTION;

	UPDATE TBL_Alimento
		SET TBL_Alimento.Consumo = 200,
			TBL_Alimento.Porcoes_Consumidas = 2.0,
			TBL_Alimento.Kcal_Consumidas = 324.00
	WHERE TBL_Alimento.Cod_Alimento = 51;

COMMIT;
	
-- ATUALIZAÇÃO (REFEICAO TOTAL CALORIAS)

BEGIN TRANSACTION;
	
	UPDATE TBL_Refeicao
		SET TBL_Refeicao.Total_kcal = 324.00
	WHERE TBL_Refeicao.Cod_Refeicao = 63;

COMMIT;

-- ATUALIZACAO (NOME DA REFEICAO)

BEGIN TRANSACTION;

	UPDATE TBL_Refeicao
		SET Nome_Refeicao = 'Pudim de Leite 2'
	WHERE Cod_Refeicao = 63
	
COMMIT;

-- ATUALIZACAO (DATA DA REFEICAO)

BEGIN TRANSACTION;

	UPDATE TBL_Refeicao
		SET 
			Data_Refeicao = '2025-01-01',
			Hora = '00:00'
	WHERE Cod_Refeicao = 63
	
COMMIT;

-- ATUALIZAÇÃO (ALIMENTOS ATIVOS)

CREATE TRIGGER IF NOT EXISTS "Alimentos_Ativos"
	AFTER UPDATE 
	ON TBL_Alimento
	WHEN new.Alimento_Inativo = 1
BEGIN 
	UPDATE TBL_Refeicao
		SET Qtd_Alimentos = (
			SELECT count(*) AS "Qtd_Ativos" 
			FROM TBL_Alimento
			WHERE 
				Cod_Refeicao = new.Cod_Refeicao AND 
				Alimento_Inativo = 0
		),
		Alimentos_Na_Refeicao = (
			SELECT concat('', group_concat(Nome_Alimento, ' > ')) AS "Alimentos"
			FROM TBL_Alimento
			WHERE 
				Cod_Refeicao = new.Cod_Refeicao AND 
				Alimento_Inativo = 0
		),
		Refeicao_Inativa = (
			SELECT 
				CASE count(*)
					WHEN 0 THEN 1
					ELSE 0
				END AS "Inativar_Refeicao" 
			FROM TBL_Alimento
			WHERE 
				Cod_Refeicao = new.Cod_Refeicao AND 
				Alimento_Inativo = 0
		)
	WHERE Cod_Refeicao = new.Cod_Refeicao;
END;

-- ATUALIZAÇÃO (INATIVAR REFEICAO)

CREATE TRIGGER IF NOT EXISTS "Inativar_Refeicao"
	AFTER UPDATE 
	ON TBL_Refeicao
	WHEN new.Refeicao_Inativa = 1
BEGIN
	UPDATE TBL_Refeicao
		SET 
			Qtd_Alimentos = 0, 
			Alimentos_Na_Refeicao = ''
	WHERE Cod_Refeicao = new.Cod_Refeicao;
	
	UPDATE TBL_Alimento
		SET Alimento_Inativo = 1
	WHERE Cod_Refeicao = new.Cod_Refeicao;
END;


-- RELATORIOS

-- filtro semanal (7 dias com base na data selecionada)
SELECT date('2022-11-01') AS "Inicio_Semana"
SELECT date('2022-11-01', '+6 days') AS "Fim_Semana"

--filtro mensal
SELECT date('2022-11-01') AS "Inicio_Mes"
SELECT date('2022-11-01', '+1 months', '-1 days') AS "Fim_Mes"

-- filtro anual
SELECT date('2022-01-01') AS "Inicio_Ano"
SELECT date('2022-12-31') AS "Fim_Ano"

-- RELATORIO-01 (total de consumo calorico por data)
SELECT Data_Refeicao, count(Data_Refeicao) AS "Num_Refeicoes", sum(Total_kcal) AS "Total_kcal"
FROM TBL_Refeicao
WHERE Data_Refeicao BETWEEN date('2025-01-01') AND date('2025-12-31')
GROUP BY Data_Refeicao
ORDER BY Total_kcal DESC

-- RELATORIO-02 (a refeicao com a maior quantidade de caloria agrupado por data)
SELECT Nome_Refeicao, Data_Refeicao, Hora, max(Total_kcal) AS "Total_kcal"
FROM TBL_Refeicao
GROUP BY Data_Refeicao
ORDER BY Total_kcal DESC

-- RELATORIO-03 (a refeicao com maior quantidade de caloria num determinado periodo)
SELECT Nome_Refeicao, Data_Refeicao, Hora, max(Total_kcal) AS "Total_kcal"
FROM TBL_Refeicao

-- RELATORIO-04 (a refeicao com a menor quantidade de caloria agrupado por data)
SELECT Nome_Refeicao, Data_Refeicao, Hora, min(Total_kcal) AS "Total_kcal"
FROM TBL_Refeicao
GROUP BY Data_Refeicao
ORDER BY Total_kcal ASC

-- RELATORIO-05 (a refeicao com menor quantidade de caloria num determinado periodo)
SELECT Nome_Refeicao, Data_Refeicao, Hora, min(Total_kcal) AS "Total_kcal"
FROM TBL_Refeicao

-- evolucao calorica
SELECT Data_Refeicao, count(Data_Refeicao) AS "Num_Refeicoes", sum(Total_kcal) AS "Total_kcal"
FROM TBL_Refeicao
WHERE Data_Refeicao BETWEEN date('2025-01-01') AND date('2025-12-31')
GROUP BY Data_Refeicao
ORDER BY Hora ASC

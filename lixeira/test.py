import sqlite3

# lembrar order by

# Rotas
# (GET)
# /usuarios
# /usuarios/logins
# /usuarios/ficha/<string:Login>
#
# /alimentos
# /alimentos/ficha/<string:Nome_Alimento>

# (POST)
# /usuario_novo
#
# /alimento_novo

# (PUT)
# /usuario_atualizacao/<string:Login>

# (DELETE)
# /usuario_remover/<string:Login>
#
# /alimento_remover/<string:Nome_Alimento>



conn = sqlite3.connect("meu_banco.db")
cursor = conn.cursor()

# Criar uma tabela
cursor.execute("Create Table Refeicao_X_Alimento(	Nome_Refeicao Text		REFERENCES Refeicao(Nome_Refeicao),	Data_Refeicao Text		REFERENCES Refeicao(Data_Refeicao),	Nome_Alimento Text		REFERENCES Alimento(Nome_Alimento),	Quantidade Real			NOT NULL,	Primary Key(Nome_Refeicao, Data_Refeicao, Nome_Alimento))")

# Inserir um dado
#cursor.execute("INSERT INTO Usuario (Login, Senha, Nome, Data_Nascimento) VALUES (?, ?, ?, ?)", ("ggs","123", "Gustavo", "1/1/1"))

# Salvar e fechar
conn.commit()
conn.close()


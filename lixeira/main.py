from flask import Flask, request, jsonify, json, Response
import sqlite3

app = Flask(__name__)

# Conexão ao banco de dados
def conectar_bd():
    return sqlite3.connect("meu_banco.db")



# Criar um usuário (POST)
@app.route("/usuario", methods=["POST"])
def criar_usuario():
    dados = request.get_json()
    conn = conectar_bd()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO Usuario (Login, Senha, Altura, Data_Nascimento, Nome, Peso, Sexo_Biologico) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                       (dados["Login"], dados["Senha"], dados["Altura"], dados["Data_Nascimento"], dados["Nome"], dados["Peso"], dados["Sexo_Biologico"]))
        conn.commit()
        return jsonify({"mensagem": "Usuário criado com sucesso!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"erro": "Dados Inválidos!"}), 400
    finally:
        conn.close()

# Listar fichas completas de todos os usuários (GET)
@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    conn = conectar_bd()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Usuario")
    usuarios = [{"Login": row[0], "Senha": row[1], "Altura": row[2], "Data_Nascimento": row[3], "Nome": row[4], "Peso": row[5], "Sexo_Biologico": row[6]} for row in cursor.fetchall()]
    conn.close()
    json_string = json.dumps(usuarios,ensure_ascii = False)
    #creating a Response object to set the content type and the encoding
    response = Response(json_string,content_type="application/json; charset=utf-8" )
    return response

# Listar logins de todos os usuários (GET)
@app.route("/usuarios/logins", methods=["GET"])
def listar_usuarios_logins():
    conn = conectar_bd()
    cursor = conn.cursor()
    cursor.execute("SELECT Login FROM Usuario")
    usuarios = [{"Login": row[0]} for row in cursor.fetchall()]
    conn.close()
    json_string = json.dumps(usuarios,ensure_ascii = False)
    #creating a Response object to set the content type and the encoding
    response = Response(json_string,content_type="application/json; charset=utf-8" )
    return response

# Listar ficha completa de um usuário em específico (GET)
@app.route("/usuarios/ficha/<string:Login>", methods=["GET"])
def listar_usuario_ficha(Login):
    conn = conectar_bd()
    cursor = conn.cursor()
    cursor.execute("SELECT Login, Senha, Altura, Data_Nascimento, Nome, Peso, Sexo_Biologico FROM Usuario WHERE Login = ?", (Login,))
    usuarios = [{"Login": row[0], "Senha": row[1], "Altura": row[2], "Data_Nascimento": row[3], "Nome": row[4], "Peso": row[5], "Sexo_Biologico": row[6]} for row in cursor.fetchall()]
    conn.close()
    json_string = json.dumps(usuarios,ensure_ascii = False)
    #creating a Response object to set the content type and the encoding
    response = Response(json_string,content_type="application/json; charset=utf-8" )
    return response



# Criar um alimento (POST)
@app.route("/alimento", methods=["POST"])
def criar_alimento():
    dados = request.get_json()
    conn = conectar_bd()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO Alimento (Nome_Alimento, Caloria_Por_Unidade) VALUES (?, ?)", 
                       (dados["Nome_Alimento"], dados["Caloria_Por_Unidade"]))
        conn.commit()
        return jsonify({"mensagem": "Alimento criado com sucesso!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"erro": "Dados Inválidos!"}), 400
    finally:
        conn.close()

# Listar fichas completas de todos os alimentos (GET)
@app.route("/alimentos", methods=["GET"])
def listar_alimentos():
    conn = conectar_bd()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Alimento")
    alimentos = [{"Nome_Alimento": row[0], "Caloria_Por_Unidade": row[1]} for row in cursor.fetchall()]
    conn.close()
    json_string = json.dumps(alimentos,ensure_ascii = False)
    #creating a Response object to set the content type and the encoding
    response = Response(json_string,content_type="application/json; charset=utf-8" )
    return response

# Listar ficha completa de um alimento em específico (GET)
@app.route("/alimentos/ficha/<string:Nome_Alimento>", methods=["GET"])
def listar_alimento_ficha(Nome_Alimento):
    conn = conectar_bd()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Alimento Where Nome_Alimento = ?", (Nome_Alimento,))
    alimentos = [{"Nome_Alimento": row[0], "Caloria_Por_Unidade": row[1]} for row in cursor.fetchall()]
    conn.close()
    json_string = json.dumps(alimentos,ensure_ascii = False)
    #creating a Response object to set the content type and the encoding
    response = Response(json_string,content_type="application/json; charset=utf-8" )
    return response



# Criar uma refeição (POST)
@app.route("/refeicao", methods=["POST"])
def criar_refeicao():
    dados = request.get_json()
    conn = conectar_bd()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO Refeicao (Nome, Data_e_Hora, Icone, ID_Refeicao, Login) VALUES (?, ?, ?, ?, ?)", 
                   (dados["Nome"], dados["Data_e_Hora"], dados["Icone"], dados["ID_Refeicao"], dados["Login"]))
        conn.commit()
        return jsonify({"mensagem": "Refeição registrada com sucesso!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"erro": "Dados Inválidos!"}), 400
    finally:
        conn.close()

# 📌 4. Listar refeições de um usuário (GET)
@app.route("/refeicoes/<int:usuario_id>", methods=["GET"])
def listar_refeicoes(usuario_id):
    conn = conectar_bd()
    cursor = conn.cursor()
    cursor.execute("SELECT id, descricao, data FROM Refeicao WHERE usuario_id = ?", (usuario_id,))
    refeicoes = [{"id": row[0], "descricao": row[1], "data": row[2]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(refeicoes)

if __name__ == "__main__":
    app.run(debug=True)
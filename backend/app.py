from flask import Flask, request, jsonify
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from datetime import datetime, timedelta
import oracledb
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

#Carregar variáveis do arquivo .env
load_dotenv()
app = Flask(__name__)
CORS(app)

#Config Oracle
USER = os.getenv("ORACLE_USER")
PASSWORD = os.getenv("ORACLE_PASSWORD")
HOST = os.getenv("ORACLE_HOST")
PORT = os.getenv("ORACLE_PORT")
SERVICE_NAME = os.getenv("ORACLE_SERVICE_NAME")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")

def get_connection():
    try:
        conn = oracledb.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            service_name=SERVICE_NAME
        )
        return conn
    except Exception as e:
        print(f"Erro na conexão Oracle: {e}")
        return None

def get_next_id(conn, table_name, id_column):
    cursor = conn.cursor()
    cursor.execute(f"SELECT NVL(MAX({id_column}), 0) + 1 FROM {table_name}")
    next_id = cursor.fetchone()[0]
    cursor.close()
    return next_id

@app.route("/api/set-reminder", methods=["POST"])
def set_reminder():
    data = request.get_json()
    email = data.get("email")
    telefone = data.get("telefone")
    nome = data.get("nome", "Paciente")
    data_consulta_str = data.get("data_consulta")  
    especialidade = data.get("especialidade", "geral")

    if not email or not data_consulta_str:
        return jsonify({"error": "Email e data_consulta são obrigatórios"}), 400

    try:
        data_consulta = datetime.strptime(data_consulta_str, "%d/%m/%Y %H:%M")
    except ValueError:
        return jsonify({"error": "Formato de data_consulta inválido. Use DD/MM/YYYY HH:MM"}), 400

    conn = get_connection()
    if not conn:
        return jsonify({"error": "Erro ao conectar ao banco de dados"}), 500

    try:
        cursor = conn.cursor()

        # 1. Verificar se paciente existe pelo email, senão inserir
        cursor.execute("SELECT id_paciente FROM pacientes WHERE email = :email", {"email": email})
        paciente = cursor.fetchone()
        if paciente:
            id_paciente = paciente[0]
            cursor.execute("UPDATE pacientes SET nome = :nome WHERE id_paciente = :id_paciente", {"nome": nome, "id_paciente": id_paciente})
        else:
            id_paciente = get_next_id(conn, "pacientes", "id_paciente")
            cursor.execute("""
                INSERT INTO pacientes (id_paciente, nome, email, telefone, acompanhante, senha)
                VALUES (:id_paciente, :nome, :email, :telefone,:acompanhante, :senha)
            """, {
                "id_paciente": id_paciente,
                "nome": nome,
                "email": email,
                "telefone": telefone or "",
                 "senha": "senha_padrao", # or senha - Pegar futuro senha no Json
                 "acompanhante": "S"
            })
    
        # 2. Inserir consulta
        id_consulta = get_next_id(conn, "consultas", "id_consulta")
        cursor.execute("""
            INSERT INTO consultas (id_consulta, especialidade, data_consulta, status, id_paciente)
            VALUES (:id_consulta, :especialidade, :data_consulta, 'A', :id_paciente)
        """, {
            "id_consulta": id_consulta,
            "especialidade": especialidade,
            "data_consulta": data_consulta,
            "id_paciente": id_paciente
        })

        # 3. Criar lembretes 48h e 24h antes da consulta
        lembretes = []
        for horas in [48, 24]:
            id_lembrete = get_next_id(conn, "lembretes", "id_lembrete")
            data_envio = data_consulta - timedelta(hours=horas)
            cursor.execute("""
                INSERT INTO lembretes (id_lembrete, data_envio, id_consulta)
                VALUES (:id_lembrete, :data_envio, :id_consulta)
            """, {
                 "id_lembrete": id_lembrete,
                 "data_envio": data_envio,
                 "id_consulta": id_consulta
            })
            lembretes.append({
                "id_lembrete": id_lembrete,
                "canal_envio": "email",
                "data_envio": data_envio.strftime("%d/%m/%Y %H:%M"),
                "id_consulta": id_consulta
            })

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "message": "Consulta e lembretes cadastrados com sucesso",
            "id_consulta": id_consulta,
            "lembretes": lembretes
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        if conn:
            conn.rollback()
            conn.close()
        return jsonify({"error": "Erro ao salvar dados"}), 500

# FUNCAO API SENDGRID - Enviar Email
def enviar_email(destinatario, data_consulta, nome):
    if not SENDGRID_API_KEY:
        print("Erro: SendGrid API Key não configurada.")
        return False
    
    message = Mail(
        from_email='contato@consultacerta.tech',  
        to_emails=destinatario,
        subject='Lembrete de Consulta',
        html_content=f'<p>Olá, {nome}! Este é um lembrete da sua consulta agendada para {data_consulta.strftime("%d/%m/%Y %H:%M")}.</p>'
    )
    
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Email enviado para {destinatario}, status: {response.status_code}")
        return response.status_code == 202
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        return False

@app.route("/api/test-email")
def test_email():
    sucesso = enviar_email("mariafelipeinfo@gmail.com", datetime.now(), "Teste")
    if sucesso:
        return "Email enviado com sucesso!"
    else:
        return "Falha ao enviar email.", 500

def enviar_lembretes_pendentes():
    print("Verificando lembretes pendentes para envio...")
    conn = get_connection()
    if not conn:
        print("Erro ao conectar ao banco para enviar lembretes")
        return

    try:
        cursor = conn.cursor()
        agora = datetime.now()

        # Buscar lembretes com data_envio <= agora e que ainda não foram enviados e o nome do paciente
        cursor.execute("""
            SELECT l.id_lembrete, p.email, l.data_envio, l.id_consulta, 
                c.data_consulta, p.nome
            FROM lembretes l
            JOIN consultas c ON l.id_consulta = c.id_consulta
            JOIN pacientes p ON c.id_paciente = p.id_paciente
            WHERE l.data_envio <= :agora
              AND (l.enviado IS NULL OR l.enviado = 'N')
        """, {"agora": agora})

        lembretes = cursor.fetchall()

        for lembrete in lembretes:
            id_lembrete, email, data_envio, id_consulta, data_consulta, nome = lembrete

            sucesso = enviar_email(email, data_consulta, nome)
            if sucesso:
                print(f"Lembrete {id_lembrete} enviado para {email}")
                # Marcar lembrete como enviado no Banco
                cursor.execute("UPDATE lembretes SET enviado = 'S' WHERE id_lembrete = :id_lembrete", {"id_lembrete": id_lembrete})
                conn.commit()
            else:
                print(f"Falha ao enviar lembrete {id_lembrete} para {email}")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Erro ao enviar lembretes: {e}")
        import traceback
        traceback.print_exc()
        if conn:
            conn.rollback()
            conn.close()

# Scheduler para verificar lembretes pendentes a cada minuto
scheduler = BackgroundScheduler()
scheduler.add_job(func=enviar_lembretes_pendentes, trigger="interval", minutes=10)
scheduler.start()

# Para garantir que o scheduler pare junto com o Flask
atexit.register(lambda: scheduler.shutdown())

print(f"SendGrid API Key configurada: {SENDGRID_API_KEY}")
print(f"User DB: {USER}")

if __name__ == "__main__":
    app.run(port=5000, debug=True)
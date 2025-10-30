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

# Carregar variáveis do arquivo .env
load_dotenv()
app = Flask(__name__)
CORS(app)

# Config Oracle
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

# Endpoint removido: /api/set-reminder não é mais necessário, pois a app Java insere dados diretamente no banco.
# O scheduler agora cuida de tudo automaticamente.

# FUNÇÃO API SENDGRID - Enviar Email (atualizada para incluir especialidade)
def enviar_email(destinatario, data_consulta, nome, especialidade):
    if not SENDGRID_API_KEY:
        print("Erro: SendGrid API Key não configurada.")
        return False
    
    message = Mail(
        from_email='contato@consultacerta.tech',  
        to_emails=destinatario,
        subject='Lembrete de Consulta',
        html_content=f'<p>Olá, {nome}! Este é um lembrete da sua consulta de {especialidade} agendada para {data_consulta.strftime("%d/%m/%Y %H:%M")}.</p>'
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
    sucesso = enviar_email("mariafelipeinfo@gmail.com", datetime.now(), "Teste", "geral")
    if sucesso:
        return "Email enviado com sucesso!"
    else:
        return "Falha ao enviar email.", 500

def criar_lembretes_automaticos():
    print("Verificando consultas futuras para criar lembretes...")
    conn = get_connection()
    if not conn:
        print("Erro ao conectar ao banco para criar lembretes")
        return

    try:
        cursor = conn.cursor()
        agora = datetime.now()

        # Consultar consultas futuras (> 48h) ativas sem lembretes associados
        cursor.execute("""
            SELECT c.id, c.data_consulta, c.especialidade
            FROM cc_consultas c
            WHERE c.data_consulta > SYSDATE + INTERVAL '48' HOUR
              AND c.status_consulta = 'a'
              AND NOT EXISTS (
                  SELECT 1 FROM cc_lembretes l WHERE l.id_consulta = c.id
              )
        """)

        consultas = cursor.fetchall()

        for consulta in consultas:
            id_consulta, data_consulta, especialidade = consulta
            print(f"Criando lembretes para consulta {id_consulta} em {data_consulta}")

            # Criar lembretes 48h e 24h antes
            for horas in [48, 24]:
                id_lembrete = get_next_id(conn, "cc_lembretes", "id")
                data_envio = data_consulta - timedelta(hours=horas)
                cursor.execute("""
                    INSERT INTO cc_lembretes (id, data_envio, id_consulta, enviado)
                    VALUES (:id_lembrete, :data_envio, :id_consulta, 'N')
                """, {
                    "id_lembrete": id_lembrete,
                    "data_envio": data_envio,
                    "id_consulta": id_consulta
                })

        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Erro ao criar lembretes: {e}")
        import traceback
        traceback.print_exc()
        if conn:
            conn.rollback()
            conn.close()

def enviar_lembretes_pendentes():
    print("Verificando lembretes pendentes para envio...")
    conn = get_connection()
    if not conn:
        print("Erro ao conectar ao banco para enviar lembretes")
        return

    try:
        cursor = conn.cursor()
        agora = datetime.now()

        # Buscar lembretes pendentes com dados do paciente e consulta
        cursor.execute("""
            SELECT l.id, p.email, l.data_envio, c.data_consulta, p.nome, c.especialidade
            FROM cc_lembretes l
            JOIN cc_consultas c ON l.id_consulta = c.id
            JOIN cc_pacientes p ON c.id_paciente = p.id
            WHERE l.data_envio <= :agora
              AND l.enviado = 'N'
        """, {"agora": agora})

        lembretes = cursor.fetchall()

        for lembrete in lembretes:
            id_lembrete, email, data_envio, data_consulta, nome, especialidade = lembrete

            sucesso = enviar_email(email, data_consulta, nome, especialidade)
            if sucesso:
                print(f"Lembrete {id_lembrete} enviado para {email}")
                # Marcar como enviado
                cursor.execute("UPDATE cc_lembretes SET enviado = 'S' WHERE id = :id_lembrete", {"id_lembrete": id_lembrete})
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

# Scheduler: Criar lembretes e enviar a cada 1 hora
scheduler = BackgroundScheduler()
scheduler.add_job(func=criar_lembretes_automaticos, trigger="interval", hours=1)
scheduler.add_job(func=enviar_lembretes_pendentes, trigger="interval", hours=1)
scheduler.start()

# Para garantir que o scheduler pare junto com o Flask
atexit.register(lambda: scheduler.shutdown())

print(f"SendGrid API Key configurada: {SENDGRID_API_KEY}")
print(f"User DB: {USER}")

if __name__ == "__main__":
    app.run(port=5000, debug=True)
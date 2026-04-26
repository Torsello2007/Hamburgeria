import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseWrapper:
    def __init__(self):
        self.config = {
            'host': os.getenv('DB_HOST'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASS'),
            'port': int(os.getenv('DB_PORT')),
            'database': os.getenv('DB_NAME'),
            'cursorclass': pymysql.cursors.DictCursor
        }

    def get_prodotti(self):
        conn = pymysql.connect(**self.config)
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM prodotti")
                return cursor.fetchall()
        finally:
            conn.close()

    # QUESTA È LA FUNZIONE CHE MANCAVA!
    def get_ordini(self):
        conn = pymysql.connect(**self.config)
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM ordini ORDER BY id DESC")
                return cursor.fetchall()
        finally:
            conn.close()

    def crea_ordine(self, totale, prodotti):
        conn = pymysql.connect(**self.config)
        try:
            with conn.cursor() as cursor:
                cursor.execute("INSERT INTO ordini (totale, stato) VALUES (%s, 'in attesa')", (totale,))
                id_ordine = cursor.lastrowid
                for p in prodotti:
                    cursor.execute("INSERT INTO dettagli_ordine (id_ordine, id_prodotto, quantita) VALUES (%s, %s, %s)", 
                                 (id_ordine, p['id'], p['quantita']))
                conn.commit()
                return id_ordine
        finally:
            conn.close()

import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseWrapper:
    def __init__(self):
        self.config = {
            'host': os.getenv('DB_HOST'), 'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASS'), 'port': int(os.getenv('DB_PORT')),
            'database': os.getenv('DB_NAME'), 'cursorclass': pymysql.cursors.DictCursor
        }

    def _execute(self, sql, params=None, commit=False):
        conn = pymysql.connect(**self.config)
        try:
            with conn.cursor() as cur:
                cur.execute(sql, params)
                if commit: conn.commit()
                return cur.fetchall()
        finally: conn.close()

    def get_prodotti(self): return self._execute("SELECT * FROM prodotti")
    
    def add_prodotto(self, p): 
        sql = "INSERT INTO prodotti (nome, prezzo, categoria, immagine) VALUES (%s, %s, %s, %s)"
        return self._execute(sql, (p['nome'], p['prezzo'], p['categoria'], p['immagine']), True)

    def delete_prodotto(self, id): 
        return self._execute("DELETE FROM prodotti WHERE id=%s", (id,), True)

    def get_ordini(self): return self._execute("SELECT * FROM ordini ORDER BY id DESC")
    
    def update_ordine(self, id, stato): 
        return self._execute("UPDATE ordini SET stato=%s WHERE id=%s", (stato, id), True)

    def crea_ordine(self, totale, prodotti):
        conn = pymysql.connect(**self.config)
        with conn.cursor() as cur:
            cur.execute("INSERT INTO ordini (totale, stato) VALUES (%s, 'in attesa')", (totale,))
            oid = conn.lastrowid
            for p in prodotti:
                cur.execute("INSERT INTO dettagli_ordine (id_ordine, id_prodotto, quantita) VALUES (%s, %s, %s)", (oid, p['id'], p['quantita']))
            conn.commit()
        return oid

import pymysql, os
from dotenv import load_dotenv
load_dotenv()

class DatabaseWrapper:
    def __init__(self):
        self.config = {
            'host': os.getenv('DB_HOST'), 'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASS'), 'port': int(os.getenv('DB_PORT')),
            'database': os.getenv('DB_NAME'), 'cursorclass': pymysql.cursors.DictCursor
        }

    def _ex(self, sql, params=None, commit=False):
        conn = pymysql.connect(**self.config)
        try:
            with conn.cursor() as cur:
                cur.execute(sql, params)
                if commit: conn.commit()
                return cur.fetchall()
        finally: conn.close()

    def get_prodotti(self): return self._ex("SELECT * FROM prodotti")
    def add_prodotto(self, p): return self._ex("INSERT INTO prodotti (nome, prezzo, categoria, immagine) VALUES (%s, %s, %s, %s)", (p['nome'], p['prezzo'], p['categoria'], p['immagine']), True)
    def update_prodotto(self, id, p): return self._ex("UPDATE prodotti SET nome=%s, prezzo=%s, immagine=%s WHERE id=%s", (p['nome'], p['prezzo'], p['immagine'], id), True)
    def delete_prodotto(self, id): return self._ex("DELETE FROM prodotti WHERE id=%s", (id,), True)
    def get_ordini(self): return self._ex("SELECT * FROM ordini ORDER BY id DESC")
    def update_ordine(self, id, s): return self._ex("UPDATE ordini SET stato=%s WHERE id=%s", (s, id), True)
    
    def crea_ordine(self, tot, prod):
        conn = pymysql.connect(**self.config)
        try:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO ordini (totale, stato) VALUES (%s, 'in attesa')", (tot,))
                oid = cur.lastrowid # FIX: Usiamo cur invece di conn
                for p in prod:
                    cur.execute("INSERT INTO dettagli_ordine (id_ordine, id_prodotto, quantita) VALUES (%s, %s, %s)", (oid, p['id'], p['quantita']))
                conn.commit()
                return oid
        finally: conn.close()

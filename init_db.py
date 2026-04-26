import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

db_config = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASS'),
    'port': int(os.getenv('DB_PORT')),
    'database': os.getenv('DB_NAME'),
    'cursorclass': pymysql.cursors.DictCursor
}

try:
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
        cursor.execute("CREATE TABLE IF NOT EXISTS prodotti (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(100), prezzo DECIMAL(10,2), categoria VARCHAR(50), immagine TEXT)")
        cursor.execute("CREATE TABLE IF NOT EXISTS ordini (id INT AUTO_INCREMENT PRIMARY KEY, data_ordine TIMESTAMP DEFAULT CURRENT_TIMESTAMP, stato VARCHAR(20) DEFAULT 'in_attesa', totale DECIMAL(10,2))")
        cursor.execute("CREATE TABLE IF NOT EXISTS dettagli_ordine (id INT AUTO_INCREMENT PRIMARY KEY, id_ordine INT, id_prodotto INT, quantita INT, FOREIGN KEY (id_ordine) REFERENCES ordini(id))")
        
        cursor.execute("SELECT COUNT(*) FROM prodotti")
        if cursor.fetchone()['COUNT(*)'] == 0:
            sql = "INSERT INTO prodotti (nome, prezzo, categoria, immagine) VALUES (%s, %s, %s, %s)"
            val = [
                ('Classic Burger', 8.50, 'panini', 'https://tinyurl.com/burger-img1'),
                ('Cheese Burger', 9.50, 'panini', 'https://tinyurl.com/burger-img2'),
                ('Coca Cola', 2.50, 'bevande', 'https://tinyurl.com/coke-img')
            ]
            cursor.executemany(sql, val)
        connection.commit()
        print("✅ Database configurato con successo!")
    connection.close()
except Exception as e:
    print(f"❌ Errore: {e}")

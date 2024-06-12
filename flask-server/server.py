from flask import Flask, jsonify
import mysql.connector


app = Flask(__name__)

# Database configuration
db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root12345',
    'database': 'tristar'
}

def get_db_connection():
    connection = mysql.connector.connect(**db_config)
    return connection


@app.route('/workouts')
def workouts():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute('SELECT * FROM workouts')
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(rows);
    
    # return {"foo": ["ack", "bar", "bas"]}
                           
# cats api
@app.route("/cats")
def cats():
    return {"cats": ['pippin', 'artemis', 'shadow', 'loki',' persephone', 'arghh']}

if __name__ == "__main__":
      app.run(debug=True)
      

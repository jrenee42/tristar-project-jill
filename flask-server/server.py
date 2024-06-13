from flask import Flask, request, jsonify
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

def getDataFromTable(specialQuery):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute(specialQuery)
    
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(rows);

@app.route('/actualWorkouts')
def actualWorkouts():
    specialQuery = """ SELECT 
    workout_details.date,
    workout_details.duration_minutes,
    workouts.workout_name
FROM 
    workout_details
LEFT JOIN 
    workouts ON workout_details.workout_id = workouts.id"""

    return getDataFromTable( specialQuery);

@app.route('/workouts')
def workout():
    query = 'SELECT * FROM workouts'
    return getDataFromTable(query);

    # return {"foo": ["ack", "bar", "bas"]}

@app.route('/add', methods=['POST'])
def add_data():
    data = request.get_json()  # Get the JSON data from the request

    workoutId = data.get('workoutId')
    date = data.get('date')
    duration=data.get('duration')
    
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "INSERT INTO workout_details(workout_id, date, duration_minutes) VALUES (%s, %s, %s)"
    cursor.execute(query, (workoutId, date, duration))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({'message': 'Data added successfully!'}), 201


if __name__ == "__main__":
    app.run(debug=True)
    

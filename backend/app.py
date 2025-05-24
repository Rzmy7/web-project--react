# from flask import Flask, jsonify, request, render_template, redirect
# from flask_cors import CORS
# from flask_socketio import SocketIO, emit
# import psycopg2
# import psycopg2.extras
# from datetime import date, time, datetime
# import threading
# import time as time_module

# app = Flask(__name__)
# CORS(app)
# app.config['SECRET_KEY'] = '12345'
# socketio = SocketIO(app, cors_allowed_origins="*")

# # Database configuration
# DB_CONFIG = {
#     'dbname': 'react test',
#     'user': 'karigemba',
#     'password': 'karigemba',  # Replace with actual password
#     'host': 'database-1.c3myi0ygeelx.ap-southeast-2.rds.amazonaws.com',
#     'port': '5432'
# }

# def get_db_connection():
#     return psycopg2.connect(**DB_CONFIG)

# def convert_types(row):
#     return {
#         key: (value.isoformat() if isinstance(value, (datetime, date, time)) else value)
#         for key, value in row.items()
#     }

# # --------- API Route to Fetch All Shop Data ---------
# @app.route('/api/data', methods=['GET'])
# def get_data():
#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
#         cur.execute("SELECT * FROM shop;")
#         rows = cur.fetchall()
#         result = [convert_types(row) for row in rows]
#         cur.close()
#         conn.close()
#         return jsonify(result)
#     except Exception as e:
#         print(f"Error fetching data: {e}")
#         return jsonify({'error': str(e)}), 500

# # --------- Route to Insert Shop Data via Form ---------
# @app.route('/', methods=['GET', 'POST'])
# @app.route('/', methods=['GET', 'POST'])
# def insert_data():
#     if request.method == 'POST':
#         data = request.form.to_dict()

#         # Clean optional fields
#         for key in ['type2', 'type3']:
#             if key in data and data[key].strip() == '':
#                 data[key] = None

#         try:
#             conn = get_db_connection()
#             cur = conn.cursor()
#             cur.execute("""
#                 INSERT INTO shop (shopid, name, type, type2, type3, status, picture, location, opentime, closetime)
#                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
#             """, (
#                 data.get('shopid'),
#                 data.get('name'),
#                 data.get('type'),
#                 data.get('type2'),
#                 data.get('type3'),
#                 data.get('status'),
#                 data.get('picture'),
#                 data.get('location'),
#                 data.get('opentime'),
#                 data.get('closetime')
#             ))
#             conn.commit()
#             cur.close()
#             conn.close()

#             # Emit to Socket.IO clients 
#             socketio.emit('new_entry', data)
#             return redirect('/')
#         except Exception as e:
#             print(f"Insert error: {e}")
#             return "Database Error", 500

#     return render_template('form.html')

#     if request.method == 'GET':
#         data = request.form.to_dict()
#         try:
#             conn = get_db_connection()
#             cur = conn.cursor()
#             cur.execute("""
#                 INSERT INTO shop (shopid,name, type, type2, type3, status, picture, location, opentime, closetime)
#                 VALUES (%s,%s, %s, %s, %s, %s, %s, %s, %s, %s);
#             """, (
#                 data['shopid'],data['name'], data['type'], data['type2'], data['type3'],
#                 data['status'], data['picture'], data['location'],
#                 data['opentime'], data['closetime']
#             ))
#             conn.commit()
#             cur.close()
#             conn.close()

#             # Emit event to connected clients
#             socketio.emit('new_entry', data)
#             return redirect('/')
#         except Exception as e:
#             print(f"Insert error: {e}")
#             return "Database Error", 500

#     return render_template('form.html')





# # --------- Background Thread to Emit Full Data Every 5s ---------
# def background_thread():
#     while True:
#         try:
#             conn = get_db_connection()
#             cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
#             cur.execute("SELECT * FROM shop;")
#             rows = cur.fetchall()
#             result = [convert_types(row) for row in rows]
#             cur.close()
#             conn.close()
#             socketio.emit('shop_data', result)
#         except Exception as e:
#             print(f"Background thread error: {e}")
#         time_module.sleep(5)

# # --------- Socket Events ---------
# @socketio.on('connect')
# def handle_connect():
#     print("Client connected")
#     emit('message', {'msg': 'Connected to server'})

# @socketio.on('disconnect')
# def handle_disconnect():
#     print("Client disconnected")

# # --------- Start App ---------
# if __name__ == '__main__':
#     thread = threading.Thread(target=background_thread)
#     thread.daemon = True
#     thread.start()

#     socketio.run(app, debug=True, host='0.0.0.0', port=8001)














from flask import Flask, jsonify, request, render_template, redirect
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import psycopg2
import psycopg2.extras
from datetime import date, time, datetime

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = '12345'
socketio = SocketIO(app, cors_allowed_origins="*")

# Database configuration
DB_CONFIG = {
    'dbname': 'react test',
    'user': 'karigemba',
    'password': 'karigemba' , # Replace with actual password
    'host': 'database-1.c3myi0ygeelx.ap-southeast-2.rds.amazonaws.com',
    'port': '5432'
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def convert_types(row):
    return {
        key: (value.isoformat() if isinstance(value, (datetime, date, time)) else value)
        for key, value in row.items()
    }

# --------- API Route to Fetch All Shop Data ---------
@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT * FROM shop;")
        rows = cur.fetchall()
        result = [convert_types(row) for row in rows]
        cur.close()
        conn.close()
        return jsonify(result)
    except Exception as e:
        print(f"Error fetching data: {e}")
        return jsonify({'error': str(e)}), 500

# --------- Route to Insert Shop Data via Form ---------
@app.route('/', methods=['GET', 'POST'])
def insert_data():
    if request.method == 'POST':
        data = request.form.to_dict()

        # Clean optional fields
        for key in ['type2', 'type3']:
            if key in data and data[key].strip() == '':
                data[key] = None

        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO shop (shopid, name, type, type2, type3, status, picture, location, opentime, closetime)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (
                data.get('shopid'),
                data.get('name'),
                data.get('type'),
                data.get('type2'),
                data.get('type3'),
                data.get('status'),
                data.get('picture'),
                data.get('location'),
                data.get('opentime'),
                data.get('closetime')
            ))
            conn.commit()
            cur.close()
            conn.close()

            # Emit to Socket.IO clients 
            socketio.emit('new_entry', data)  # Emit immediately after insert
            return redirect('/')
        except Exception as e:
            print(f"Insert error: {e}")
            return "Database Error", 500

    return render_template('form.html')

# --------- Socket Events ---------
@socketio.on('connect')
def handle_connect():
    print("Client connected")
    emit('message', {'msg': 'Connected to server'})

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

# --------- Start App ---------
if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=8001)

from flask import Flask, jsonify, request, render_template, redirect
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import psycopg2
import psycopg2.extras
from datetime import date, time, datetime
from dotenv import load_dotenv
import os
from flask_mail import Mail, Message


load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = '12345'
socketio = SocketIO(app, cors_allowed_origins="*")

# Database configuration
DB_CONFIG = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT')
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
    
@app.route('/api/shopItems/<shop_name>', methods=['GET'])
def get_shop_menu(shop_name):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
        SELECT 
            s.name AS "shopName",
            s.status AS "status",
            s.opentime AS "openingTime",
            s.closetime AS "closingTime",
            s.location AS "location",
            COALESCE(json_agg(json_build_object(
                'id', c.id,
                'name', c.name,
                'items', COALESCE(cat_items.items, '[]')
            )) FILTER (WHERE c.id IS NOT NULL), '[]') AS menuData
        FROM shop s
        LEFT JOIN (
            SELECT 
                i.category_id::INTEGER AS category_id,
                si.shop_id,
                JSON_AGG(json_build_object(
                    'id', i.item_id,
                    'name', i.name,
                    'price', si.price,
                    'status', si.availability
                )) AS items
            FROM shopItem si
            JOIN items i ON si.item_id = i.item_id
            GROUP BY i.category_id, si.shop_id
        ) AS cat_items ON cat_items.shop_id = s.shopid
        LEFT JOIN categories c ON c.id = cat_items.category_id
        WHERE s.name = %s
        GROUP BY s.name, s.status, s.opentime, s.closetime, s.location;
        """

        cur.execute(query, (shop_name,))
        result = cur.fetchone()
        cur.close()
        conn.close()

        if not result:
            return jsonify({'error': 'Shop not found'}), 404

        return jsonify(result)
    except Exception as e:
        print(f"Error fetching shop items: {e}")
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


# --------- Mail Config ---------
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

mail = Mail(app)


@app.route('/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        print("[DEBUG] Raw request data:", data)

        email = data.get('email')
        otp = data.get('otp')

        print(f"[DEBUG] Parsed email={email}, otp={otp}")

        if not email or not otp:
            return jsonify({'error': 'Email and OTP required'}), 400

        msg = Message('Your OTP Code', recipients=[email])
        msg.body = f"Your verification code is: {otp}"
        mail.send(msg)

        print(f"[DEBUG] Email sent to {email}")
        return jsonify({'message': 'OTP sent successfully'})

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return jsonify({'error': str(e)}), 500


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

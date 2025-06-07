from flask import Flask, jsonify, request, render_template, redirect
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import psycopg2
import psycopg2.extras
from datetime import date, time, datetime
from dotenv import load_dotenv
import os
from flask_mail import Mail, Message
import bcrypt

from psycopg2.extras import RealDictCursor
import json
import logging




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


@app.route('/api/test_db', methods=['GET'])
def test_db():
    now = datetime.now()
    day_name_now = now.strftime("%A")
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT 1;")
        result = cur.fetchone()
        cur.close()
        conn.close()
        if result:
            return jsonify({'status': 'success', 'message': 'Database connection successful','date':day_name_now}), 200
        else:
            return jsonify({'status': 'failure', 'message': 'Database connection failed'}), 500
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return jsonify({'status': 'failure', 'message': str(e)}), 500


@app.route('/api/data', methods=['GET'])
def get_data():
    now = datetime.now()
    day_name_now = now.strftime("%A")  # Get the current day name (e.g., "Monday")
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
        WITH ShopTypes AS (
            SELECT 
                s.shop_id,
                s.shop_name AS "name",
                s."Location" AS "location",
                CASE 
                    WHEN s.open_status THEN 'Open'
                    ELSE 'Closed'
                END AS "status",
                s.shop_image AS "picture",
                so.opening_time AS "opentime",
                so.closing_time AS "closetime",
                CASE 
                    WHEN fc.fshop_id IS NOT NULL THEN 'Canteen'
                    WHEN jb.jshop_id IS NOT NULL THEN 'Juice Bar'
                    WHEN bs.bshop_id IS NOT NULL THEN 'Bookshop'
                END AS "type",
                CASE 
                    WHEN fc.fshop_id IS NOT NULL THEN 
                        CASE 
                            WHEN jb.jshop_id IS NOT NULL THEN 'Juice Bar'
                            WHEN bs.bshop_id IS NOT NULL THEN 'Bookshop'
                        END
                    WHEN jb.jshop_id IS NOT NULL THEN 
                        CASE 
                            WHEN bs.bshop_id IS NOT NULL THEN 'Bookshop'
                        END
                END AS "type2",
                CASE 
                    WHEN fc.fshop_id IS NOT NULL AND jb.jshop_id IS NOT NULL THEN 
                        CASE 
                            WHEN bs.bshop_id IS NOT NULL THEN 'Bookshop'
                        END
                    WHEN jb.jshop_id IS NOT NULL AND bs.bshop_id IS NOT NULL THEN 'Bookshop'
                END AS "type3"
            FROM shop s
            INNER JOIN shop_open so ON s.shop_id = so.shop_id
            LEFT JOIN food_canteen fc ON s.shop_id = fc.fshop_id
            LEFT JOIN juice_bar jb ON s.shop_id = jb.jshop_id
            LEFT JOIN bookshop bs ON s.shop_id = bs.bshop_id
            WHERE so.day = %s  -- Filter for the current day
        )
        SELECT * FROM ShopTypes;
        """, (day_name_now,))
        rows = cur.fetchall()
        result = [convert_types(row) for row in rows]
        cur.close()
        conn.close()
        return jsonify(result)
    except Exception as e:
        print(f"Error fetching data: {e}")
        return jsonify({'error': str(e)}), 500
    
# @app.route('/api/shopItems/<string:facility_id>', methods=['GET'])
# def get_shop_menu(facility_id):
#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

#         query = """select s.shop_name AS "shopName",
# s.open_status AS "status",
# so.opening_time AS "openingTime",
# so.closing_time AS "closingTime",
# s."Location" AS "location",
# json_build_array(
# json_build_object(
# 'id', 'cat-1',
# 'name', 'Main Dishes',
# 'items', COALESCE((
# SELECT json_agg(json_build_object(
# 'id', f.food_id,
# 'name', f.food_name,
# 'price', fh.food_price,
# 'status', CASE WHEN fh.food_avalability THEN 'available' ELSE 'unavailable' END
# ))
# FROM food_has fh
# JOIN food f ON f.food_id = fh.food_id
# WHERE fh.shop_id = s.shop_id
# AND LOWER(f.food_name) NOT LIKE '%juice%'
# AND LOWER(f.food_name) NOT LIKE '%cola%'
# ), '[]')
# ),
# json_build_object(
# 'id', 'cat-2',
# 'name', 'Drinks',
# 'items', COALESCE((
# SELECT json_agg(json_build_object(
# 'id', f.food_id,
# 'name', f.food_name,
# 'price', fh.food_price,
# 'status', CASE WHEN fh.food_avalability THEN 'available' ELSE 'unavailable' END
# ))
# FROM food_has fh
# JOIN food f ON f.food_id = fh.food_id
# WHERE fh.shop_id = s.shop_id
# AND (
# LOWER(f.food_name) LIKE '%juice%'
# OR LOWER(f.food_name) LIKE '%cola%'
# )
# ), '[]')
# )
# ) AS "menuData"
# FROM shop s
# LEFT JOIN shop_open so
# ON so.shop_id = s.shop_id
# AND trim(so.day) = trim(to_char(CURRENT_DATE, 'Day'))
# WHERE s.shop_id = 'SH02'
# LIMIT 1;"""
#         cur.execute(query, (facility_id,))
#         result = cur.fetchone()
#         cur.close()
#         conn.close()

#         if not result:
#             return jsonify({'error': 'Shop not found'}), 404

#         return jsonify(result)
#     except Exception as e:
#         print(f"Error fetching shop items: {e}")
#         return jsonify({'error': str(e)}), 500




# @app.route('/api/shopItems/<string:facility_id>', methods=['GET'])
# def get_shop_menu(facility_id):
#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

#         query = """
#         SELECT 
#             s.shop_name AS "shopName",
#             s.open_status AS "status",
#             so.opening_time AS "openingTime",
#             so.closing_time AS "closingTime",
#             s."Location" AS "location",
#             json_build_array(
#                 json_build_object(
#                     'id', 'cat-1',
#                     'name', 'Main Dishes',
#                     'items', COALESCE((
#                         SELECT json_agg(json_build_object(
#                             'id', f.food_id,
#                             'name', f.food_name,
#                             'price', fh.food_price,
#                             'status', CASE WHEN fh.food_avalability THEN 'available' ELSE 'unavailable' END
#                         ))
#                         FROM food_has fh
#                         JOIN food f ON f.food_id = fh.food_id
#                         WHERE fh.shop_id = s.shop_id
#                           AND LOWER(f.food_name) NOT LIKE '%%juice%%'
#                           AND LOWER(f.food_name) NOT LIKE '%%cola%%'
#                     ), '[]')
#                 ),
#                 json_build_object(
#                     'id', 'cat-2',
#                     'name', 'Drinks',
#                     'items', COALESCE((
#                         SELECT json_agg(json_build_object(
#                             'id', f.food_id,
#                             'name', f.food_name,
#                             'price', fh.food_price,
#                             'status', CASE WHEN fh.food_avalability THEN 'available' ELSE 'unavailable' END
#                         ))
#                         FROM food_has fh
#                         JOIN food f ON f.food_id = fh.food_id
#                         WHERE fh.shop_id = s.shop_id
#                           AND (
#                               LOWER(f.food_name) LIKE '%%juice%%'
#                               OR LOWER(f.food_name) LIKE '%%cola%%'
#                           )
#                     ), '[]')
#                 )
#             ) AS "menuData"
#         FROM shop s
#         LEFT JOIN shop_open so ON so.shop_id = s.shop_id
#             AND so.day = to_char(CURRENT_DATE, 'FMDay')
#         WHERE s.shop_id = %s
#         LIMIT 1;
#         """

#         print(f"Executing query with facility_id: {facility_id}")
#         cur.execute(query, (facility_id,))
#         result = cur.fetchone()

#         cur.close()
#         conn.close()

#         if result is None:
#             return jsonify({'error': 'Shop not found'}), 404

#         return jsonify(result)

#     except Exception as e:
#         logging.exception("Error fetching shop items")
#         return jsonify({'error': 'Internal server error'}), 500

# # ... (your existing imports and setup)

@app.route('/api/shopItems/<string:facility_id>', methods=['GET'])
def get_shop_menu(facility_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
        SELECT 
            s.shop_name AS "shopName",
            s.open_status AS "status",
            so.opening_time AS "openingTime",
            so.closing_time AS "closingTime",
            s."Location" AS "location",
            json_build_array(
                json_build_object(
                    'id', 'cat-1',
                    'name', 'All Items',
                    'items', COALESCE((
                        SELECT json_agg(json_build_object(
                            'id', f.food_id,
                            'name', f.food_name,
                            'price', fh.food_price,
                            'status', CASE 
                                WHEN fh.food_avalability THEN 'available' 
                                ELSE 'unavailable' 
                            END
                        ))
                        FROM food_has fh
                        JOIN food f ON f.food_id = fh.food_id
                        WHERE fh.shop_id = s.shop_id
                    ), '[]'::json)
                )
            ) AS "menuData"
        FROM shop s
        LEFT JOIN shop_open so ON so.shop_id = s.shop_id
            AND so.day = to_char(CURRENT_DATE, 'FMDay')
        WHERE s.shop_id = %s
        LIMIT 1;
        """

        print(f"Executing query with facility_id: {facility_id}")
        cur.execute(query, (facility_id.strip(),))
        result = cur.fetchone()

        cur.close()
        conn.close()

        if result is None:
            return jsonify({'error': 'Shop not found'}), 404
        
        if result.get('openingTime'):
            result['openingTime'] = str(result['openingTime'])
        if result.get('closingTime'):
            result['closingTime'] = str(result['closingTime'])
        if result.get('status') is not None:
            result['status'] = "Open" if result['status'] else "Closed"

        

        return jsonify(result)

    except Exception as e:
        import traceback
        traceback.print_exc()  # For debugging only
        return jsonify({'error': str(e)}), 500  # For development use only




@app.route('/api/facility/<string:facility_id>', methods=['GET'])
def get_facility_details(facility_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
       SELECT
    s.shop_id AS id,
    s.shop_name AS name,
    s.shop_image AS photo,
    s.open_status AS "isOpen",
    s."Location" AS location,
    s.latitude,
    s.longitude,
	u.full_name AS "ownerName",

    -- Weekly schedule via lateral join
    COALESCE(ws.weekly_schedule, '[]') AS "weeklySchedule",

    -- Special notice
    (
        SELECT notice_info
        FROM notice
        WHERE shop_id = s.shop_id
        AND (startdate IS NULL OR startdate <= CURRENT_DATE)
        AND (enddate IS NULL OR enddate >= CURRENT_DATE)
        AND (starttime IS NULL OR starttime::time <= CURRENT_TIME::time)
        AND (endtime IS NULL OR endtime::time >= CURRENT_TIME::time)
        ORDER BY priority DESC
        LIMIT 1
    ) AS "specialNotice",

    -- Rating
    (
        SELECT COALESCE(AVG(cr.star_mark), 0)
        FROM client_reviews cr
        WHERE cr.shop_id = s.shop_id
    ) AS rating,

    -- Total reviews
    (
        SELECT COUNT(*)
        FROM client_reviews cr
        WHERE cr.shop_id = s.shop_id
    ) AS totalReviews,

    -- Review list
    COALESCE((
        SELECT json_agg(json_build_object(
            'id', cr.client_id,
            'userName', u.full_name,
            'rating', cr.star_mark,
            'comment', cr.review,
            'date', cr.date
        ) ORDER BY cr.date DESC, cr."time" DESC)
        FROM client_reviews cr
        JOIN client c ON cr.client_id = c.user_id
        JOIN users u ON c.user_id = u.user_id
        WHERE cr.shop_id = s.shop_id
    ), '[]') AS reviews

FROM shop s inner join users u on s.shopowner_id=u.user_id

-- LATERAL JOIN for weekly schedule
-- LATERAL JOIN for weekly schedule
LEFT JOIN LATERAL (
    SELECT json_agg(json_build_object(
        'day', so.day,
        'hours', 
            CASE 
                WHEN so.opening_time IS NULL OR so.closing_time IS NULL 
                THEN 'Closed'
                ELSE CONCAT(to_char(so.opening_time, 'HH24:MI'), ' - ', to_char(so.closing_time, 'HH24:MI'))
            END,
        'isOpen', 
            CASE 
                WHEN so.opening_time IS NULL OR so.closing_time IS NULL 
                THEN FALSE 
                ELSE TRUE 
            END
    ) ORDER BY CASE so.day
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
        WHEN 'Saturday' THEN 6
        WHEN 'Sunday' THEN 7
    END) AS weekly_schedule
    FROM shop_open so
    WHERE so.shop_id = s.shop_id
) ws ON TRUE


WHERE s.shop_id = %s;
        """

        cur.execute(query, (facility_id,))
        result = cur.fetchone()

        if not result:
            return jsonify({'error': 'Facility not found'}), 404

        # Deserialize JSON fields if needed
        def safe_parse_json(value):
            if isinstance(value, str):
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return []
            return value or []

        formatted_result = {
            'id': result.get('id'),
            'name': result.get('name'),
            'photo': result.get('photo'),
            'isOpen': result.get('isOpen'),
            'currentStatus': "Open" if result.get('isOpen') else "Closed",
            'weeklySchedule': safe_parse_json(result.get('weeklySchedule')),
            'specialNotice': result.get('specialNotice'),
            'location': result.get('location'),
            'coordinates': {
                'lat': result.get('latitude'),
                'lng': result.get('longitude')
            },
            'ownerName': result.get('ownerName'),  # Extend here if you plan to pull from shop_owner table
            'rating': round(result.get('rating', 0), 1),
            'totalReviews': result.get('totalReviews', 0),
            'reviews': safe_parse_json(result.get('reviews'))
        }

        return jsonify(formatted_result)

    except psycopg2.Error as db_error:
        print(f"Database error fetching facility details for ID {facility_id}: {db_error}")
        return jsonify({'error': 'Database error fetching facility details'}), 500
    except Exception as e:
        print(f"Unexpected error fetching facility details for ID {facility_id}: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()




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
    
@app.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        print("[DEBUG] Login payload:", data)

        email = data.get('email', '').lower()
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Fetch user by email
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        cur.close()
        conn.close()

        if user is None:
            return jsonify({'error': 'User not found'}), 404

        if not bcrypt.checkpw(password.encode('utf-8'), user['user_password'].encode('utf-8')):
            return jsonify({'error': 'Incorrect password'}), 401


        # Exclude password from response
        user.pop('user_password', None)

        return jsonify({'message': 'Login successful', 'user': user}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Server error'}), 500

    
@app.route('/signup', methods=['POST'])
def signup_client():
    data = request.get_json()

    full_name = data.get('full_name')
    mobile_number = data.get('mobile_number')
    email = data.get('email', '').lower()
    user_password = data.get('user_password')
    index_no = data.get('index_no')
    
    hashed_password = bcrypt.hashpw(user_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    if not all([full_name, mobile_number, email, user_password, index_no]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Start transaction
        cur.execute("""
            INSERT INTO users (full_name, mobile_number, email, user_password, signup_time, signup_date)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING user_id;
        """, (
            full_name,
            mobile_number,
            email,
            hashed_password,
            datetime.now(),
            date.today()
        ))

        user_id = cur.fetchone()[0]

        # Insert into client table
        cur.execute("""
            INSERT INTO client (user_id, index_no)
            VALUES (%s, %s);
        """, (user_id, index_no))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'message': 'Client signed up successfully', 'user_id': user_id}), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        conn.rollback()
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








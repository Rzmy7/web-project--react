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
    
    
# ... (your existing imports and setup)

# @app.route('/api/facility/<string:facility_id>', methods=['GET'])
# def get_facility_details(facility_id):
#     conn = None
#     cur = None
#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

#         query = """
#        SELECT
#     s.shop_id AS id,
#     s.shop_name AS name,
#     s.shop_image AS photo,
#     s.open_status AS isOpen,
#     s."Location" AS location,
#     s.latitude,
#     s.longitude,

#     -- Weekly schedule via lateral join
#     COALESCE(ws.weekly_schedule, '[]') ::json AS weeklySchedule,

#     -- Special notice
#     (
#         SELECT notice_info
#         FROM notice
#         WHERE shop_id = s.shop_id
#         AND (startdate IS NULL OR startdate <= CURRENT_DATE)
#         AND (enddate IS NULL OR enddate >= CURRENT_DATE)
#         AND (starttime IS NULL OR starttime::time <= CURRENT_TIME::time)
#         AND (endtime IS NULL OR endtime::time >= CURRENT_TIME::time)
#         ORDER BY priority DESC
#         LIMIT 1
#     ) AS specialNotice,

#     -- Rating
#     (
#         SELECT COALESCE(AVG(cr.star_mark), 0)
#         FROM client_reviews cr
#         WHERE cr.shop_id = s.shop_id
#     ) AS rating,

#     -- Total reviews
#     (
#         SELECT COUNT(*)
#         FROM client_reviews cr
#         WHERE cr.shop_id = s.shop_id
#     ) AS totalReviews,

#     -- Review list
#     COALESCE((
#         SELECT json_agg(json_build_object(
#             'id', cr.client_id,
#             'userName', u.full_name,
#             'rating', cr.star_mark,
#             'comment', cr.review,
#             'date', cr.date
#         ) ORDER BY cr.date DESC, cr."time" DESC)
#         FROM client_reviews cr
#         JOIN client c ON cr.client_id = c.user_id
#         JOIN users u ON c.user_id = u.user_id
#         WHERE cr.shop_id = s.shop_id
#     ), '[]') AS reviews

# FROM shop s

# -- LATERAL JOIN for weekly schedule
# LEFT JOIN LATERAL (
#     SELECT json_agg(json_build_object(
#         'day', so.day,
#         'hours', CONCAT(to_char(so.opening_time, 'HH24:MI'), ' - ', to_char(so.closing_time, 'HH24:MI')),
#         'isOpen', TRUE
#     ) ORDER BY CASE so.day
#         WHEN 'Monday' THEN 1
#         WHEN 'Tuesday' THEN 2
#         WHEN 'Wednesday' THEN 3
#         WHEN 'Thursday' THEN 4
#         WHEN 'Friday' THEN 5
#         WHEN 'Saturday' THEN 6
#         WHEN 'Sunday' THEN 7
#     END) AS weekly_schedule
#     FROM shop_open so
#     WHERE so.shop_id = s.shop_id
# ) ws ON TRUE

# WHERE s.shop_id = %s;



#         """

#         cur.execute(query, (facility_id,))
#         result = cur.fetchone()

#         if not result:
#             return jsonify({'error': 'Facility not found'}), 404

#         try:
#             formatted_result = {
#                 'id': result.get('id'),
#                 'name': result.get('name'),
#                 'photo': result.get('photo'),
#                 'isOpen': result.get('isOpen'),
#                 'currentStatus': "Open" if result.get('isOpen') else "Closed",
#                 'weeklySchedule': result.get('weeklySchedule', []),
#                 'specialNotice': result.get('specialNotice'),
#                 'location': result.get('location'),
#                 'coordinates': {'lat': result.get('latitude'), 'lng': result.get('longitude')},
#                 'ownerName': None,  # You'll need to fetch this from shop_owner table if needed
#                 'rating': round(result.get('rating', 0), 1),
#                 'totalReviews': result.get('totalReviews', 0),
#                 'reviews': result.get('reviews', [])
#             }
#         except Exception as data_processing_error:
#             print(f"Error processing facility data for ID {facility_id}: {data_processing_error}")
#             return jsonify({'error': 'Error processing facility data'}), 500

#         return jsonify(formatted_result)

#     except psycopg2.Error as db_error:
#         print(f"Database error fetching facility details for ID {facility_id}: {db_error}")
#         return jsonify({'error': 'Database error fetching facility details'}), 500
#     except Exception as e:
#         print(f"Unexpected error fetching facility details for ID {facility_id}: {e}")
#         return jsonify({'error': 'An unexpected error occurred'}), 500
#     finally:
#         if cur:
#             cur.close()
#         if conn:
#             conn.close()



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
    s.open_status AS isOpen,
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
    ) AS specialNotice,

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


WHERE s.shop_id = 'SH01';
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
    
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()

    if not user:
        return jsonify({"error": "Email not found"}), 404

    db_password = user[5]  # adjust index based on your schema

    if not bcrypt.checkpw(password.encode("utf-8"), db_password.encode("utf-8")):
        return jsonify({"error": "Incorrect password"}), 401

    user_data = {
        "name": user[1],
        "email": user[3],
        "indexNumber": user[2],
        "mobileNumber": user[4],
    }

    return jsonify({"message": "Login successful", "user": user_data})

    

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    name = data.get('name')
    index_no = data.get('indexno')
    email = data.get('email')
    mobile = data.get('mobilenumber')
    password = data.get('password')
    signUpTime = data.get('signUpTime')
    signUpDate =  data.get('signUpDate')

    if not all([name, index_no, email, mobile, password]):
        return jsonify({'error': 'All fields are required'}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Check if email already exists
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({'error': 'Email already registered'}), 409

        # Insert new user
        cur.execute("""
            INSERT INTO users (Name, IndexNO, Email, MobileNumber, Password, signupdate, signuptime)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (name, index_no, email, mobile, hashed_pw, signUpDate, signUpTime))


        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
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








import calendar
import re
from flask import Flask, jsonify, make_response, request, render_template, redirect
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import psycopg2
import psycopg2.extras
from datetime import date, time, datetime, timedelta
from dotenv import load_dotenv
import os
from flask_mail import Mail, Message
import bcrypt
from psycopg2.extras import RealDictCursor
import json
import logging
from apscheduler.schedulers.background import BackgroundScheduler
import pytz





def clear_orders_daily():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM food_orders;")
        cur.execute("DELETE FROM juice_orders;")
        cur.execute("DELETE FROM bookaccessories_orders;")
        cur.execute("DELETE FROM shop_alert;")
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Daily order tables cleared.")
    except Exception as e:
        print(f"❌ Error during daily clearing: {e}")

# Schedule the job
scheduler = BackgroundScheduler()
scheduler.add_job(clear_orders_daily, 'cron', hour=0, minute=0)  # Every day at 00:00
scheduler.start()




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

@app.route('/api/places', methods=['GET'])
def get_places():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute("""
            SELECT 
                shop_name AS name,
                latitude AS lat,
                longitude AS lng,
                "Location" AS description
            FROM shop
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
        """)

        rows = cur.fetchall()
        cur.close()
        conn.close()

        # Convert Decimal to float for JavaScript compatibility
        places = [
            {
                'name': row['name'],
                'lat': float(row['lat']),
                'lng': float(row['lng']),
                'description': row['description']
            } for row in rows
        ]

        return jsonify(places)

    except Exception as e:
        return jsonify({'error': str(e)}), 500




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

    -- menuData with custom ordering
    COALESCE((
        SELECT json_agg(category_obj ORDER BY order_index)
        FROM (
            -- 🥘 Grouped Food Categories
            SELECT 
                json_build_object(
                    'id', CONCAT('cat-food-', LOWER(REPLACE(fc.food_catogery, ' ', '_'))),
                    'name', INITCAP(fc.food_catogery),
                    'items', fc.items
                ) AS category_obj,
                CASE 
                    WHEN LOWER(fc.food_catogery) = 'main dishes' THEN 1
                    WHEN LOWER(fc.food_catogery) = 'drinks' THEN 2
                    ELSE 99
                END AS order_index
            FROM (
                SELECT f.food_catogery, json_agg(json_build_object(
                    'id', f.food_id,
                    'name', f.food_name,
                    'price', fh.food_price,
                    'status', CASE 
                        WHEN fh.food_avalability THEN 'available' 
                        ELSE 'unavailable' 
                    END
                )) AS items
                FROM food_has fh
                JOIN food f ON f.food_id = fh.food_id
                WHERE fh.shop_id = s.shop_id
                GROUP BY f.food_catogery
            ) fc
            WHERE fc.items IS NOT NULL

            UNION ALL

            -- 🧃 Juice Items
            SELECT 
                json_build_object(
                    'id', 'cat-juice',
                    'name', 'Juice Items',
                    'items', juice_items
                ) AS category_obj,
                3 AS order_index
            FROM (
                SELECT json_agg(json_build_object(
                    'id', j.juice_id,
                    'name', j.juice_name,
                    'price', jh.juice_price,
                    'status', CASE 
                        WHEN jh.juice_avalability THEN 'available' 
                        ELSE 'unavailable' 
                    END
                )) AS juice_items
                FROM juice_bar jb
                JOIN juice_has jh ON jb.jshop_id = jh.shop_id
                JOIN juice j ON j.juice_id = jh.juice_id
                WHERE jb.jshop_id = s.shop_id
            ) sub
            WHERE juice_items IS NOT NULL

            UNION ALL

            -- 📚 Book Accessories
            SELECT 
                json_build_object(
                    'id', 'cat-books',
                    'name', 'Book Accessories',
                    'items', book_items
                ) AS category_obj,
                4 AS order_index
            FROM (
                SELECT json_agg(json_build_object(
                    'id', b.baccc_id,
                    'name', b.bacc_name,
                    'price', bh.bacc_price,
                    'status', CASE 
                        WHEN bh.bacc_avalability THEN 'available' 
                        ELSE 'unavailable' 
                    END
                )) AS book_items
                FROM bookshop bs
                JOIN bookaccessories_has bh ON bs.bshop_id = bh.shop_id
                JOIN book_accassaries b ON b.baccc_id = bh.bacc_id
                WHERE bs.bshop_id = s.shop_id
            ) sub
            WHERE book_items IS NOT NULL

        ) category_union
    ), '[]') AS "menuData"

FROM shop s
LEFT JOIN shop_open so 
    ON so.shop_id = s.shop_id AND so.day = to_char(CURRENT_DATE, 'FMDay')
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
        'dateTime', to_char(cr."time", 'YYYY-MM-DD"T"HH24:MI:SS')
    ) ORDER BY cr."time" DESC)
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

        # Join users + client tables
        cur.execute("""
            SELECT u.user_id, u.full_name, u.email, u.mobile_number, c.index_no, u.user_password
            FROM users u
            JOIN client c ON c.user_id = u.user_id
            WHERE u.email = %s
        """, (email,))
        user = cur.fetchone()

        cur.close()
        conn.close()

        if user is None:
            return jsonify({'error': 'User not found'}), 404

        if not bcrypt.checkpw(password.encode('utf-8'), user['user_password'].encode('utf-8')):
            return jsonify({'error': 'Incorrect password'}), 401

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
    
    
@app.route('/api/place_order', methods=['POST'])
def place_order():
    data = request.get_json()

    client_id = data.get('client_id')
    item_id = data.get('item_id')
    item_name = data.get('item_name')
    shop_id = data.get('shop_id')
    quantity = data.get('quantity')
    notes = data.get('notes', "")
    order_time = datetime.now()

    if not all([client_id, item_id, item_name, shop_id, quantity]):
        return jsonify({'status': 'failure', 'message': 'Missing required fields'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Check food item
        cur.execute("SELECT food_id FROM food WHERE food_id = %s AND food_name = %s", (item_id, item_name))
        if cur.fetchone():
            item_type = 'food'
            cur.execute("""
                INSERT INTO food_orders (client_id, food_id, fshop_id, time, quantity, notes, order_status)
                VALUES (%s, %s, %s, %s, %s, %s,%s)
            """, (client_id, item_id, shop_id, order_time, quantity, notes,'pending'))

        else:
            # Check juice item
            cur.execute("SELECT juice_id FROM juice WHERE juice_id = %s AND juice_name = %s", (item_id, item_name))
            if cur.fetchone():
                item_type = 'juice'
                cur.execute("""
                    INSERT INTO juice_orders (client_id, juice_id, jshop_id, time, quantity, notes, order_status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (client_id, item_id, shop_id, order_time, quantity, notes, 'pending'))

            else:
                # Check book/accessory item
                cur.execute("SELECT baccc_id FROM book_accassaries WHERE baccc_id = %s AND baccc_name = %s", (item_id, item_name))
                if cur.fetchone():
                    item_type = 'book'
                    cur.execute("""
                        INSERT INTO bookaccessories_orders (client_id, bacc_id, bshop_id, time, quantity, notes, order_status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (client_id, item_id, shop_id, order_time, quantity, notes,'pending'))
                else:
                    return jsonify({'status': 'failure', 'message': 'Invalid item_id or item_name'}), 400

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'status': 'success', 'message': f'{item_type.capitalize()} order placed successfully'}), 200

    except Exception as e:
        print(f"Error placing order: {e}")
        return jsonify({'status': 'failure', 'message': str(e)}), 500



@app.route('/reviews', methods=['POST'])
def create_review():
    data = request.get_json()

    required_fields = ['client_id', 'shop_id', 'time']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields: client_id, shop_id, time'}), 400

    try:
        client_id = data['client_id']
        shop_id = data['shop_id']
        review = data.get('review')
        star_mark = data.get('star_mark')
        time_str = data.get('time')  # 'YYYY-MM-DD HH:MM:SS'

        print("Original received time (UTC):", time_str)

        time_obj = datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S') if time_str else datetime.utcnow()

        # Add 5 hours 30 minutes for Sri Lanka (UTC+5:30)
        # time_obj = time_obj + timedelta(hours=5, minutes=30)

        print("Time after +5:30 offset:", time_obj)

        # Optional: store date separately
        date_obj = time_obj.date()

        conn = get_db_connection()
        cur = conn.cursor()

        insert_query = """
            INSERT INTO client_reviews (client_id, shop_id, date, time, review, star_mark)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cur.execute(insert_query, (client_id, shop_id, date_obj, time_obj, review, star_mark))
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({'message': 'Review added successfully'}), 201

    except Exception as e:
        print("Insert review error:", e)
        return jsonify({'error': str(e)}), 500
    




    
# @app.route('/api/alerts/<string:facility_id>', methods=['GET'])
# def get_alerts(facility_id):
#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=RealDictCursor)
        
#         # Fetch alerts for the specific facility_id
#         cur.execute("SELECT * FROM shop_alert WHERE shop_id = %s ORDER BY time DESC", (facility_id,))
        
#         alerts = cur.fetchall()
#         cur.close()
#         conn.close()
        
#         return jsonify(alerts)
#     except Exception as e:
#         print(f"Error fetching alerts: {e}")
#         return jsonify({'error': str(e)}), 500    
    

# @app.route('/api/add_alert', methods=['POST'])
# def add_alert():
#     data = request.json
#     shop_id = data.get('shop_id')
#     alert = data.get('alert')

#     if not shop_id or not alert:
#         return jsonify({'error': 'shop_id and alert are required'}), 400

#     try:
#         conn = get_db_connection()
#         cur = conn.cursor()

#         # Get the current time in Asia/Kolkata time zone
#         kolkata_tz = pytz.timezone('Asia/Kolkata')
#         current_time = datetime.now(kolkata_tz).strftime("%Y-%m-%d %H:%M:%S")

#         cur.execute("INSERT INTO shop_alert (shop_id, alert, time) VALUES (%s, %s, %s)", (shop_id, alert, current_time))
#         conn.commit()
#         cur.close()
#         conn.close()

#         # Emit the new alert to all connected clients via Socket.IO
#         from app import socketio
#         socketio.emit('new_alert', {'shop_id': shop_id, 'alert': alert, 'time': current_time})

#         return jsonify({'message': 'Alert added successfully'}), 201
#     except Exception as e:
#         print(f"Error adding alert: {e}")
#         return jsonify({'error': str(e)}), 500

    
    
@app.route('/api/alerts/<string:facility_id>', methods=['GET'])
def get_alerts(facility_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Fetch alerts without id column
        cur.execute("SELECT shop_id, alert, time FROM shop_alert WHERE shop_id = %s ORDER BY time DESC", (facility_id,))
        alerts = cur.fetchall()
        
        # Convert time to RFC 2822 for frontend
        for alert in alerts:
            alert['time'] = alert['time'].astimezone(pytz.UTC).strftime("%a, %d %b %Y %H:%M:%S GMT")
        
        cur.close()
        conn.close()
        return jsonify(alerts)
    except Exception as e:
        print(f"Error fetching alerts for facility_id {facility_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/add_alert', methods=['POST'])
def add_alert():
    data = request.json
    shop_id = data.get('shop_id')
    alert = data.get('alert')

    if not shop_id or not alert:
        return jsonify({'error': 'shop_id and alert are required'}), 400

    try:
        # Get current time in Asia/Kolkata
        kolkata_tz = pytz.timezone('Asia/Kolkata')
        current_time = datetime.now(kolkata_tz)

        # Prepare alert data for broadcast (RFC 2822 time)
        alert_data = {
            'shop_id': shop_id,
            'alert': alert,
            'time': current_time.astimezone(pytz.UTC).strftime("%a, %d %b %Y %H:%M:%S GMT")
        }

        # Broadcast to all clients first
        socketio.emit('new_alert', alert_data)

        # Then save to database
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO shop_alert (shop_id, alert, time) VALUES (%s, %s, %s)",
            (shop_id, alert, current_time)
        )
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'message': 'Alert added successfully'}), 201
    except Exception as e:
        print(f"Error adding alert for shop_id {shop_id}: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders/<int:client_id>', methods=['GET'])
def get_orders(client_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Fetch food orders
        cur.execute("""
            SELECT 
                fo.client_id,
                fo.food_id AS item_id,
                fo.fshop_id AS shop_id,
                fo.time,
                fo.quantity,
                fo.notes,
                fo.order_status,
                f.food_name AS item_name,
                s.shop_name,
                CAST(fh.food_price AS NUMERIC) AS price
            FROM food_orders fo
            JOIN food f ON fo.food_id = f.food_id
            JOIN food_canteen fc ON fo.fshop_id = fc.fshop_id
            JOIN shop s ON fc.fshop_id = s.shop_id
            JOIN food_has fh ON fo.food_id = fh.food_id AND fo.fshop_id = fh.shop_id
            WHERE fo.client_id = %s
        """, (client_id,))
        food_orders = cur.fetchall()

        # Fetch juice orders
        cur.execute("""
            SELECT 
                jo.client_id,
                jo.juice_id AS item_id,
                jo.jshop_id AS shop_id,
                jo.time,
                jo.quantity,
                jo.notes,
                jo.order_status,
                j.juice_name AS item_name,
                s.shop_name,
                CAST(jh.juice_price AS NUMERIC) AS price
            FROM juice_orders jo
            JOIN juice j ON jo.juice_id = j.juice_id
            JOIN juice_bar jb ON jo.jshop_id = jb.jshop_id
            JOIN shop s ON jb.jshop_id = s.shop_id
            JOIN juice_has jh ON jo.juice_id = jh.juice_id AND jo.jshop_id = jh.shop_id
            WHERE jo.client_id = %s
        """, (client_id,))
        juice_orders = cur.fetchall()

        # Fetch book accessories orders
        cur.execute("""
            SELECT 
                bo.client_id,
                bo.bacc_id AS item_id,
                bo.bshop_id AS shop_id,
                bo.time,
                bo.quantity,
                bo.notes,
                bo.order_status,
                ba.bacc_name AS item_name,
                s.shop_name,
                CAST(bah.bacc_price AS NUMERIC) AS price
            FROM bookaccessories_orders bo
            JOIN book_accassaries ba ON bo.bacc_id = ba.baccc_id
            JOIN bookshop bs ON bo.bshop_id = bs.bshop_id
            JOIN shop s ON bs.bshop_id = s.shop_id
            JOIN bookaccessories_has bah ON bo.bacc_id = bah.bacc_id AND bo.bshop_id = bah.shop_id
            WHERE bo.client_id = %s
        """, (client_id,))
        book_orders = cur.fetchall()

        # Combine and convert types
        all_orders = food_orders + juice_orders + book_orders
        all_orders = [convert_types(order) for order in all_orders]

        cur.close()
        conn.close()
        return jsonify(all_orders), 200
    except Exception as e:
        print(f"Error fetching orders: {e}")
        return jsonify({"error": "Failed to fetch orders"}), 500

@app.route('/api/orders/cancel', methods=['POST'])
def cancel_order():
    try:
        data = request.get_json()
        client_id = data.get('client_id')
        item_id = data.get('item_id')
        shop_id = data.get('shop_id')
        time = data.get('time')
        order_type = data.get('order_type')

        if not all([client_id, item_id, shop_id, time, order_type]):
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        if order_type == 'food':
            cur.execute("""
                DELETE FROM food_orders
                WHERE client_id = %s AND food_id = %s AND fshop_id = %s AND time = %s
                RETURNING client_id;
            """, (client_id, item_id, shop_id, time))
        elif order_type == 'juice':
            cur.execute("""
                DELETE FROM juice_orders
                WHERE client_id = %s AND juice_id = %s AND jshop_id = %s AND time = %s
                RETURNING client_id;
            """, (client_id, item_id, shop_id, time))
        elif order_type == 'bookaccessories':
            cur.execute("""
                DELETE FROM bookaccessories_orders
                WHERE client_id = %s AND bacc_id = %s AND bshop_id = %s AND time = %s
                RETURNING client_id;
            """, (client_id, item_id, shop_id, time))
        else:
            return jsonify({"error": "Invalid order_type"}), 400

        deleted = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        if deleted:
            return jsonify({"message": "Order cancelled successfully"}), 200
        else:
            return jsonify({"error": "Order not found"}), 404
    except Exception as e:
        print(f"Error cancelling order: {e}")
        return jsonify({"error": "Failed to cancel order"}), 500

    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
#-----------------shop-Owner----------------------------
@app.route('/shop-owner-login', methods=['POST'])
def login_shop_owner():
    try:
        data = request.get_json()
        email = data.get('email', '').lower()
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # JOIN users with shop_owner
        cur.execute("""
            SELECT u.user_id, u.full_name, u.email, u.user_password,s.shop_id
            FROM users u
            JOIN shop s ON s.shopowner_id = u.user_id
            WHERE u.email = %s
        """, (email,))
        shop_owner = cur.fetchone()

        cur.close()
        conn.close()

        if shop_owner is None:
            return jsonify({'error': 'Shop owner not found'}), 404

        # Plain-text password comparison (not secure)
        if shop_owner['user_password'] != password:
            return jsonify({'error': 'Incorrect password'}), 401

        # Remove password before sending response
        shop_owner.pop('user_password', None)

        return jsonify({'message': 'Shop owner login successful', 'shop_owner': shop_owner}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Server error'}), 500
    



def convert_types(data):
    """Convert datetime.time to JSON-serializable strings."""
    if not data:
        return None
    result = dict(data)
    for key, value in result.items():
        if isinstance(value, time):
            result[key] = str(value)  # Convert time to string (e.g., "07:00:00")
    return result
    

@app.route('/api/shopOwnerP1/<shop_id>', methods=['GET'])
def get_shop_details(shop_id):
    try:
        # Validate shop_id (e.g., "SH01")
        if not shop_id or not re.match(r'^SH\d+$', shop_id):
            return jsonify({"error": "Invalid shop_id, must be a string like 'SH01'"}), 400

        # Connect to database
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        tz = pytz.timezone('Asia/Kolkata')
        current_date = datetime.now(tz)
        current_day = calendar.day_name[current_date.weekday()]

        # Execute query
        cur.execute("""
            SELECT 
                u.full_name,
                s.shop_name,
                s.shopowner_id,
				s.shop_image,
                s.open_status,
                s."Location",
                so_open.opening_time,
                so_open.closing_time
            FROM 
                users u
                INNER JOIN shop_owner so ON u.user_id = so.user_id
                INNER JOIN shop s ON so.user_id = s.shopowner_id
                INNER JOIN shop_open so_open ON s.shop_id = so_open.shop_id
            WHERE 
                s.shop_id = %s
                AND so_open.day = %s
        """, (shop_id, current_day))
        shop_details = cur.fetchone()

        # Close database connection
        cur.close()
        conn.close()

        # Check if data exists
        if not shop_details:
            return jsonify({"error": "No data found for the given shop_id"}), 404
        
        shop_details = convert_types(shop_details)
        return jsonify(shop_details), 200
    except Exception as e:
        print(f"Error fetching shop details: {e}")
        if 'conn' in locals():
            conn.close()
        return jsonify({"error": "Failed to fetch shop details", "details": str(e)}), 500

    
@app.route('/api/stats/<shop_id>', methods=['GET'])
def get_shop_stats(shop_id):
    try:
        # Validate shop_id (e.g., "SH01")
        if not shop_id or not re.match(r'^SH\d+$', shop_id):
            return jsonify({"error": "Invalid shop_id, must be a string like 'SH01'"}), 400

        # Connect to database
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Execute query
        cur.execute("""
            SELECT 
                -- Count all available items (food + juice + book accessories)
                (
                    SELECT COUNT(*) 
                    FROM food_has fh 
                    JOIN food_canteen fc ON fh.shop_id = fc.fshop_id 
                    WHERE fc.fshop_id = %s AND fh.food_avalability = true
                ) + (
                    SELECT COUNT(*) 
                    FROM juice_has jh 
                    JOIN juice_bar jb ON jh.shop_id = jb.jshop_id 
                    WHERE jb.jshop_id = %s AND jh.juice_avalability = true
                ) + (
                    SELECT COUNT(*) 
                    FROM bookaccessories_has bh 
                    JOIN bookshop bs ON bh.shop_id = bs.bshop_id 
                    WHERE bs.bshop_id = %s AND bh.bacc_avalability = true
                ) AS available_items,
                
                -- Count all pending orders (food + juice + book accessories)
                (
                    SELECT COUNT(*) 
                    FROM food_orders 
                    WHERE fshop_id = %s AND order_status = 'pending'
                ) + (
                    SELECT COUNT(*) 
                    FROM juice_orders 
                    WHERE jshop_id = %s AND order_status = 'pending'
                ) + (
                    SELECT COUNT(*) 
                    FROM bookaccessories_orders 
                    WHERE bshop_id = %s AND order_status = 'pending'
                ) AS pending_orders,
                
                -- Sum all completed order quantities (food + juice + book accessories)
                (
                    SELECT COALESCE(COUNT(quantity), 0) 
                    FROM food_orders 
                    WHERE fshop_id = %s AND order_status = 'completed'
                ) + (
                    SELECT COALESCE(COUNT(quantity), 0) 
                    FROM juice_orders 
                    WHERE jshop_id = %s AND order_status = 'completed'
                ) + (
                    SELECT COALESCE(COUNT(quantity), 0) 
                    FROM bookaccessories_orders 
                    WHERE bshop_id = %s AND order_status = 'completed'
                ) AS completed_quantity,
                
                -- Calculate total revenue from completed orders
                (
                    SELECT COALESCE(SUM(fo.quantity * CAST(fh.food_price AS numeric)), 0)
                    FROM food_orders fo
                    JOIN food_has fh ON fo.food_id = fh.food_id AND fo.fshop_id = fh.shop_id
                    WHERE fo.fshop_id = %s 
                    AND fo.order_status = 'completed'
                    AND fh.food_price ~ '^[0-9]+(\.[0-9]+)?$'
                ) + (
                    SELECT COALESCE(SUM(jo.quantity * CAST(jh.juice_price AS numeric)), 0)
                    FROM juice_orders jo
                    JOIN juice_has jh ON jo.juice_id = jh.juice_id AND jo.jshop_id = jh.shop_id
                    WHERE jo.jshop_id = %s
                    AND jo.order_status = 'completed'
                    AND jh.juice_price ~ '^[0-9]+(\.[0-9]+)?$'
                ) + (
                    SELECT COALESCE(SUM(bo.quantity * CAST(bh.bacc_price AS numeric)), 0)
                    FROM bookaccessories_orders bo
                    JOIN bookaccessories_has bh ON bo.bacc_id = bh.bacc_id AND bo.bshop_id = bh.shop_id
                    WHERE bo.bshop_id = %s
                    AND bo.order_status = 'completed'
                    AND bh.bacc_price ~ '^[0-9]+(\.[0-9]+)?$'
                ) AS total_revenue;
        """, (shop_id, shop_id, shop_id, shop_id, shop_id, shop_id, shop_id, shop_id, shop_id, shop_id, shop_id, shop_id))
        stats = cur.fetchone()

        # Close database connection
        cur.close()
        conn.close()

        # Check if data exists
        if not stats:
            return jsonify({"error": "No stats found for the given shop_id"}), 404

        # Convert types for JSON serialization
        stats = convert_types(stats)

        return jsonify(stats), 200
    except Exception as e:
        print(f"Error fetching shop stats: {e}")
        if 'conn' in locals():
            conn.close()
        return jsonify({"error": "Failed to fetch shop stats", "details": str(e)}), 500



@app.route('/api/shop/<shop_id>/OpenStatusChanger', methods=['PATCH'])
def update_shop_status(shop_id):
    try:
        # Validate shop_id (e.g., "SH01")
        if not shop_id or not re.match(r'^SH\d+$', shop_id):
            return jsonify({"error": "Invalid shop_id, must be a string like 'SH01'"}), 400

        # Validate JSON payload
        data = request.get_json()
        if not data or 'is_open' not in data or not isinstance(data['is_open'], bool):
            return jsonify({"error": "Invalid payload, must include 'is_open' as a boolean"}), 400

        is_open = data['is_open']

        # Connect to database
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Update open_status
        cur.execute("""
            UPDATE shop
            SET open_status = %s
            WHERE shop_id = %s
            RETURNING open_status
        """, (is_open, shop_id))
        result = cur.fetchone()

        # Commit the transaction
        conn.commit()

        # Close database connection
        cur.close()
        conn.close()

        # Check if shop exists
        if not result:
            return jsonify({"error": "No shop found for the given shop_id"}), 404

        return jsonify({"open_status": result['open_status']}), 200
    except Exception as e:
        print(f"Error updating shop status: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return jsonify({"error": "Failed to update shop status", "details": str(e)}), 500


@app.route('/api/shop/<shop_id>/OpenStatus', methods=['GET'])
def get_shop_status(shop_id):
    try:
        # Validate shop_id (e.g., "SH01")
        if not shop_id or not re.match(r'^SH\d+$', shop_id):
            return jsonify({"error": "Invalid shop_id, must be a string like 'SH01'"}), 400

        # Connect to database
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Execute query
        cur.execute("SELECT open_status FROM shop WHERE shop_id = %s", (shop_id,))
        result = cur.fetchone()

        # Close database connection
        cur.close()
        conn.close()

        # Check if shop exists
        if not result:
            return jsonify({"error": "No shop found for the given shop_id"}), 404

        return jsonify({"open_status": result['open_status']}), 200
    except Exception as e:
        print(f"Error fetching shop status: {e}")
        if 'conn' in locals():
            conn.close()
        return jsonify({"error": "Failed to fetch shop status", "details": str(e)}), 500

def format_price(price):
    """Convert varchar price to LKR X.00 format."""
    try:
        # Remove any non-numeric characters except decimal point
        cleaned_price = ''.join(c for c in price if c.isdigit() or c == '.')
        numeric_price = float(cleaned_price)
        return f"LKR {numeric_price:.2f}"
    except (ValueError, TypeError):
        return "LKR 0.00"  # Fallback for invalid prices

@app.route('/api/shop/<shop_id>/FacilityItems', methods=['GET'])
def get_shop_items(shop_id):
    try:
        if not shop_id or not re.match(r'^SH\d+$', shop_id):
            return jsonify({"error": "Invalid shop_id, must be a string like 'SH06'"}), 400

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Fetch food items
        cur.execute("""
            SELECT fh.food_id AS id, f.food_name AS name, fh.food_price AS price, fh.food_avalability AS availability
            FROM food_has fh
            JOIN food f ON fh.food_id = f.food_id
            WHERE fh.shop_id = %s AND fh.food_avalability = true
        """, (shop_id,))
        food_items = [
            {
                "id": item['id'],
                "name": item['name'],
                "price": format_price(item['price']),
                "type": "Main Dishes",
                "availability": item['availability']
            }
            for item in cur.fetchall()
        ]

        # Fetch juice items
        cur.execute("""
            SELECT jh.juice_id AS id, j.juice_name AS name, jh.juice_price AS price, jh.juice_avalability AS availability
            FROM juice_has jh
            JOIN juice j ON jh.juice_id = j.juice_id
            WHERE jh.shop_id = %s AND jh.juice_avalability = true
        """, (shop_id,))
        juice_items = [
            {
                "id": item['id'],
                "name": item['name'],
                "price": format_price(item['price']),
                "type": "Drinks",
                "availability": item['availability']
            }
            for item in cur.fetchall()
        ]

        # Fetch book accessories
        cur.execute("""
            SELECT bh.bacc_id AS id, b.bacc_name AS name, bh.bacc_price AS price, bh.bacc_avalability AS availability
            FROM bookaccessories_has bh
            JOIN book_accassaries b ON bh.bacc_id = b.baccc_id
            WHERE bh.shop_id = %s AND bh.bacc_avalability = true
        """, (shop_id,))
        book_items = [
            {
                "id": item['id'],
                "name": item['name'],
                "price": format_price(item['price']),
                "type": "Stationery",
                "availability": item['availability']
            }
            for item in cur.fetchall()
        ]

        cur.close()
        conn.close()

        categories = [
            {"title": "canteen products", "items": food_items},
            {"title": "juice bar products", "items": juice_items},
            {"title": "bookshop accessories", "items": book_items}
        ]

        return jsonify(categories), 200
    except Exception as e:
        print(f"Error fetching shop items: {e}")
        if 'conn' in locals():
            conn.close()
        return jsonify({"error": "Failed to fetch shop items", "details": str(e)}), 500


def update_item_availability(shop_id, category, item_id):
    try:
        # Validate shop_id
        if not shop_id or not re.match(r'^SH\d+$', shop_id):
            return jsonify({"error": "Invalid shop_id, must be a string like 'SH06'"}), 400

        # Validate category
        valid_categories = ['food', 'juice', 'book']
        if category not in valid_categories:
            return jsonify({"error": "Invalid category, must be 'food', 'juice', or 'book'"}), 400

        # Validate item_id
        try:
            item_id = int(item_id)
        except ValueError:
            return jsonify({"error": "Invalid item_id value, must be an integer"}), 400

        # Validate JSON payload
        data = request.get_json()
        if not data or 'availability' not in data or not isinstance(data['availability'], bool):
            return jsonify({"error": "Invalid payload, must include 'availability' as a boolean"}), 400

        availability = data['availability']

        # Connect to database
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Update availability based on category
        if category == 'food':
            cur.execute("""
                UPDATE food_has
                SET food_availability = %s
                WHERE shop_id = %s AND food_id = %s
                RETURNING food_availability AS availability
            """, (availability, shop_id, item_id))
        elif category == 'juice':
            cur.execute("""
                UPDATE juice_has
                SET juice_availability = %s
                WHERE shop_id = %s AND juice_id = %s
                RETURNING juice_availability AS availability
            """, (availability, shop_id, item_id))
        else:  # book
            cur.execute("""
                UPDATE bookaccessories_has
                SET bacc_availability = %s
                WHERE shop_id = %s% AND bacc_id = %s
                RETURNING bacc_availability AS availability
            """, (availability, shop_id, item_id))

        result = cur.fetchone()

        # Commit transaction
        conn.commit()

        # Close connection
        cur.close()
        conn.close()

        if not result:
            return jsonify({"error": "Item not found for the given shop_id and item_id"}), 404

        return jsonify({"availability": result['availability']}), 200
    except Exception as e:
        print(f"Error updating item availability: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return jsonify({"error": "Failed to update item availability", "details": str(e)}), 500


@app.route('/api/shop/<shop_id>/item/<category>/<item_id>', methods=['DELETE'])
def delete_item(shop_id, category, item_id):
    try:
        if not shop_id or not re.match(r'^SH\d+$', shop_id):
            return jsonify({"error": "Invalid shop_id, must be a string like 'SH06'"}), 400

        valid_categories = ['food', 'juice', 'book']
        if category not in valid_categories:
            return jsonify({"error": "Invalid category, must be 'food', 'juice', or 'book'"}), 400

        try:
            item_id = int(item_id)
        except ValueError:
            return jsonify({"error": "Invalid item_id, must be an integer"}), 400

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        if category == 'food':
            cur.execute("DELETE FROM food_has WHERE shop_id = %s AND food_id = %s", (shop_id, item_id))
            cur.execute("DELETE FROM food WHERE food_id = %s", (item_id,))
        elif category == 'juice':
            cur.execute("DELETE FROM juice_has WHERE shop_id = %s AND juice_id = %s", (shop_id, item_id))
            cur.execute("DELETE FROM juice WHERE juice_id = %s", (item_id,))
        else:  # book
            cur.execute("DELETE FROM bookaccessories_has WHERE shop_id = %s AND bacc_id = %s", (shop_id, item_id))
            cur.execute("DELETE FROM book_accassaries WHERE baccc_id = %s", (item_id,))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Item deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting item: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return jsonify({"error": "Failed to delete item", "details": str(e)}), 500
































    
    
    
    
    
    
    
    
    
    

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








from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print("✅ Connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("❌ Disconnected")

if __name__ == '__main__':
    socketio.run(app, port=8001)

from flask import Flask, request, render_template, redirect, session, url_for, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from twilio.rest import Client
import os

app = Flask(__name__, static_folder='static')
app.secret_key = 'your_secret_key'

# Ensure the video directory exists
video_dir = os.path.join(app.static_folder, 'video')
os.makedirs(video_dir, exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Twilio config
TWILIO_SID = 'ACb681237320c3d54da4eceee89259de58'
TWILIO_AUTH_TOKEN = '161233ff12393d3007b1004824c9ac82'
TWILIO_PHONE = '+17408313221'

client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    contact_number = db.Column(db.String(15), nullable=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        contact = request.form['contact']
        
        if not contact.startswith("+91"):
            contact = "+91" + contact

        if User.query.filter_by(username=username).first():
            flash('Username already exists!')
            return redirect('/register')
        user = User(username=username, password=password, contact_number=contact)
        db.session.add(user)
        db.session.commit()
        flash('Registered successfully!')
        return redirect('/login')
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username, password=password).first()
        if user:
            session['username'] = username
            return redirect('/dashboard')
        flash('Invalid credentials')
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect('/login')
    return render_template('dashboard.html')

@app.route('/sos', methods=['POST'])
def sos():
    if 'username' not in session:
        return 'Unauthorized', 401
    data = request.get_json()
    lat = data['latitude']
    lon = data['longitude']
    user = User.query.filter_by(username=session['username']).first()
    msg = f"🚨 EMERGENCY ALERT 🚨\nName: {user.username}\nLocation: https://maps.google.com/?q={lat},{lon}"
    client.messages.create(to=user.contact_number, from_=TWILIO_PHONE, body=msg)
    return '', 204

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

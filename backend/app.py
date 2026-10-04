"""
Flask REST API for Landslide Detection from Satellite Imagery
"""

import os
import uuid
import hashlib
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

from database import get_db_connection, init_db
from pipeline import pipeline

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper to hash passwords
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

# ----------------- AUTH ENDPOINTS -----------------

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"error": "User with this email already exists"}), 409

    user_id = f"USR-{uuid.uuid4().hex[:8].upper()}"
    pwd_hash = hash_password(password)

    cursor.execute(
        "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
        (user_id, name, email, pwd_hash)
    )
    conn.commit()
    conn.close()

    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "role": "Geospatial Analyst",
            "createdAt": datetime.utcnow().isoformat()
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user or user['password_hash'] != hash_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user['id'],
            "name": user['name'],
            "email": user['email'],
            "role": user['role'],
            "createdAt": user['created_at']
        }
    })

# ----------------- PREDICTION ENDPOINTS -----------------

@app.route('/api/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided in request"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Save uploaded file
    file_id = f"PRED-{uuid.uuid4().hex[:8].upper()}"
    filename = f"{file_id}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        pil_image = Image.open(filepath).convert('RGB')
    except Exception as e:
        return jsonify({"error": f"Invalid image format: {str(e)}"}), 400

    # Run AI pipeline
    result = pipeline.classify(pil_image)

    # Persist in SQLite
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO predictions (
            id, image_name, image_path, image_size, prediction, confidence, risk_level,
            processing_time_ms, location_name, terrain_roughness, gabor_energy,
            vegetation_ndvi, soil_displacement
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        file_id,
        file.filename,
        filepath,
        os.path.getsize(filepath),
        result['prediction'],
        result['confidence'],
        result['riskLevel'],
        result['processingTime'],
        request.form.get('location', 'Survey Sector'),
        result['features']['terrainRoughness'],
        result['features']['gaborTextureEnergy'],
        result['features']['vegetationIndexNDVI'],
        result['features']['soilDisplacementIndex']
    ))

    # If landslide detected, generate alert automatically
    if result['prediction'] == 'landslide':
        alert_id = f"ALERT-{uuid.uuid4().hex[:6].upper()}"
        alert_title = "Landslide Risk Detected" if result['riskLevel'] != 'critical' else "Critical Debris Avalanche Risk"
        cursor.execute("""
            INSERT INTO alerts (id, prediction_id, alert_type, title, message, status, severity, location_name)
            VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
        """, (
            alert_id,
            file_id,
            'landslide_hazard',
            alert_title,
            f"Satellite analysis identified landslide characteristics with {result['confidence']*100:.2f}% confidence.",
            'critical' if result['riskLevel'] == 'critical' else 'high',
            request.form.get('location', 'Survey Sector')
        ))

    conn.commit()
    conn.close()

    return jsonify({
        "prediction": result['prediction'],
        "confidence": result['confidence'],
        "riskLevel": result['riskLevel'],
        "processingTime": result['processingTime'],
        "imageId": file_id,
        "features": result['features'],
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM predictions ORDER BY created_at DESC LIMIT 100")
    rows = cursor.fetchall()
    conn.close()

    predictions = []
    for r in rows:
        predictions.append({
            "id": r['id'],
            "imageName": r['image_name'],
            "imageSize": r['image_size'],
            "imageUrl": f"/uploads/{os.path.basename(r['image_path'])}",
            "prediction": r['prediction'],
            "confidence": r['confidence'],
            "riskLevel": r['risk_level'],
            "processingTime": r['processing_time_ms'],
            "createdAt": r['created_at'],
            "locationName": r['location_name'],
            "status": "completed",
            "features": {
                "terrainRoughness": r['terrain_roughness'],
                "gaborTextureEnergy": r['gabor_energy'],
                "vegetationIndexNDVI": r['vegetation_ndvi'],
                "soilDisplacementIndex": r['soil_displacement']
            }
        })

    return jsonify(predictions)

@app.route('/api/predictions/<string:pred_id>', methods=['GET'])
def get_prediction_by_id(pred_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM predictions WHERE id = ?", (pred_id,))
    r = cursor.fetchone()
    conn.close()

    if not r:
        return jsonify({"error": "Prediction not found"}), 404

    return jsonify({
        "id": r['id'],
        "imageName": r['image_name'],
        "prediction": r['prediction'],
        "confidence": r['confidence'],
        "riskLevel": r['risk_level'],
        "processingTime": r['processing_time_ms'],
        "createdAt": r['created_at'],
        "locationName": r['location_name'],
        "features": {
            "terrainRoughness": r['terrain_roughness'],
            "gaborTextureEnergy": r['gabor_energy'],
            "vegetationIndexNDVI": r['vegetation_ndvi'],
            "soilDisplacementIndex": r['soil_displacement']
        }
    })

# ----------------- ALERTS ENDPOINTS -----------------

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    alerts = []
    for r in rows:
        alerts.append({
            "id": r['id'],
            "predictionId": r['prediction_id'],
            "alertType": r['alert_type'],
            "title": r['title'],
            "message": r['message'],
            "status": r['status'],
            "severity": r['severity'],
            "locationName": r['location_name'],
            "createdAt": r['created_at'],
            "acknowledgedAt": r['acknowledged_at'],
            "acknowledgedBy": r['acknowledged_by']
        })
    return jsonify(alerts)

@app.route('/api/alerts/<string:alert_id>/acknowledge', methods=['POST'])
def acknowledge_alert(alert_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        UPDATE alerts
        SET status = 'acknowledged', acknowledged_at = ?, acknowledged_by = 'Authorized Operator'
        WHERE id = ?
    """, (now, alert_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Alert acknowledged", "id": alert_id, "timestamp": now})

# ----------------- ANALYTICS & MODEL INFO -----------------

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total, SUM(CASE WHEN prediction = 'landslide' THEN 1 ELSE 0 END) as ls, AVG(confidence) as avg_conf FROM predictions")
    stats = cursor.fetchone()
    conn.close()

    total = stats['total'] or 0
    landslides = stats['ls'] or 0
    non_ls = total - landslides
    avg_conf = round((stats['avg_conf'] or 0.96) * 100, 2)

    return jsonify({
        "totalAnalyzed": total,
        "landslidesDetected": landslides,
        "nonLandslides": non_ls,
        "averageConfidence": avg_conf,
        "reportedAccuracy": 96.58
    })

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    return jsonify({
        "name": "Landslide-Net Hybrid VGG19-Gabor-ResNet101",
        "version": "2.4.0",
        "featureExtractor": "VGG19 + Multi-scale Gabor Filter Bank",
        "classifier": "ResNet101 Deep Residual Classifier",
        "reportedAccuracy": 96.58,
        "inputDimensions": "224x224x3",
        "status": "operational"
    })

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    print(f"[*] Starting Landslide AI Flask Server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)

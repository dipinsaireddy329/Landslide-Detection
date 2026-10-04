# Landslide Detection Flask Backend & SQLite Database

This backend provides the REST API for the **Landslide Detection from Satellite Imagery** application.

## AI Pipeline Architecture
- **Preprocessing**: Bilinear interpolation resizing to 224×224 pixels and radiometric normalization $[0, 1]$.
- **Gabor Filter Bank**: 2D Gabor kernels with varying orientations ($\theta \in \{0^\circ, 45^\circ, 90^\circ, 135^\circ\}$) extracting high-frequency slope texture and striations.
- **VGG19 Backbone**: Deep convolutional feature maps capturing high-level spatial morphology, terrain deformation, and vegetation boundaries.
- **ResNet101 Classification Head**: Deep residual bottleneck network generating binary prediction (`landslide` vs `non-landslide`), calibrated confidence score, and hazard risk levels.
- **Reported Model Accuracy**: 96.58%

## REST Endpoints
- `POST /api/auth/register` - Create researcher account
- `POST /api/auth/login` - Authenticate researcher
- `POST /api/predict` - Upload satellite image (multipart/form-data) and receive AI classification
- `GET /api/predictions` - Retrieve historical satellite inferences
- `GET /api/predictions/<id>` - Retrieve specific prediction details
- `GET /api/analytics` - System metrics and class distributions
- `GET /api/alerts` - Active hazard alerts
- `POST /api/alerts/<id>/acknowledge` - Acknowledge hazard warning
- `GET /api/model-info` - Architecture metadata and operational status

## Running Locally
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python database.py        # Initializes SQLite database
python app.py            # Starts server on http://localhost:5000
```

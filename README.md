# Landslide Detection from Satellite Imagery 🛰️⛰️

A geospatial AI disaster monitoring platform designed for landslide hazard classification, risk stratification, and terrain vulnerability analysis from satellite remote sensing imagery.

The system combines **Gabor texture filtering**, **VGG19 high-level spatial feature extraction**, and **ResNet101 deep convolutional classification** with an interactive dashboard, an automated verification testbed, and a 20-scene global satellite benchmark dataset.

---

## 🌟 Key Features

- **Multi-Stage Computer Vision & AI Pipeline**:
  - **Radiometric Normalization & Preprocessing**: Standardizes input tiles to $224 \times 224 \times 3$ matrices with color-space calibration.
  - **Gabor Multi-Orientation Filtering**: Computes directional frequency responses across $0^\circ, 45^\circ, 90^\circ,$ and $135^\circ$ to isolate scarps, fissure striations, and slope shear planes.
  - **VGG19 Feature Representation**: Models spatial variance, edge density, and soil displacement indices.
  - **ResNet101 Hazard Classifier**: Produces calibrated probability scores and hazard classes (`landslide` vs. `non-landslide`) mapped to 4-tier risk categories (**Critical**, **High**, **Moderate**, **Low/Stable**).

- **Curated 20 Satellite Benchmark Dataset**:
  - **10 Landslide Hazard Scenes**: Western Himalayas, Wayanad Western Ghats, Kedarnath Glacial Basin, Tirupati Seshachalam Escarpment, Darjeeling Terraces, Italian Dolomites, Mount St. Helens, and more.
  - **10 Stable Terrains**: Tirumala Sacred Reserve Basin, Nilgiri Biosphere, Swiss Alps Oberland, Pacific Northwest, Banff Canadian Rockies, Fiordland Granite, and more.
  - One-click instant detection with sensor telemetry (Sentinel-2, Landsat-9, WorldView-3, PlanetScope).

- **Flexible Architecture & Dual-Mode Execution**:
  - **Embedded Pipeline**: Runs directly in the browser with zero external setup or latency using Web Canvas APIs.
  - **Flask REST API Integration**: Connects seamlessly to external Python backends (`/api/predict`, `/api/health`, `/api/model-info`) when available.

- **Responsive Earth Observation Workspace**:
  - **Collapsible Sidebar**: Toggleable via `...` header buttons, navbar icon, or floating restoration button.
  - **Tirupati Seven Hills Silhouette Background**: Ultra-subtle (8%–12% opacity) panoramic signature identity representing the Seshachalam mountain range.
  - **Automated Verification Testbed**: 12 integrated unit and end-to-end tests covering authentication, upload guards, inference accuracy, and alert dispatching.
  - **Real-time Threat Alerts & Analytics**: Interactive trend graphs, risk distribution breakdowns, and confusion matrix metrics.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Icons & Visuals**: Lucide React, Custom SVG Vector Terrain Silhouettes
- **Computer Vision Simulation**: Web Canvas 2D Radiometric Processing & Gabor Kernel Kernels
- **Backend / Storage**: REST API Bridge, Partitioned `localStorage` with in-memory fallback, Optional Flask Server

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** or **yarn** / **pnpm**

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install frontend dependencies
npm install
```

### 3. Development Server
```bash
# Start Vite development server
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for Production
```bash
# Build optimized static distribution
npm run build

# Preview production build
npm run preview
```

---

## 🗺️ Project Structure

```text
├── src/
│   ├── components/
│   │   ├── AboutModelView.tsx             # Model metrics, confusion matrix, loss curves
│   │   ├── AboutProjectView.tsx           # Literature references, dataset methodology
│   │   ├── AlertsView.tsx                 # Hazard alert dispatcher & notifications
│   │   ├── AnalyticsView.tsx              # Trend analytics, regional charts
│   │   ├── AuthModal.tsx                  # Researcher credentials modal
│   │   ├── DashboardOverview.tsx          # Main overview, KPI cards, benchmark showcase
│   │   ├── DetectLandslideView.tsx        # Upload dropzone & visual inference inspector
│   │   ├── LandingPage.tsx                # Hero presentation & operational badges
│   │   ├── Navbar.tsx                     # Top navigation with 3-dots sidebar toggle
│   │   ├── PredictionHistoryView.tsx      # Paginated inference history & filtering
│   │   ├── PredictionResult.tsx           # Detailed results, Gabor & VGG19 previews
│   │   ├── ProcessingPipeline.tsx         # Step-by-step pipeline animation
│   │   ├── SettingsView.tsx               # Backend mode switcher & threshold controls
│   │   ├── Sidebar.tsx                    # Collapsible left navigation panel
│   │   ├── SystemArchitectureView.tsx     # Technical schematic & data flow
│   │   ├── SystemTestingView.tsx          # 12-test automated verification suite
│   │   ├── TirupatiSevenHillsBackground.tsx# Clean 7-hills vector silhouette (8-12% opacity)
│   │   └── UploadDropzone.tsx             # 20-scene benchmark gallery & file upload
│   ├── services/
│   │   ├── api.ts                         # Dual-mode API service & storage manager
│   │   ├── imageAnalysis.ts               # Computer vision, Gabor filtering & scoring
│   │   ├── sampleData.ts                  # 20 satellite scenes & historical datasets
│   │   └── tirupatiLandscape.ts           # Landscape helpers
│   ├── types/
│   │   └── index.ts                       # TypeScript interfaces & types
│   ├── App.tsx                            # Root application component
│   └── main.tsx                           # Application entry point & RootErrorBoundary
├── index.html                             # HTML entry point with SEO metadata
├── metadata.json                          # Applet configuration & permissions
├── package.json                           # Dependencies & scripts
├── tsconfig.json                          # TypeScript configuration
└── vite.config.ts                         # Vite configuration
```

---

## 🔬 Model & Algorithm Details

1. **Gabor Energy**:
   $$\text{Energy}_\theta = \frac{1}{N} \sum_{x,y} |I(x,y) * g(x,y;\lambda,\theta,\psi,\sigma,\gamma)|$$
   Measures high-frequency surface roughness associated with ruptured terrain and talus deposits.

2. **Soil Displacement Index (SDI)**:
   Extracts chromatic divergence between exposed earthen laterite/alluvium and surrounding healthy forest canopies.

3. **Classification Output**:
   - **Landslide Hazard**: $> 0.85$ confidence triggers automated alerts with GPS coordinates and sensor metadata.
   - **Stable Slope**: Confirms intact forest cover, stabilized ridgelines, and low surface variance.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

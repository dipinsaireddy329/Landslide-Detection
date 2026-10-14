# LandslideAI — Global Satellite-Based Landslide Detection 🛰️⛰️

A geospatial AI disaster monitoring platform designed for landslide hazard classification, risk stratification, and terrain vulnerability analysis from authentic satellite remote sensing imagery.

The system combines **Gabor texture filtering**, **VGG19 high-level spatial feature extraction**, and **ResNet101 deep convolutional classification** with an interactive dashboard, an automated verification testbed, authentic multi-spectral Earth observation datasets, and full Vercel/Node production readiness.

---

## 🌟 Key Features

- **Authentic Global Satellite Imagery Dataset**:
  - **Copernicus Sentinel-2, Landsat 8/9, NASA Worldview, and EarthExplorer**: Genuine optical & infrared satellite observations for every benchmark scene.
  - **20 Global Geographic Benchmark Scenes**:
    - **Landslide Locations**: Wayanad (Western Ghats), Kedarnath Glacial Basin, Western Himalayas, Tirupati Seshachalam Escarpment, Darjeeling Terraces, Italian Dolomites, Mount St. Helens, Zhouqu, etc.
    - **Stable Terrains**: Tirumala Sacred Reserve Basin, Nilgiri Biosphere, Swiss Alps Oberland, Pacific Northwest, Banff Canadian Rockies, Fiordland Granite, etc.
  - Distinct spectral signatures, real-time sensor telemetry, and unique Earth observation imagery for every individual card and scene.

- **Multi-Stage Computer Vision & AI Pipeline**:
  - **Radiometric Normalization & Preprocessing**: Standardizes input tiles to $224 \times 224 \times 3$ matrices with color-space calibration.
  - **Gabor Multi-Orientation Filtering**: Computes directional frequency responses across $0^\circ, 45^\circ, 90^\circ,$ and $135^\circ$ to isolate scarps, fissure striations, and slope shear planes.
  - **VGG19 Feature Representation**: Models spatial variance, edge density, and soil displacement indices (SDI).
  - **ResNet101 Hazard Classifier**: Produces calibrated probability scores and hazard classes (`landslide` vs. `non-landslide`) mapped to 4-tier risk categories (**Critical**, **High**, **Moderate**, **Low/Stable**).

- **Full-Stack Architecture & API Express Bridge**:
  - **Hybrid Dev/Prod Setup**: Vite + Express (`server.ts`) middleware in local dev with fallback SPA routing.
  - **Production Vercel Ready**: Pre-configured `vercel.json` with SPA rewrites and `--legacy-peer-deps` dependency installation strategy.
  - **Resolved Dependency Pipeline**: Explicit `react-is@^19.0.0` integration resolving Recharts 3.x module imports on React 19 / Vite.

- **Responsive Earth Observation Workspace**:
  - **Tirupati Seven Hills Silhouette Background**: Subtle panoramic vector background representing the Seshachalam mountain range.
  - **Automated Verification Testbed**: 12 integrated unit and end-to-end tests covering authentication, upload guards, inference accuracy, and alert dispatching.
  - **Real-time Threat Alerts & Analytics**: Interactive trend graphs with Recharts, risk distribution breakdowns, and confusion matrix metrics.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4
- **Charts & Data Viz**: Recharts (with explicit `react-is` resolution)
- **Icons & Visuals**: Lucide React, Custom SVG Vector Terrain Silhouettes
- **Computer Vision Pipeline**: Web Canvas 2D Radiometric Processing & Gabor Kernel Filters
- **Server**: Express 4, `tsx` TypeScript runner
- **Deployment**: Vercel (`vercel.json`)

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/dipinsaireddy329/Landslide-Detection.git
cd Landslide-Detection

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Development Server
```bash
# Start Vite + Express development server
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build & Preview
```bash
# Type check and lint
npm run lint

# Build optimized static distribution
npm run build

# Preview production build
npm run preview
```

---

## ☁️ Deploying to Vercel

The project includes a pre-configured `vercel.json` optimized for Vite + React 19 deployments:

1. Connect your repository `https://github.com/dipinsaireddy329/Landslide-Detection` to Vercel.
2. Select **Vite** as the framework preset.
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`
   - **Output Directory**: `dist`

### Common Deployment Fixes Applied
- **`react-is` import resolution error in Recharts**: Fixed by declaring `react-is@^19.0.0` explicitly in `package.json`.
- **Peer dependency conflicts**: Resolved by enforcing `--legacy-peer-deps` via `.npmrc` and `vercel.json`.

---

## 🗺️ Project Structure

```text
├── api/                           # Vercel serverless API handlers (if applicable)
├── src/
│   ├── components/
│   │   ├── AboutModelView.tsx     # Model metrics, confusion matrix, loss curves
│   │   ├── AboutProjectView.tsx   # Literature references, dataset methodology
│   │   ├── AlertsView.tsx         # Hazard alert dispatcher & notifications
│   │   ├── AnalyticsView.tsx      # Trend analytics, regional charts
│   │   ├── AuthModal.tsx          # Researcher credentials modal
│   │   ├── DashboardOverview.tsx  # Main overview, KPI cards, benchmark showcase
│   │   ├── DetectLandslideView.tsx# Upload dropzone & visual inference inspector
│   │   ├── LandingPage.tsx        # Hero presentation & operational badges
│   │   ├── Navbar.tsx             # Top navigation with sidebar toggle
│   │   ├── PredictionHistoryView.tsx # Paginated inference history & filtering
│   │   ├── PredictionResult.tsx   # Detailed results, Gabor & VGG19 previews
│   │   ├── ProcessingPipeline.tsx # Step-by-step pipeline animation
│   │   ├── SettingsView.tsx       # Backend mode switcher & threshold controls
│   │   ├── Sidebar.tsx            # Collapsible left navigation panel
│   │   ├── SystemArchitectureView.tsx # Technical schematic & data flow
│   │   ├── SystemTestingView.tsx  # 12-test automated verification suite
│   │   ├── TirupatiSevenHillsBackground.tsx # Seven Hills vector silhouette
│   │   └── UploadDropzone.tsx     # 20-scene benchmark gallery & file upload
│   ├── services/
│   │   ├── api.ts                 # Dual-mode API service & storage manager
│   │   ├── imageAnalysis.ts       # Computer vision, Gabor filtering & scoring
│   │   └── sampleData.ts          # Authentic 20 satellite scenes & metadata
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces & types
│   ├── App.tsx                    # Root application component
│   └── main.tsx                   # Application entry point & RootErrorBoundary
├── index.html                     # HTML entry point with SEO metadata
├── metadata.json                  # Applet configuration & permissions
├── package.json                   # Dependencies & build scripts
├── server.ts                      # Express dev/prod backend server
├── tsconfig.json                  # TypeScript configuration
├── vercel.json                    # Vercel deployment configuration
└── vite.config.ts                 # Vite configuration
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

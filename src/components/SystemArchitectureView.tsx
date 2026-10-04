import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Server, 
  UploadCloud, 
  BarChart, 
  AlertTriangle, 
  Database, 
  HardDrive, 
  Cpu
} from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  category: 'core' | 'ai' | 'storage' | 'client';
  description: string;
  tech: string;
  inputs: string[];
  outputs: string[];
}

export const SystemArchitectureView: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('vgg19_gabor');
  const [activeTab, setActiveTab] = useState<'architecture' | 'workflow'>('architecture');

  const nodes: ArchNode[] = [
    {
      id: 'user_client',
      name: 'User / Researcher',
      category: 'client',
      description: 'Geospatial analyst or disaster manager interacting with the web console.',
      tech: 'Modern Web Browser / HTTPS Client',
      inputs: ['Interactive Dashboard Controls', 'Telemetry Views'],
      outputs: ['Auth Credentials', 'Satellite Imagery Uploads']
    },
    {
      id: 'auth_service',
      name: 'Authentication Module',
      category: 'core',
      description: 'Secures workspace access via hashed credential tokens and session validation.',
      tech: 'PBKDF2 / SHA-256 Auth & JWT Session Tokens',
      inputs: ['User Registration & Login Payload'],
      outputs: ['Authorized Session Context', 'User Permissions']
    },
    {
      id: 'flask_app',
      name: 'Flask REST API Gateway',
      category: 'core',
      description: 'Handles routing, request validation, multipart file upload parsing, and CORS dispatch.',
      tech: 'Python 3.11 / Flask / Werkzeug WSGI',
      inputs: ['HTTP Client Requests', 'Multipart Image Data'],
      outputs: ['REST JSON Endpoints', 'Pipeline Invocation']
    },
    {
      id: 'image_upload',
      name: 'Image Upload Handler',
      category: 'core',
      description: 'Receives satellite scene tiles, validates dimensions, file signatures, and color depths.',
      tech: 'Pillow (PIL) & Multipart Buffer Streaming',
      inputs: ['Raw GeoTIFF, PNG, JPEG Tiles'],
      outputs: ['Orthorectified Array Buffer']
    },
    {
      id: 'preprocessing_mod',
      name: 'Preprocessing Module',
      category: 'ai',
      description: 'Standardizes input resolution to 224×224 and performs radiometric min-max normalization [0, 1].',
      tech: 'Bilinear Resampling & NumPy Arrays',
      inputs: ['Raw Image Buffer'],
      outputs: ['Normalized 224×224×3 Radiometric Matrix']
    },
    {
      id: 'vgg19_gabor',
      name: 'Feature Extraction (VGG19 + Gabor)',
      category: 'ai',
      description: 'Dual feature backbone: 2D Gabor filter bank extracts texture frequencies (θ=0°, 45°, 90°, 135°), while pre-trained VGG19 extracts deep spatial representations.',
      tech: 'PyTorch VGG19 + OpenCV Gabor Filter Bank',
      inputs: ['Normalized Satellite Matrix'],
      outputs: ['High-level Spatial Feature Map & Directional Energy Tensors']
    },
    {
      id: 'resnet101_model',
      name: 'ResNet101 AI Classifier',
      category: 'ai',
      description: 'Deep residual network with 101 layers that maps extracted spatial/texture features to binary landslide probabilities.',
      tech: 'PyTorch Deep Residual Network (101 Layers)',
      inputs: ['Concatenated Feature Embeddings'],
      outputs: ['Softmax Logits & Confidence Score']
    },
    {
      id: 'prediction_result',
      name: 'Prediction & Risk Engine',
      category: 'ai',
      description: 'Evaluates class boundaries (Landslide vs Non-Landslide), determines calibrated hazard risk (Critical, High, Moderate, Low).',
      tech: 'Probabilistic Softmax & Risk Categorization Rules',
      inputs: ['Softmax Logits'],
      outputs: ['Inference Record with Confidence % and Risk Index']
    },
    {
      id: 'alert_system',
      name: 'Hazard Alert Dispatcher',
      category: 'core',
      description: 'Generates emergency hazard alerts if soil displacement and classification exceed critical risk thresholds.',
      tech: 'Disaster Telemetry Dispatcher',
      inputs: ['Positive Landslide Inferences'],
      outputs: ['Active Hazard Notifications & Acknowledgment Log']
    },
    {
      id: 'sqlite_db',
      name: 'SQLite Database',
      category: 'storage',
      description: 'ACID-compliant relational persistence storing users, historical predictions, feature metrics, and hazard alerts.',
      tech: 'SQLite3 Embedded Database Engine',
      inputs: ['Inference Records', 'Alert State', 'User Profiles'],
      outputs: ['Historical Analytics Queries', 'Audit Logs']
    },
    {
      id: 'satellite_dataset',
      name: 'Satellite Image Dataset',
      category: 'storage',
      description: 'Curated remote sensing benchmark dataset comprising Sentinel-2 and Landsat imagery across high-risk mountain sectors.',
      tech: 'Sentinel-2 Multispectral & USGS Landsat-8 Imagery',
      inputs: ['Remote Sensing Earth Observation Feeds'],
      outputs: ['Training, Validation & Benchmark Test Partitions']
    },
    {
      id: 'trained_weights',
      name: 'Trained Model Weights',
      category: 'storage',
      description: 'Optimized neural parameters achieving the 96.58% benchmark verification accuracy.',
      tech: 'PyTorch Model Checkpoint (.pt / .bin) 64.8M Parameters',
      inputs: ['Backpropagation Optimization'],
      outputs: ['Calibrated Weights for Conv and Residual Layers']
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[5];

  const workflowSteps = [
    { step: 1, title: 'User Opens System', desc: 'Analyst connects to disaster monitoring platform via secure web UI.' },
    { step: 2, title: 'Register / Login', desc: 'Secure credential verification against encrypted user database.' },
    { step: 3, title: 'Access Dashboard', desc: 'Real-time telemetry, active hazard warnings, and recent scene statistics loaded.' },
    { step: 4, title: 'Upload Satellite Image', desc: 'Drag-and-drop or select Sentinel-2 / Landsat remote sensing tile.' },
    { step: 5, title: 'Validate Image', desc: 'Format check (JPG, JPEG, PNG), pixel bounds, and file integrity validation.' },
    { step: 6, title: 'Resize + Normalize', desc: 'Bilinear spatial resampling to 224×224 and radiometric scaling [0, 1].' },
    { step: 7, title: 'Apply Gabor Filter', desc: 'Extract multi-orientation spatial frequencies (θ=0°, 45°, 90°, 135°) capturing slope striations.' },
    { step: 8, title: 'Extract Features Using VGG19', desc: '19-layer deep conv backbone extracts terrain texture, surface roughness, and vegetation loss patterns.' },
    { step: 9, title: 'Classify Using ResNet101', desc: 'Deep residual bottleneck classification mapping features to binary class logits.' },
    { step: 10, title: 'Generate Prediction', desc: 'Compute class (Landslide / Non-Landslide), confidence score (96.58% benchmark), and risk index.' },
    { step: 11, title: 'Display Result', desc: 'Render satellite view, circular confidence ring, feature matrix, and VGG19 activation heatmaps.' },
    { step: 12, title: 'Evaluate Hazard Branch', desc: 'If Landslide: Broadcast emergency alert & log hazard. If Non-Landslide: Record verified stable slope.' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
            Full-Stack System Blueprint
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            System Architecture & Pipeline Flow
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Interactive multi-tier architecture diagram and visual step-by-step activity pipeline.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'architecture' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'workflow' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Activity Workflow
          </button>
        </div>
      </div>

      {activeTab === 'architecture' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Architecture Map Canvas (8 Cols) */}
          <div className="lg:col-span-8 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div>
                <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                  Interactive Node Graph
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Click any component to inspect data inputs & technical spec
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-600" /> AI Engine</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-600" /> Storage</span>
              </div>
            </div>

            {/* Visual Node Diagram */}
            <div className="space-y-4">
              
              {/* Layer 1: Client & Auth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedNodeId('user_client')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedNodeId === 'user_client'
                      ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <User className="h-4 w-4 text-sky-600" />
                    <span>01. User / Client</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Geospatial Web Terminal</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedNodeId('auth_service')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedNodeId === 'auth_service'
                      ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Lock className="h-4 w-4 text-sky-600" />
                    <span>02. Authentication</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Session Token Validation</div>
                </button>
              </div>

              {/* Connector */}
              <div className="flex justify-center text-slate-400 font-mono text-xs">
                ↓ (HTTPS / REST Endpoints)
              </div>

              {/* Layer 2: Flask Gateway & Image Ingestion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedNodeId('flask_app')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedNodeId === 'flask_app'
                      ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Server className="h-4 w-4 text-sky-600" />
                    <span>03. Flask Application</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">REST API & Request Dispatch</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedNodeId('image_upload')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedNodeId === 'image_upload'
                      ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <UploadCloud className="h-4 w-4 text-sky-600" />
                    <span>04. Image Upload</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Format & Bounds Check</div>
                </button>
              </div>

              {/* Connector */}
              <div className="flex justify-center text-slate-400 font-mono text-xs">
                ↓ (224×224 Radiometric Scaling)
              </div>

              {/* Layer 3: AI Pipeline */}
              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/40 space-y-3">
                <div className="text-[11px] font-mono text-sky-800 uppercase tracking-wider font-bold">
                  Core Deep Learning Inference Pipeline
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId('preprocessing_mod')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedNodeId === 'preprocessing_mod'
                        ? 'border-sky-500 bg-white ring-1 ring-sky-500 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-400">05. Preprocessing</div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">Bilinear & Normalization</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedNodeId('vgg19_gabor')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedNodeId === 'vgg19_gabor'
                        ? 'border-sky-500 bg-white ring-1 ring-sky-500 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-sky-700 font-semibold">06. Feature Extraction</div>
                    <div className="text-xs font-bold text-sky-950 mt-0.5">VGG19 + Gabor Bank</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedNodeId('resnet101_model')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedNodeId === 'resnet101_model'
                        ? 'border-sky-500 bg-white ring-1 ring-sky-500 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-sky-700 font-semibold">07. AI Model</div>
                    <div className="text-xs font-bold text-sky-950 mt-0.5">ResNet101 Classifier</div>
                  </button>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center text-slate-400 font-mono text-xs">
                ↓ (Class Probabilities & Confidence Calibration)
              </div>

              {/* Layer 4: Output & Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedNodeId('prediction_result')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedNodeId === 'prediction_result'
                      ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <BarChart className="h-4 w-4 text-emerald-600" />
                    <span>08. Prediction Result</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Landslide vs Non-Landslide</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedNodeId('alert_system')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedNodeId === 'alert_system'
                      ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    <span>09. Alert System</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Hazard Warning Broadcast</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedNodeId('sqlite_db')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedNodeId === 'sqlite_db'
                      ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Database className="h-4 w-4 text-indigo-600" />
                    <span>10. SQLite Database</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">ACID Relational Storage</div>
                </button>
              </div>

              {/* Supporting Resources Bar */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 font-mono">Supporting Resources:</span>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId('satellite_dataset')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer shadow-2xs ${
                      selectedNodeId === 'satellite_dataset'
                        ? 'border-sky-500 bg-sky-50 text-sky-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <HardDrive className="h-3.5 w-3.5 text-sky-600" />
                    <span>Satellite Image Dataset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedNodeId('trained_weights')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer shadow-2xs ${
                      selectedNodeId === 'trained_weights'
                        ? 'border-sky-500 bg-sky-50 text-sky-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Cpu className="h-3.5 w-3.5 text-sky-600" />
                    <span>Trained Model Weights (64.8M Params)</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Node Inspector Drawer (4 Cols) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
            <div>
              <span className="text-[10px] font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Component Inspector
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedNode.name}
              </h3>
              <div className="mt-1 text-xs font-mono text-slate-500">
                Tech Stack: <span className="text-slate-800 font-medium">{selectedNode.tech}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              {selectedNode.description}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-medium">
                  Inputs & Data Feeds
                </span>
                <ul className="mt-1 space-y-1">
                  {selectedNode.inputs.map((inp, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-medium">
                  Outputs & Downstream Artifacts
                </span>
                <ul className="mt-1 space-y-1">
                  {selectedNode.outputs.map((outp, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      <span>{outp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-400">
              Modularity ensures individual computer vision stages can be updated or replaced independently.
            </div>
          </div>

        </div>
      ) : (
        /* Visual Workflow Timeline */
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-200/80 pb-3">
            <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
              Step-by-Step Execution Sequence
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Activity Lifecycle: Ingestion to Hazard Alert
            </h3>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
            {workflowSteps.map((ws) => (
              <div key={ws.step} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[32px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-sky-600 text-[10px] font-mono font-bold text-sky-800 shadow-2xs">
                  {ws.step}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {ws.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {ws.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

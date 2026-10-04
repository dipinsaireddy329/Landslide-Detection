import React, { useState } from 'react';

export const AboutModelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vgg19' | 'gabor' | 'resnet101'>('vgg19');

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
          Neural Architecture Specification
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Deep Learning Architecture
        </h1>
        <p className="mt-1 text-xs text-slate-600 max-w-3xl leading-relaxed">
          The novel hybrid detection framework combines spatial frequency texture analysis (Gabor filter bank), deep spatial convolutions (VGG19 backbone), and deep residual classification (ResNet101).
        </p>
      </div>

      {/* Model Spec Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-medium">Feature Extractor</div>
          <div className="text-sm font-bold text-slate-900 mt-1">VGG19 Backbone</div>
          <div className="text-[11px] text-slate-500 mt-0.5">19 Layers + Transfer Learning</div>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-medium">Texture Filter</div>
          <div className="text-sm font-bold text-slate-900 mt-1">2D Gabor Bank</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Multi-scale & 4 Orientations</div>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-medium">Classifier</div>
          <div className="text-sm font-bold text-slate-900 mt-1">ResNet101 Head</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Deep Residual Bottlenecks</div>
        </div>

        <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 shadow-xs">
          <div className="text-[11px] font-mono text-sky-800 uppercase font-semibold">Reported Accuracy</div>
          <div className="text-xl font-mono font-bold text-slate-900 mt-0.5">96.58%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Empirical Research Validation</div>
        </div>
      </div>

      {/* Conceptual Flow Diagram Card */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
          End-to-End Conceptual Flow
        </span>
        <h3 className="text-base font-bold text-slate-900 mt-0.5 mb-6">
          Satellite Image to Landslide Hazard Prediction
        </h3>

        {/* Visual Pipeline Nodes */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
          
          <div className="w-full md:w-auto flex-1 rounded-lg border border-slate-200 bg-slate-50 p-3.5 shadow-2xs">
            <div className="text-xs font-mono text-slate-400 font-medium">Step 1</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Satellite Image</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">RGB Multispectral</div>
          </div>

          <div className="hidden md:block text-slate-300 font-mono">→</div>

          <div className="w-full md:w-auto flex-1 rounded-lg border border-slate-200 bg-slate-50 p-3.5 shadow-2xs">
            <div className="text-xs font-mono text-slate-400 font-medium">Step 2</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Preprocessing</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">Resize 224×224 · Norm</div>
          </div>

          <div className="hidden md:block text-slate-300 font-mono">→</div>

          <div className="w-full md:w-auto flex-1 rounded-lg border border-sky-200 bg-sky-50/70 p-3.5 shadow-2xs">
            <div className="text-xs font-mono text-sky-800 font-semibold">Step 3</div>
            <div className="text-sm font-bold text-sky-950 mt-1">Gabor Features</div>
            <div className="text-[11px] text-sky-700 font-mono mt-0.5">Texture Frequencies</div>
          </div>

          <div className="hidden md:block text-slate-300 font-mono">→</div>

          <div className="w-full md:w-auto flex-1 rounded-lg border border-sky-200 bg-sky-50/70 p-3.5 shadow-2xs">
            <div className="text-xs font-mono text-sky-800 font-semibold">Step 4</div>
            <div className="text-sm font-bold text-sky-950 mt-1">VGG19 Features</div>
            <div className="text-[11px] text-sky-700 font-mono mt-0.5">Deep Spatial Maps</div>
          </div>

          <div className="hidden md:block text-slate-300 font-mono">→</div>

          <div className="w-full md:w-auto flex-1 rounded-lg border border-slate-200 bg-slate-50 p-3.5 shadow-2xs">
            <div className="text-xs font-mono text-slate-400 font-medium">Step 5</div>
            <div className="text-sm font-bold text-slate-900 mt-1">ResNet101</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">Residual Bottlenecks</div>
          </div>

          <div className="hidden md:block text-slate-300 font-mono">→</div>

          <div className="w-full md:w-auto flex-1 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3.5 shadow-2xs">
            <div className="text-xs font-mono text-emerald-800 font-semibold">Step 6</div>
            <div className="text-sm font-bold text-emerald-950 mt-1">Prediction</div>
            <div className="text-[11px] text-emerald-700 font-mono font-medium mt-0.5">Landslide (96.58%)</div>
          </div>

        </div>
      </div>

      {/* Tabs for In-Depth Explanations */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-6 shadow-xs">
        
        {/* Component Selector */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('vgg19')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'vgg19' 
                ? 'border-sky-600 text-sky-700 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            01. VGG19 Feature Extraction Backbone
          </button>
          <button
            onClick={() => setActiveTab('gabor')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'gabor' 
                ? 'border-sky-600 text-sky-700 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            02. Multi-Scale Gabor Filtering
          </button>
          <button
            onClick={() => setActiveTab('resnet101')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'resnet101' 
                ? 'border-sky-600 text-sky-700 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            03. ResNet101 Residual Classifier
          </button>
        </div>

        {/* Tab 1: VGG19 */}
        {activeTab === 'vgg19' && (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <h4 className="text-base font-bold text-slate-900">
              VGG19 as High-Level Spatial Feature Extractor
            </h4>
            <p>
              VGG19 is a 19-layer deep convolutional neural network developed by the Visual Geometry Group at Oxford. In this research architecture, VGG19 is utilized as a transfer-learning backbone pre-trained on ImageNet to extract rich hierarchical spatial features from satellite scenes.
            </p>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800">
              Input Image (224×224×3) → [Conv3-64 ×2] → MaxPool → [Conv3-128 ×2] → MaxPool → [Conv3-256 ×4] → MaxPool → [Conv3-512 ×4] → MaxPool → [Conv3-512 ×4] → Spatial Feature Tensor
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">Terrain Texture & Scar Boundaries:</span>
                <p className="mt-1 text-slate-600">
                  Initial convolutional blocks capture low-level geological edges, shadow boundaries, and hydrological channels.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">Vegetation Disruptions:</span>
                <p className="mt-1 text-slate-600">
                  Deep blocks (Conv4 and Conv5) extract semantic spatial patterns representing fractured forest canopies and bare mud chutes.
                </p>
              </div>
            </div>

            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>19 weight layers (16 convolutional layers + 3 fully connected representations).</li>
              <li>Small 3×3 convolution filters with stride 1, preserving fine morphological textures.</li>
              <li>Rectified Linear Unit (ReLU) activation functions ensuring non-linear representational capacity.</li>
              <li>2×2 max pooling windows for spatial downsampling and translational invariance.</li>
            </ul>
          </div>
        )}

        {/* Tab 2: Gabor */}
        {activeTab === 'gabor' && (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <h4 className="text-base font-bold text-slate-900">
              Gabor Filter Bank for Geological Texture Representation
            </h4>
            <p>
              Gabor filtering is a linear filter whose impulse response is defined by a harmonic function multiplied by a Gaussian function. In satellite remote sensing, Gabor filters mimic the human visual system's frequency and orientation representation, allowing the system to isolate surface roughness, slope striations, and directional mud flows.
            </p>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800">
              G(x, y; λ, θ, ψ, σ, γ) = exp(-(x'² + γ²y'²)/(2σ²)) · cos(2πx'/λ + ψ)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-[11px]">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-sky-700 font-bold">θ = 0°</div>
                <div className="text-slate-600 mt-1">Horizontal fault lines & contour terraces</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-sky-700 font-bold">θ = 45°</div>
                <div className="text-slate-600 mt-1">Diagonal chute displacement & rockfall debris</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-sky-700 font-bold">θ = 90°</div>
                <div className="text-slate-600 mt-1">Vertical slope collapse & gravity flow runouts</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-sky-700 font-bold">θ = 135°</div>
                <div className="text-slate-600 mt-1">Transverse shearing & talus accumulation</div>
              </div>
            </div>

            <p className="text-slate-600">
              Combining Gabor texture energies with VGG19 spatial feature maps provides resilience against varying solar azimuth angles and cloud shadows commonly encountered in satellite imagery.
            </p>
          </div>
        )}

        {/* Tab 3: ResNet101 */}
        {activeTab === 'resnet101' && (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <h4 className="text-base font-bold text-slate-900">
              ResNet101 Deep Residual Classifier
            </h4>
            <p>
              ResNet101 utilizes deep residual learning frameworks with 101 layers, introducing identity shortcut connections that bypass parameterized layers. This prevents the vanishing gradient degradation problem that traditionally impedes ultra-deep networks during gradient backpropagation.
            </p>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800">
              Residual Mapping: F(x) = H(x) - x → Output: y = F(x, &#123;W_i&#125;) + x
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">Bottleneck Residual Blocks:</span>
                <p className="mt-1 text-slate-600">
                  Each bottleneck block uses a 1×1 conv (channel reduction), 3×3 conv, and 1×1 conv (channel expansion), optimizing parameter efficiency across 101 layers.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">Final Classification Head:</span>
                <p className="mt-1 text-slate-600">
                  Global Average Pooling feeds into a calibrated binary Softmax classification layer yielding the 96.58% benchmark accuracy score.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

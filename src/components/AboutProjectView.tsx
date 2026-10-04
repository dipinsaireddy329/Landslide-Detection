import React from 'react';
import { 
  BookOpen, 
  Satellite, 
  Cpu, 
  Database, 
  Layers, 
  ShieldCheck, 
  FileText, 
  Award
} from 'lucide-react';

export const AboutProjectView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
          Academic Research & Technical Specification
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
          Landslide Detection from Satellite Imagery
        </h1>
        <h2 className="text-base text-sky-800 font-medium mt-1">
          Using Novel Deep Learning Approach
        </h2>
      </div>

      {/* Abstract Card */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
          <BookOpen className="h-4 w-4" />
          <span>Research Abstract</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Landslides represent catastrophic geomorphic hazards that inflict severe human casualties, economic loss, and infrastructure devastation in mountainous terrain globally. Rapid, autonomous identification of landslide initiation and debris chutes from satellite remote sensing imagery is vital for emergency response coordination and post-disaster reconnaissance.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          This system proposes a novel hybrid deep learning architecture uniting <strong>multi-scale 2D Gabor texture filtering</strong>, <strong>deep spatial feature representations via VGG19</strong>, and <strong>deep residual classification via ResNet101</strong>. The combined pipeline discriminates complex geological slope failures from undisturbed canopies with a reported validation accuracy of <strong>96.58%</strong>.
        </p>
      </div>

      {/* Objectives */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900">
          Primary Research Objectives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-sky-800">1. Autonomous Hazard Detection:</span>
            <p className="mt-1 text-slate-600 leading-relaxed">
              Eliminate reliance on manual visual interpretation of satellite scenes by deploying automated computer vision classifiers.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-sky-800">2. Hybrid Spatial-Frequency Extraction:</span>
            <p className="mt-1 text-slate-600 leading-relaxed">
              Fuse directional Gabor spatial frequencies with deep convolutional feature maps to capture subtle terrain roughness and mud striations.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-sky-800">3. Rapid Emergency Triage:</span>
            <p className="mt-1 text-slate-600 leading-relaxed">
              Deliver sub-second inferences (&lt;500ms) with automated disaster risk alert generation for critical slope destabilizations.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-sky-800">4. Modular Production Architecture:</span>
            <p className="mt-1 text-slate-600 leading-relaxed">
              Decouple the frontend geospatial dashboard from the Flask REST AI backend and SQLite relational persistence for model retraining.
            </p>
          </div>
        </div>
      </div>

      {/* Technological Breakdown */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900">
          Major Technologies & Frameworks
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <Satellite className="h-5 w-5 text-sky-600 mb-2" />
            <div className="font-bold text-slate-900">Satellite Imagery</div>
            <div className="text-[11px] text-slate-500 mt-1">Sentinel-2 & Landsat-8 multispectral remote sensing bands.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <Layers className="h-5 w-5 text-sky-600 mb-2" />
            <div className="font-bold text-slate-900">VGG19 Backbone</div>
            <div className="text-[11px] text-slate-500 mt-1">19-layer deep conv network pre-trained on ImageNet.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <Cpu className="h-5 w-5 text-sky-600 mb-2" />
            <div className="font-bold text-slate-900">Gabor Filtering</div>
            <div className="text-[11px] text-slate-500 mt-1">Multi-orientation spatial frequency texture kernels.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <Award className="h-5 w-5 text-sky-600 mb-2" />
            <div className="font-bold text-slate-900">ResNet101 Head</div>
            <div className="text-[11px] text-slate-500 mt-1">101-layer deep residual bottlenecks with 96.58% accuracy.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <Cpu className="h-5 w-5 text-sky-600 mb-2" />
            <div className="font-bold text-slate-900">Python & Flask</div>
            <div className="text-[11px] text-slate-500 mt-1">Lightweight WSGI REST API gateway for model inference.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <Database className="h-5 w-5 text-sky-600 mb-2" />
            <div className="font-bold text-slate-900">SQLite Database</div>
            <div className="text-[11px] text-slate-500 mt-1">Relational storage for inferences, users, and alert audit logs.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <ShieldCheck className="h-5 w-5 text-sky-600 mb-2" />
            <div className="font-bold text-slate-900">React & TypeScript</div>
            <div className="text-[11px] text-slate-500 mt-1">Geospatial UI with Vite and clean scientific presentation.</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <FileText className="h-5 w-5 text-sky-600 mb-2" />
            <div className="font-bold text-slate-900">Tailwind CSS</div>
            <div className="text-[11px] text-slate-500 mt-1">High-legibility zero-pill discipline & white theme.</div>
          </div>
        </div>
      </div>

      {/* Viva / Evaluation Key Talking Points */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900">
          Key Academic Project Evaluation Points
        </h3>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <strong className="text-slate-900">Why combine Gabor with VGG19?</strong>
            <p className="mt-1 text-slate-600 leading-relaxed">
              Standard deep CNNs often struggle with orientation-specific terrain striations in mountainous shadows. Gabor filter banks explicitly extract multi-angle frequencies (0°, 45°, 90°, 135°), providing robust texture invariance that complements VGG19 spatial conv activations.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <strong className="text-slate-900">Why use ResNet101 instead of a basic Multi-Layer Perceptron?</strong>
            <p className="mt-1 text-slate-600 leading-relaxed">
              Residual connections allow the network to train substantially deeper representations (101 layers) without gradient degradation, leading to superior generalization and high sensitivity on subtle slope failures.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

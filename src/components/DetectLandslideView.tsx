import React, { useState } from 'react';
import { UploadDropzone } from './UploadDropzone';
import { ProcessingPipeline } from './ProcessingPipeline';
import { PredictionResult } from './PredictionResult';
import { api } from '../services/api';
import { PredictionRecord, PredictResponse } from '../types';
import { AlertCircle } from 'lucide-react';

interface DetectLandslideViewProps {
  onPredictionComplete: (prediction: PredictionRecord) => void;
  activeInspectPrediction?: PredictionRecord | null;
  onClearInspect?: () => void;
}

export const DetectLandslideView: React.FC<DetectLandslideViewProps> = ({
  onPredictionComplete,
  activeInspectPrediction,
  onClearInspect
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(1);
  const [isPipelineComplete, setIsPipelineComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<{
    prediction: PredictionRecord;
    response: PredictResponse;
    vggHeatmap: string;
    gaborPreview: string;
  } | null>(null);

  // If viewing an inspected prediction from history
  const activePred = activeInspectPrediction || currentResult?.prediction;

  const handleStartAnalysis = async (
    fileOrUrl: File | string,
    metadata: { name: string; location: string }
  ) => {
    setIsProcessing(true);
    setIsPipelineComplete(false);
    setCurrentResult(null);
    setErrorMsg(null);
    setPipelineStage(1);

    // Realistic pipeline stage animation delays
    const advanceStage = (stage: number, delayMs: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setPipelineStage(stage);
          resolve();
        }, delayMs);
      });
    };

    try {
      // Step 1: Image Input
      await advanceStage(1, 200);

      // Step 2: Preprocessing & Gabor
      await advanceStage(2, 350);

      // Step 3: VGG19 Feature Extraction
      await advanceStage(3, 400);

      // Trigger actual computer vision computation
      const resultPromise = api.predict(fileOrUrl, metadata);

      // Step 4: ResNet101 Classification
      await advanceStage(4, 400);

      // Step 5: Prediction Generation
      await advanceStage(5, 300);

      const result = await resultPromise;

      // Step 6: Alert Generation if needed
      await advanceStage(6, 250);

      setIsPipelineComplete(true);
      setCurrentResult(result);
      onPredictionComplete(result.prediction);
    } catch (err: any) {
      console.error('Inference error:', err);
      setErrorMsg(err?.message || 'Error occurred during satellite computer vision inference.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentResult(null);
    setIsPipelineComplete(false);
    setErrorMsg(null);
    setPipelineStage(1);
    if (onClearInspect) onClearInspect();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
            Satellite Computer Vision Workspace
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Detect Landslides from Satellite Imagery
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Multi-stage pipeline: Preprocessing → Gabor Texture Filtering → VGG19 Feature Maps → ResNet101 Residual Classifier.
          </p>
        </div>

        {activePred && (
          <button
            onClick={handleNewAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <span>Analyze New Scene</span>
          </button>
        )}
      </div>

      {/* Error message banner */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800 shadow-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <div className="flex-1">
            <span className="font-bold">Inference Notice: </span>
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-[11px] font-mono text-rose-600 hover:text-rose-900 underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* If processing or if analysis completed, display the active pipeline progress */}
      {(isProcessing || currentResult) && (
        <ProcessingPipeline
          currentStageId={pipelineStage}
          isComplete={isPipelineComplete}
          predictionResult={currentResult?.prediction.prediction || null}
        />
      )}

      {/* Main View: Result display if completed/inspecting, otherwise Upload Dropzone */}
      {activePred ? (
        <PredictionResult
          prediction={activePred}
          vggHeatmap={currentResult?.vggHeatmap}
          gaborPreview={currentResult?.gaborPreview}
          onNewAnalysis={handleNewAnalysis}
        />
      ) : (
        <UploadDropzone
          onAnalyze={handleStartAnalysis}
          isProcessing={isProcessing}
        />
      )}

    </div>
  );
};

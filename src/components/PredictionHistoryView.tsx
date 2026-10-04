import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { PredictionRecord, PredictionClass, RiskLevel } from '../types';

interface PredictionHistoryViewProps {
  predictions: PredictionRecord[];
  onSelectPrediction: (pred: PredictionRecord) => void;
  onNavigateDetect: () => void;
}

export const PredictionHistoryView: React.FC<PredictionHistoryViewProps> = ({
  predictions,
  onSelectPrediction,
  onNavigateDetect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [predictionFilter, setPredictionFilter] = useState<'all' | PredictionClass>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'conf_desc' | 'conf_asc'>('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModalPred, setSelectedModalPred] = useState<PredictionRecord | null>(null);

  const itemsPerPage = 8;

  // Filter and sort logic
  const filteredPredictions = useMemo(() => {
    return predictions
      .filter((p) => {
        // Search
        const matchesSearch = 
          p.imageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.locationName && p.locationName.toLowerCase().includes(searchTerm.toLowerCase()));
        if (!matchesSearch) return false;

        // Class filter
        if (predictionFilter !== 'all' && p.prediction !== predictionFilter) {
          return false;
        }

        // Risk filter
        if (riskFilter !== 'all' && p.riskLevel !== riskFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'conf_desc') {
          return b.confidence - a.confidence;
        }
        if (sortBy === 'conf_asc') {
          return a.confidence - b.confidence;
        }
        return 0;
      });
  }, [predictions, searchTerm, predictionFilter, riskFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage) || 1;
  const paginatedPredictions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPredictions.slice(start, start + itemsPerPage);
  }, [filteredPredictions, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Prediction History
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Archived satellite remote sensing inference logs & risk determinations.
          </p>
        </div>

        <button
          onClick={onNavigateDetect}
          className="flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <span>Run New Inference</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200/90 bg-white shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search by tile name, ID, or region..."
            className="w-full rounded-lg border border-slate-300 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Prediction Class Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => { setPredictionFilter('all'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                predictionFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({predictions.length})
            </button>
            <button
              onClick={() => { setPredictionFilter('landslide'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                predictionFilter === 'landslide' ? 'bg-rose-100 text-rose-800 font-bold' : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Landslide
            </button>
            <button
              onClick={() => { setPredictionFilter('non-landslide'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                predictionFilter === 'non-landslide' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Non-Landslide
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 shadow-2xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-800 focus:outline-none cursor-pointer font-medium"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="conf_desc">Highest Confidence</option>
              <option value="conf_asc">Lowest Confidence</option>
            </select>
          </div>

        </div>

      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-mono uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-4 py-3">Record ID</th>
                <th className="px-4 py-3">Satellite Tile</th>
                <th className="px-4 py-3">Prediction</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Inference Time</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedPredictions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    No satellite predictions match your criteria.
                  </td>
                </tr>
              ) : (
                paginatedPredictions.map((pred) => {
                  const isLS = pred.prediction === 'landslide';

                  return (
                    <tr 
                      key={pred.id} 
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 font-medium">
                        {pred.id}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200">
                            {pred.imageUrl ? (
                              <img src={pred.imageUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center font-mono text-[9px] text-slate-400">
                                SAT
                              </div>
                            )}
                          </div>
                          <div className="truncate max-w-[160px] sm:max-w-xs">
                            <div className="font-bold text-slate-900 truncate">
                              {pred.imageName}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {pred.locationName || 'Survey Sector'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {isLS ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          )}
                          <span className={`font-bold uppercase ${isLS ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {pred.prediction}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono tabular-nums text-slate-900 font-semibold">
                        {(pred.confidence * 100).toFixed(2)}%
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`font-mono text-[11px] uppercase font-bold ${
                          pred.riskLevel === 'critical' ? 'text-rose-700' :
                          pred.riskLevel === 'high' ? 'text-amber-700' :
                          pred.riskLevel === 'moderate' ? 'text-yellow-700' : 'text-emerald-700'
                        }`}>
                          {pred.riskLevel}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                        {new Date(pred.createdAt).toLocaleDateString()} · {new Date(pred.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                        {pred.processingTime} ms
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedModalPred(pred)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] text-sky-800 font-semibold transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 bg-slate-50/50">
          <div>
            Showing <span className="font-mono text-slate-900 font-semibold">{filteredPredictions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-mono text-slate-900 font-semibold">
              {Math.min(currentPage * itemsPerPage, filteredPredictions.length)}
            </span> of <span className="font-mono text-slate-900 font-semibold">{filteredPredictions.length}</span> records
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 font-mono text-slate-900 font-semibold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer shadow-2xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Inspection Modal */}
      {selectedModalPred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedModalPred(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-xs font-mono text-sky-700 uppercase tracking-wider font-semibold">
                Inspection Detail
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {selectedModalPred.imageName}
              </h2>
              <div className="text-xs font-mono text-slate-400 mt-1">
                ID: {selectedModalPred.id} · Timestamp: {new Date(selectedModalPred.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Satellite image preview */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={selectedModalPred.imageUrl}
                alt="Satellite capture"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-[11px] font-mono text-slate-800 border border-slate-200 shadow-xs">
                {selectedModalPred.locationName || 'Survey Sector'}
              </div>
            </div>

            {/* Verdict summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-mono uppercase">AI Verdict</div>
                <div className={`text-xl font-bold uppercase mt-0.5 ${
                  selectedModalPred.prediction === 'landslide' ? 'text-rose-700' : 'text-emerald-700'
                }`}>
                  {selectedModalPred.prediction}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-mono uppercase">Confidence</div>
                <div className="text-xl font-mono font-bold text-slate-900 mt-0.5">
                  {(selectedModalPred.confidence * 100).toFixed(2)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-mono uppercase">Risk Level</div>
                <div className={`text-xl font-mono font-bold uppercase mt-0.5 ${
                  selectedModalPred.riskLevel === 'critical' ? 'text-rose-700' :
                  selectedModalPred.riskLevel === 'high' ? 'text-amber-700' :
                  selectedModalPred.riskLevel === 'moderate' ? 'text-yellow-700' : 'text-emerald-700'
                }`}>
                  {selectedModalPred.riskLevel}
                </div>
              </div>
            </div>

            {/* Features table */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                Extracted Deep Features
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 font-mono text-[10px]">Roughness</div>
                  <div className="text-slate-900 font-mono font-bold mt-0.5">
                    {(selectedModalPred.features.terrainRoughness * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 font-mono text-[10px]">Gabor Energy</div>
                  <div className="text-slate-900 font-mono font-bold mt-0.5">
                    {(selectedModalPred.features.gaborTextureEnergy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 font-mono text-[10px]">NDVI Index</div>
                  <div className="text-slate-900 font-mono font-bold mt-0.5">
                    {(selectedModalPred.features.vegetationIndexNDVI * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 font-mono text-[10px]">Soil Displacement</div>
                  <div className="text-slate-900 font-mono font-bold mt-0.5">
                    {(selectedModalPred.features.soilDisplacementIndex * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectPrediction(selectedModalPred);
                  setSelectedModalPred(null);
                }}
                className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
              >
                <span>Open in Full Analysis Workspace</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

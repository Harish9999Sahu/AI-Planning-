import React, { useState } from 'react';
import { WorkItem, MapLayer } from './types';
import MapVisualizer from './components/MapVisualizer';
import WorkCard from './components/WorkCard';
import { analyzeLandscapeAndIdentifyWorks } from './services/geminiService';
import { PERMISSIBLE_WORKS_DB } from './constants';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: '1', name: 'LULC Map', type: 'LULC', file: null, previewUrl: null },
    { id: '2', name: 'Slope Map', type: 'Slope', file: null, previewUrl: null },
    { id: '3', name: 'Drainage Map', type: 'Drainage', file: null, previewUrl: null },
  ]);
  const [identifiedWorks, setIdentifiedWorks] = useState<WorkItem[]>([]);
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gpName, setGpName] = useState("Kalaburagi GP-1");

  const handleFileUpload = (layerId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLayers(prev => prev.map(l => 
        l.id === layerId ? { ...l, file, previewUrl: e.target?.result as string } : l
      ));
    };
    reader.readAsDataURL(file);
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate slight delay for realism + API call
    const works = await analyzeLandscapeAndIdentifyWorks(layers, gpName);
    setIdentifiedWorks(works);
    setIsAnalyzing(false);
  };

  const exportPDF = () => {
    alert("Generating PDF Report with Maps and AI justification...");
    // In a real app, use jsPDF here
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6 z-20 shadow-lg">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900 font-bold">AI</div>
            <div>
                <h1 className="text-lg font-bold text-white leading-tight">Yuktadhara <span className="text-emerald-400 font-light">AI Planner</span></h1>
                <p className="text-[10px] text-slate-400 tracking-wider">GEO-SPATIAL WORK IDENTIFICATION SYSTEM</p>
            </div>
        </div>
        <div className="flex gap-4">
             <button onClick={exportPDF} className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-slate-200 transition">
                Export PDF
            </button>
             <button 
                onClick={runAIAnalysis}
                disabled={isAnalyzing}
                className={`
                    px-5 py-2 text-sm font-semibold rounded shadow-lg flex items-center gap-2 transition
                    ${isAnalyzing ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}
                `}
            >
                {isAnalyzing ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Analyzing Terrain...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        Run AI Identification
                    </>
                )}
            </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar - Data & Control */}
        <aside className={`
            w-80 bg-slate-900 border-r border-slate-700 flex flex-col z-10 transition-all duration-300 absolute md:relative h-full
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-80 md:translate-x-0 md:w-0 md:border-none md:overflow-hidden'}
        `}>
            <div className="p-4 border-b border-slate-700">
                <label className="block text-xs font-medium text-slate-400 mb-1">Gram Panchayat Name</label>
                <input 
                    type="text" 
                    value={gpName}
                    onChange={(e) => setGpName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Layer Upload Section */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Input Thematic Maps</h3>
                    <div className="space-y-3">
                        {layers.map(layer => (
                            <div key={layer.id} className="bg-slate-800 p-3 rounded border border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-300">{layer.name}</span>
                                    {layer.previewUrl && <span className="text-[10px] text-emerald-400">Uploaded</span>}
                                </div>
                                {layer.previewUrl ? (
                                    <div className="relative h-16 w-full rounded overflow-hidden group">
                                        <img src={layer.previewUrl} alt={layer.name} className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition" />
                                        <button 
                                            onClick={() => setLayers(l => l.map(x => x.id === layer.id ? {...x, file: null, previewUrl: null} : x))}
                                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500/80 p-1 rounded-full text-white"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-slate-600 rounded cursor-pointer hover:border-emerald-500 hover:bg-slate-700/50 transition">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-slate-500">Click to Upload JPG/PNG</span>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(layer.id, e.target.files[0])} />
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* GP Boundary Input */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Boundary Data</h3>
                    <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <span className="text-sm font-medium text-slate-300">GP Boundary (KMZ/KML)</span>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs text-slate-400">Default Mock Boundary Loaded</span>
                        </div>
                    </div>
                </div>

            </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative bg-slate-800">
             {/* Map Toggle for Mobile */}
             <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="absolute top-4 left-4 z-10 p-2 bg-slate-900 rounded-lg text-white shadow md:hidden"
            >
                {isSidebarOpen ? 'Hide Controls' : 'Show Controls'}
            </button>

            <div className="absolute inset-0 p-4">
                <MapVisualizer 
                    works={identifiedWorks} 
                    selectedWork={selectedWork}
                    onWorkSelect={setSelectedWork}
                />
            </div>

            {/* AI Results Overlay (Right Panel) */}
            {identifiedWorks.length > 0 && (
                <div className="absolute top-4 right-4 bottom-4 w-96 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-700 bg-slate-900 sticky top-0 z-10">
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-white">AI Identification Plan</h2>
                            <span className="bg-emerald-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">{identifiedWorks.length} Works</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Generated using multi-criteria spatial fusion</p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4">
                         {selectedWork && (
                            <WorkCard work={selectedWork} onClose={() => setSelectedWork(null)} />
                        )}

                        <div className="space-y-3">
                            {identifiedWorks.map((work) => (
                                <div 
                                    key={work.id} 
                                    onClick={() => setSelectedWork(work)}
                                    className={`
                                        p-3 rounded cursor-pointer border transition hover:bg-slate-800
                                        ${selectedWork?.id === work.id ? 'bg-slate-800 border-emerald-500' : 'bg-slate-800/50 border-transparent'}
                                    `}
                                >
                                    <div className="flex justify-between">
                                        <h4 className="text-sm font-semibold text-slate-200">{work.work_type}</h4>
                                        <span className={`text-xs font-bold ${work.feasibility_score > 85 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                            {work.feasibility_score}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{work.permissible_work}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>

      </div>
    </div>
  );
};

export default App;
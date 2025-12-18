import React from 'react';
import { WorkItem } from '../types';

interface WorkCardProps {
  work: WorkItem;
  onClose: () => void;
}

const WorkCard: React.FC<WorkCardProps> = ({ work, onClose }) => {
  return (
    <div className="bg-slate-800 border-l-4 border-emerald-500 rounded shadow-lg p-4 mb-4 relative animate-fade-in">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-slate-400 hover:text-white"
      >
        ✕
      </button>
      
      <div className="flex justify-between items-start mb-2 pr-6">
        <div>
          <h3 className="font-bold text-lg text-white">{work.permissible_work}</h3>
          <p className="text-xs text-slate-400 uppercase tracking-wider">{work.master_work_category}</p>
        </div>
        <div className={`
            px-2 py-1 rounded text-xs font-bold
            ${work.feasibility_score > 85 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}
        `}>
            {work.feasibility_score}% Feasible
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 my-3 text-sm">
        <div>
            <span className="block text-slate-500 text-xs">Category ID</span>
            <span className="text-slate-200 font-mono">{work.sub_category_id}</span>
        </div>
        <div>
            <span className="block text-slate-500 text-xs">Beneficiary</span>
            <span className="text-slate-200">{work.beneficiary_type}</span>
        </div>
        <div>
            <span className="block text-slate-500 text-xs">Lat/Lng</span>
            <span className="text-slate-200 font-mono">{work.latitude.toFixed(5)}, {work.longitude.toFixed(5)}</span>
        </div>
        <div>
            <span className="block text-slate-500 text-xs">GAW Status</span>
            <span className="text-slate-200">{work.gaw_status}</span>
        </div>
      </div>

      <div className="bg-slate-900/50 p-3 rounded border border-slate-700 mt-2">
        <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI Spatial Reasoning
        </h4>
        <p className="text-sm text-slate-300 italic">
            "{work.ai_reasoning}"
        </p>
      </div>
    </div>
  );
};

export default WorkCard;
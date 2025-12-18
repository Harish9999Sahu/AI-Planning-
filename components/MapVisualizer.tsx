import React, { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, useMap, useMapsLibrary, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { WorkItem } from '../types';
import { MOCK_GP_BOUNDARY, DEFAULT_CENTER } from '../constants';

interface MapVisualizerProps {
  works: WorkItem[];
  selectedWork: WorkItem | null;
  onWorkSelect: (work: WorkItem) => void;
}

const GPPolygon = () => {
  const map = useMap();
  const maps = useMapsLibrary('maps');
  
  useEffect(() => {
    if (!map || !maps) return;

    const polygon = new maps.Polygon({
      paths: MOCK_GP_BOUNDARY,
      strokeColor: "#10b981", // Emerald 500
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#10b981",
      fillOpacity: 0.15,
    });

    polygon.setMap(map);

    return () => {
      polygon.setMap(null);
    };
  }, [map, maps]);

  return null;
};

const MapVisualizer: React.FC<MapVisualizerProps> = ({ works, selectedWork, onWorkSelect }) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || ""; 
  const [openInfoWindowId, setOpenInfoWindowId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedWork) {
      setOpenInfoWindowId(selectedWork.id);
    }
  }, [selectedWork]);

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 p-8 text-center border border-slate-700 rounded-lg">
        <div>
          <h3 className="text-xl font-bold text-red-400 mb-2">Google Maps API Key Missing</h3>
          <p>Please configure the API key in the environment variables to view the geospatial simulation.</p>
          <div className="mt-4 p-4 bg-slate-800 rounded text-left text-sm font-mono text-emerald-400">
             {`// For demo purposes, works are plotted relative to: \nLat: ${DEFAULT_CENTER.lat}, Lng: ${DEFAULT_CENTER.lng}`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative">
        <Map
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={13}
          mapId="DEMO_MAP_ID" // Required for AdvancedMarker
          mapTypeId="satellite"
          tilt={45}
          className="w-full h-full"
          disableDefaultUI={true}
          gestureHandling={'greedy'}
        >
           <GPPolygon />

           {works.map((work) => (
             <AdvancedMarker
                key={work.id}
                position={{ lat: work.latitude, lng: work.longitude }}
                onClick={() => {
                    onWorkSelect(work);
                    setOpenInfoWindowId(work.id);
                }}
             >
                <Pin 
                    background={work.feasibility_score > 85 ? '#10b981' : '#f59e0b'} 
                    borderColor={'#0f172a'} 
                    glyphColor={'white'} 
                />
             </AdvancedMarker>
           ))}

           {works.map((work) => (
              openInfoWindowId === work.id && (
                <InfoWindow
                  key={`info-${work.id}`}
                  position={{ lat: work.latitude, lng: work.longitude }}
                  onCloseClick={() => setOpenInfoWindowId(null)}
                  headerContent={<span className="font-bold text-slate-900">{work.work_type}</span>}
                >
                  <div className="text-slate-800 text-sm max-w-[200px]">
                    <p className="mb-1 text-xs text-slate-500">{work.gaw_status} • Score: {work.feasibility_score}</p>
                    <p className="line-clamp-3">{work.ai_reasoning}</p>
                  </div>
                </InfoWindow>
              )
           ))}
        </Map>
        
        {/* Map Overlays / Controls */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur text-xs p-2 rounded border border-slate-700 shadow-lg text-white">
            <h4 className="font-bold mb-1 text-emerald-400">Layers</h4>
            <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2"><input type="checkbox" checked readOnly /> GP Boundary</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Satellite</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Drainage Network</label>
            </div>
        </div>
      </div>
    </APIProvider>
  );
};

export default MapVisualizer;
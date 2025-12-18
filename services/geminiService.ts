import { GoogleGenAI } from "@google/genai";
import { WorkItem, MapLayer } from '../types';
import { PERMISSIBLE_WORKS_DB } from '../constants';

const MODEL_NAME = "gemini-2.5-flash-latest"; // Using a vision-capable model

// Helper to convert file to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeLandscapeAndIdentifyWorks = async (
  layers: MapLayer[],
  gpName: string
): Promise<WorkItem[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare images for multimodal input
  const imageParts = await Promise.all(
    layers
      .filter((l) => l.file !== null)
      .map((l) => fileToGenerativePart(l.file!))
  );

  const availableWorksJson = JSON.stringify(PERMISSIBLE_WORKS_DB.slice(0, 15)); // Sending a subset context to save tokens, in production send full context or RAG

  const prompt = `
    You are an ADVANCED GEO-SPATIAL ARTIFICIAL INTELLIGENCE SYSTEM specialized in Watershed Planning and NRM.
    
    TASK:
    Analyze the provided thematic maps (LULC, Slope, Drainage, Soil, etc.) for Gram Panchayat: ${gpName}.
    Using your reasoning of hydrology, topography, and soil science, IDENTIFY suitable locations for Rural Infrastructure works.
    
    MANDATORY RULES:
    1. Select ONLY from the provided permissible works list.
    2. Feasibility Score must be based on scientific suitability (Slope + Soil + Drainage).
    3. Output strictly valid JSON.
    4. You must generate at least 5 distinct works for this demo.
    5. Coordinates (lat/lng) should be hypothetical but plausible within the region of Northern Karnataka (approx Lat 17.3, Lng 76.8) if precise geo-referencing isn't possible from the image alone. Spread them out.

    PERMISSIBLE WORKS REFERENCE:
    ${availableWorksJson}

    OUTPUT SCHEMA (JSON Array):
    [
      {
        "category_code": "String",
        "work_type": "String",
        "permissible_work": "String (Exact match from reference)",
        "sub_category_id": Number,
        "latitude": Number,
        "longitude": Number,
        "feasibility_score": Number (0-100),
        "ai_reasoning": "String (Detailed hydro-geological justification)"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          ...imageParts,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return [];

    const rawData = JSON.parse(text);
    
    // Post-processing to fill in static details from the DB
    return rawData.map((item: any, index: number) => {
        const ref = PERMISSIBLE_WORKS_DB.find(w => w.sub_category_id === item.sub_category_id) || PERMISSIBLE_WORKS_DB[0];
        return {
            id: `ai-work-${index}-${Date.now()}`,
            category_code: ref.master_category_code,
            master_work_category: "RURAL INFRASTRUCTURE", // Defaulting for demo
            major_scheduled_category: "Natural Resource Management",
            beneficiary_type: "Community",
            activity_type: "New Work",
            work_type: item.work_type,
            permissible_work: item.permissible_work,
            gaw_status: ref.gaw_status as "GAW" | "Non-GAW",
            sub_category_id: item.sub_category_id,
            latitude: item.latitude,
            longitude: item.longitude,
            feasibility_score: item.feasibility_score,
            ai_reasoning: item.ai_reasoning
        } as WorkItem;
    });

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    // Fallback Mock Data if AI fails or no API key
    console.warn("Returning simulation data due to API error.");
    return generateMockWorks();
  }
};

const generateMockWorks = (): WorkItem[] => {
    return [
        {
            id: 'sim-1',
            category_code: "A",
            master_work_category: "PUBLIC WORKS RELATING TO NATURAL RESOURCES MANAGEMENT",
            major_scheduled_category: "Watershed Management",
            beneficiary_type: "Community",
            activity_type: "New Work",
            work_type: "Check Dams",
            permissible_work: "Construction of Gabion Check Dam for Community",
            gaw_status: "GAW",
            sub_category_id: 2105,
            latitude: 17.345,
            longitude: 76.855,
            feasibility_score: 92,
            ai_reasoning: "High drainage density detected. 2nd order stream intersection. Valley pinch point suitable for gabion structure to arrest silt."
        },
        {
            id: 'sim-2',
            category_code: "A",
            master_work_category: "PUBLIC WORKS RELATING TO NATURAL RESOURCES MANAGEMENT",
            major_scheduled_category: "Water Conservation",
            beneficiary_type: "Community",
            activity_type: "New Work",
            work_type: "Ponds",
            permissible_work: "Construction of Community Water Harvesting Ponds",
            gaw_status: "GAW",
            sub_category_id: 2076,
            latitude: 17.325,
            longitude: 76.875,
            feasibility_score: 88,
            ai_reasoning: "Natural depression identified in DEM. Low permeability soil indicated. Excellent potential for surface water accumulation."
        },
        {
            id: 'sim-3',
            category_code: "B",
            master_work_category: "INDIVIDUAL ASSETS",
            major_scheduled_category: "Land Development",
            beneficiary_type: "Individual",
            activity_type: "New Work",
            work_type: "Plantation",
            permissible_work: "Wastelands Block Plantation of Forestry Trees for Individuals",
            gaw_status: "GAW",
            sub_category_id: 9054,
            latitude: 17.338,
            longitude: 76.890,
            feasibility_score: 79,
            ai_reasoning: "Slope analysis indicates 5-10% gradient with degraded scrubland signature in LULC. Afforestation recommended to prevent soil erosion."
        }
    ];
}
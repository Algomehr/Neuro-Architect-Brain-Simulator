
import { GoogleGenAI, Type } from "@google/genai";
import { BrainParameters, GeminiResponse } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        narrativeReport: { 
            type: Type.STRING, 
            description: "A creative, first-person story of a typical day for this individual. Describe their thoughts, feelings, social interactions, and problem-solving approaches. Should be about 3-4 paragraphs long."
        },
        researcherReport: {
            type: Type.OBJECT,
            properties: {
                cognitiveAnalysis: {
                    type: Type.OBJECT,
                    properties: {
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["strengths", "weaknesses"]
                },
                bigFiveProfile: {
                    type: Type.OBJECT,
                    properties: {
                        openness: { type: Type.NUMBER, description: "Score from 0-100" },
                        conscientiousness: { type: Type.NUMBER, description: "Score from 0-100" },
                        extraversion: { type: Type.NUMBER, description: "Score from 0-100" },
                        agreeableness: { type: Type.NUMBER, description: "Score from 0-100" },
                        neuroticism: { type: Type.NUMBER, description: "Score from 0-100" }
                    },
                    required: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]
                },
                predispositions: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "List potential predispositions like anxiety, high creativity, depression, focus, etc."
                }
            },
            required: ["cognitiveAnalysis", "bigFiveProfile", "predispositions"]
        },
        chartsData: {
            type: Type.OBJECT,
            properties: {
                radarProfile: {
                    type: Type.OBJECT,
                    properties: {
                        memory: { type: Type.NUMBER, description: "Score from 0-100" },
                        creativity: { type: Type.NUMBER, description: "Score from 0-100" },
                        attention: { type: Type.NUMBER, description: "Score from 0-100" },
                        logic: { type: Type.NUMBER, description: "Score from 0-100" },
                        emotionalIntelligence: { type: Type.NUMBER, description: "Score from 0-100" },
                    },
                    required: ["memory", "creativity", "attention", "logic", "emotionalIntelligence"]
                },
                neurotransmitterBalance: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.NUMBER }
                        },
                        required: ["name", "value"]
                    }
                },
                stressResponseCurve: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            time: { type: Type.NUMBER, description: "Time point, e.g., 0, 1, 2..." },
                            cortisol: { type: Type.NUMBER },
                            dopamine: { type: Type.NUMBER }
                        },
                        required: ["time", "cortisol", "dopamine"]
                    },
                    description: "Simulate levels over 8-10 time points after a stressful event."
                },
                brainActivityMap: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            area: { type: Type.STRING, description: "e.g., PFC, Amygdala, Hippocampus, Striatum" },
                            x: { type: Type.NUMBER, description: "Coordinate between -10 and 10" },
                            y: { type: Type.NUMBER, description: "Coordinate between -10 and 10" },
                            activity: { type: Type.NUMBER, description: "Activity level from 0 to 100" },
                        },
                        required: ["area", "x", "y", "activity"]
                    },
                    description: "Provide data for 5-7 key brain regions."
                }
            },
            required: ["radarProfile", "neurotransmitterBalance", "stressResponseCurve", "brainActivityMap"]
        }
    },
    required: ["narrativeReport", "researcherReport", "chartsData"]
};

const createPrompt = (params: BrainParameters): string => `
You are a sophisticated neuroscience and psychology simulator called Neuro-Architect.
Your task is to generate a detailed profile of a person based on a custom-engineered brain.
Analyze the following neurochemical and structural parameters (where 0 is extremely low and 100 is extremely high) and their complex interactions.

**Brain Parameters:**
- Baseline Dopamine: ${params.dopamine} (Motivation, reward, focus)
- Baseline Serotonin: ${params.serotonin} (Mood, impulsivity, anxiety regulation)
- Baseline Acetylcholine: ${params.acetylcholine} (Learning, memory, attention)
- Baseline GABA: ${params.gaba} (Inhibitory, calming, anxiety reduction)
- Baseline Glutamate: ${params.glutamate} (Excitatory, learning, neural activation)
- Synaptic Plasticity: ${params.synapticPlasticity} (Ability to learn and form new memories)
- Receptor Sensitivity: ${params.receptorSensitivity} (How strongly neurons react to neurotransmitters)
- PFC-Amygdala Connectivity: ${params.pfcAmygdalaConnectivity} (Top-down control of emotion and impulses)
- Baseline Cortisol: ${params.cortisol} (Stress hormone, alertness)
- Baseline Oxytocin: ${params.oxytocin} (Social bonding, trust, empathy)

Based on these parameters, generate a detailed, scientifically-plausible analysis in the required JSON format.
The analysis should be insightful and reflect the interplay between different parameters. For example, high dopamine and low PFC-Amygdala connectivity might lead to impulsive, reward-seeking behavior. Low serotonin and high cortisol could predispose to anxiety. High synaptic plasticity and acetylcholine would suggest a fast learner.
`;

export const generateBrainProfile = async (params: BrainParameters): Promise<GeminiResponse> => {
    const prompt = createPrompt(params);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.8,
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Basic validation
        if (!parsedJson.narrativeReport || !parsedJson.researcherReport || !parsedJson.chartsData) {
            throw new Error("Invalid JSON structure received from API.");
        }

        return parsedJson as GeminiResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate brain profile from Gemini API.");
    }
};

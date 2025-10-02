
export interface BrainParameters {
  dopamine: number;
  serotonin: number;
  acetylcholine: number;
  gaba: number;
  glutamate: number;
  synapticPlasticity: number;
  receptorSensitivity: number;
  pfcAmygdalaConnectivity: number;
  cortisol: number;
  oxytocin: number;
}

export interface BigFiveProfile {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface ResearcherReport {
  cognitiveAnalysis: {
    strengths: string[];
    weaknesses: string[];
  };
  bigFiveProfile: BigFiveProfile;
  predispositions: string[];
}

export interface RadarProfile {
  memory: number;
  creativity: number;
  attention: number;
  logic: number;
  emotionalIntelligence: number;
}

export interface NameValue {
  name: string;
  value: number;
}

export interface StressResponsePoint {
    time: number;
    cortisol: number;
    dopamine: number;
}

export interface BrainActivityPoint {
    area: string;
    x: number;
    y: number;
    activity: number;
}

export interface ChartsData {
  radarProfile: RadarProfile;
  neurotransmitterBalance: NameValue[];
  stressResponseCurve: StressResponsePoint[];
  brainActivityMap: BrainActivityPoint[];
}

export interface GeminiResponse {
  narrativeReport: string;
  researcherReport: ResearcherReport;
  chartsData: ChartsData;
}

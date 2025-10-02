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

export interface FormulaExplanation {
  formula: string;
  calculation: string;
  explanation: string;
}

export interface ScientificAnalysis {
  cognitiveMetrics: Record<string, FormulaExplanation>;
  personalityTraits: Record<string, FormulaExplanation>;
  summary: string;
}

export interface GeminiResponse {
  narrativeReport: string;
  researcherReport: ResearcherReport;
  chartsData: ChartsData;
  scientificAnalysis: ScientificAnalysis;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface EmotionalResponsePoint {
    time: string; // e.g., "شروع", "اواسط", "پایان"
    stress: number;
    focus: number;
    confidence: number;
}

export interface PerformanceMetric {
    name: string;
    value: number;
    explanation: string;
}

export interface ScenarioSimulation {
    narrative: string;
    outcome: string;
    emotionalResponseCurve: EmotionalResponsePoint[];
    performanceMetrics: PerformanceMetric[];
}
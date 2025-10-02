
import React, { useState, useCallback } from 'react';
import { BrainParameters, GeminiResponse } from './types';
import { generateBrainProfile } from './services/geminiService';
import ControlPanel from './components/ControlPanel';
import OutputDisplay from './components/OutputDisplay';
import { BrainCircuit, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [brainParams, setBrainParams] = useState<BrainParameters>({
    dopamine: 50,
    serotonin: 50,
    acetylcholine: 50,
    gaba: 50,
    glutamate: 50,
    synapticPlasticity: 50,
    receptorSensitivity: 50,
    pfcAmygdalaConnectivity: 50,
    cortisol: 50,
    oxytocin: 50,
  });
  const [simulationResult, setSimulationResult] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSimulationResult(null);
    try {
      const result = await generateBrainProfile(brainParams);
      setSimulationResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the simulation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [brainParams]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 lg:p-6">
      <header className="mb-6 border-b border-blue-400/30 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrainCircuit className="w-10 h-10 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Neuro-Architect</h1>
            <p className="text-sm text-gray-400">یک ذهن را مهندسی کنید و پیامدهای آن را مشاهده نمایید</p>
          </div>
        </div>
        <a href="https://github.com/google/generative-ai-docs/tree/main/site/en/gemini-api/docs/prompting_with_media" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            <Bot size={16} />
            Powered by Gemini
        </a>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-1 xl:col-span-1">
          <ControlPanel
            parameters={brainParams}
            onParameterChange={setBrainParams}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-2 xl:col-span-3">
          <OutputDisplay
            result={simulationResult}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

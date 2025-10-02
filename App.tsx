import React, { useState, useCallback } from 'react';
import { BrainParameters, GeminiResponse, ChatMessage, ScenarioSimulation } from './types';
import { generateBrainProfile, createChatSession, simulateScenario } from './services/geminiService';
import ControlPanel from './components/ControlPanel';
import OutputDisplay from './components/OutputDisplay';
import { BrainCircuit, Bot } from 'lucide-react';
import type { Chat } from '@google/genai';


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
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [scenarioResult, setScenarioResult] = useState<ScenarioSimulation | null>(null);
  const [isScenarioLoading, setIsScenarioLoading] = useState<boolean>(false);


  const handleResetScenario = useCallback(() => {
    setScenarioResult(null);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSimulationResult(null);
    // Reset chat on new simulation
    setChatSession(null);
    setChatHistory([]);
    setIsChatLoading(false);
    // Reset scenario on new simulation
    handleResetScenario();

    try {
      const result = await generateBrainProfile(brainParams);
      setSimulationResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the simulation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [brainParams, handleResetScenario]);

  const handleSendMessage = async (message: string) => {
    if (!simulationResult || !message.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, newUserMessage]);
    setIsChatLoading(true);

    try {
        // Lazy initialization of the chat session
        const session = chatSession ?? createChatSession(brainParams, simulationResult);
        if (!chatSession) {
            setChatSession(session);
        }
        
        const response = await session.sendMessage(message);
        const modelResponse: ChatMessage = { role: 'model', text: response.text };
        
        setChatHistory(prev => [...prev, modelResponse]);

    } catch (err) {
        console.error("Chat error:", err);
        const errorResponse: ChatMessage = { role: 'model', text: "متاسفانه در پردازش درخواست شما خطایی رخ داد. لطفا دوباره تلاش کنید." };
        setChatHistory(prev => [...prev, errorResponse]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleSimulateScenario = async (scenario: string) => {
    if (!simulationResult) return;

    setIsScenarioLoading(true);
    setError(null);
    setScenarioResult(null);

    try {
        const result = await simulateScenario(brainParams, simulationResult, scenario);
        setScenarioResult(result);
    } catch (err) {
        console.error(err);
        setError('خطایی در حین شبیه‌سازی سناریو رخ داد. لطفا دوباره تلاش کنید.');
    } finally {
        setIsScenarioLoading(false);
    }
  };


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
            chatHistory={chatHistory}
            isChatLoading={isChatLoading}
            onSendMessage={handleSendMessage}
            scenarioResult={scenarioResult}
            isScenarioLoading={isScenarioLoading}
            onSimulateScenario={handleSimulateScenario}
            onResetScenario={handleResetScenario}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
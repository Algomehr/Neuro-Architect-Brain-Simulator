
import React from 'react';
import { BrainParameters } from '../types';
import { SlidersHorizontal, Zap } from 'lucide-react';

interface ControlPanelProps {
  parameters: BrainParameters;
  onParameterChange: (newParams: BrainParameters) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const Slider: React.FC<{
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ label, description, value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-1">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <span className="text-xs text-gray-500 ml-2">{description}</span>
    </label>
    <div className="flex items-center gap-3">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <span className="text-sm font-semibold text-blue-400 w-8 text-center">{value}</span>
    </div>
  </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({
  parameters,
  onParameterChange,
  onGenerate,
  isLoading,
}) => {
  const handleSliderChange = <K extends keyof BrainParameters,>(param: K, value: BrainParameters[K]) => {
    onParameterChange({ ...parameters, [param]: value });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-lg border border-gray-700 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
            <SlidersHorizontal className="text-blue-400" />
            <h2 className="text-xl font-bold text-white">پارامترهای مغز</h2>
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
            <Slider label="دوپامین" description="انگیزه، پاداش" value={parameters.dopamine} onChange={(v) => handleSliderChange('dopamine', v)} />
            <Slider label="سروتونین" description="خلق‌وخو، اضطراب" value={parameters.serotonin} onChange={(v) => handleSliderChange('serotonin', v)} />
            <Slider label="استیل‌کولین" description="یادگیری، حافظه" value={parameters.acetylcholine} onChange={(v) => handleSliderChange('acetylcholine', v)} />
            <Slider label="گابا (GABA)" description="آرام‌بخش" value={parameters.gaba} onChange={(v) => handleSliderChange('gaba', v)} />
            <Slider label="گلوتامات" description="تحریک‌کننده" value={parameters.glutamate} onChange={(v) => handleSliderChange('glutamate', v)} />
            <Slider label="پلاستیسیته سیناپسی" description="سرعت یادگیری" value={parameters.synapticPlasticity} onChange={(v) => handleSliderChange('synapticPlasticity', v)} />
            <Slider label="حساسیت گیرنده‌ها" description="واکنش نورون‌ها" value={parameters.receptorSensitivity} onChange={(v) => handleSliderChange('receptorSensitivity', v)} />
            <Slider label="اتصال پری‌فرونتال-آمیگدال" description="کنترل هیجانات" value={parameters.pfcAmygdalaConnectivity} onChange={(v) => handleSliderChange('pfcAmygdalaConnectivity', v)} />
            <Slider label="کورتیزول" description="استرس" value={parameters.cortisol} onChange={(v) => handleSliderChange('cortisol', v)} />
            <Slider label="اکسی‌توسین" description="اعتماد، ارتباط" value={parameters.oxytocin} onChange={(v) => handleSliderChange('oxytocin', v)} />
        </div>
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-500 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            در حال شبیه‌سازی...
          </>
        ) : (
          <>
            <Zap size={18}/>
            شبیه‌سازی کن
          </>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;

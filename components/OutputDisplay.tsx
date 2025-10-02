
import React, { useState } from 'react';
import { GeminiResponse } from '../types';
import ReportView from './ReportView';
import ChartsView from './ChartsView';
import { FileText, BarChart3, Brain, AlertTriangle } from 'lucide-react';

interface OutputDisplayProps {
  result: GeminiResponse | null;
  isLoading: boolean;
  error: string | null;
}

type Tab = 'narrative' | 'researcher' | 'charts';

const OutputDisplay: React.FC<OutputDisplayProps> = ({ result, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState<Tab>('narrative');

  const tabs = [
    { id: 'narrative', label: 'حالت روایی', icon: FileText },
    { id: 'researcher', label: 'گزارش پژوهشگر', icon: Brain },
    { id: 'charts', label: 'نمودارها', icon: BarChart3 },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          <h3 className="text-xl font-semibold mt-6 text-white">...در حال ساختن ذهن</h3>
          <p className="text-gray-400 mt-2">...پردازش پارامترهای عصبی و شبیه‌سازی شخصیت</p>
        </div>
      );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-red-900/20 border border-red-500/50 rounded-lg">
                <AlertTriangle className="w-16 h-16 text-red-400" />
                <h3 className="text-xl font-semibold mt-6 text-red-300">خطا در شبیه‌سازی</h3>
                <p className="text-red-400 mt-2">{error}</p>
            </div>
        );
    }

    if (!result) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <Brain className="w-20 h-20 text-gray-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-400">شبیه‌ساز مغز منتظر شماست</h3>
          <p className="text-gray-500 mt-2">
            پارامترهای سمت چپ را تنظیم کنید و دکمه "شبیه‌سازی کن" را بزنید تا گزارش تولید شود.
          </p>
        </div>
      );
    }
    
    switch (activeTab) {
        case 'narrative':
            return <ReportView title="حالت روایی: یک روز از زندگی" content={result.narrativeReport} />;
        case 'researcher':
            return <ReportView title="گزارش عصب-روان‌شناختی" reportData={result.researcherReport} />;
        case 'charts':
            return <ChartsView chartsData={result.chartsData} />;
        default:
            return null;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 h-full flex flex-col min-h-[80vh]">
      <div className="border-b border-gray-700">
        <nav className="flex space-x-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-grow p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default OutputDisplay;

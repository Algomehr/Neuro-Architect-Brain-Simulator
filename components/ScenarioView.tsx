import React, { useState } from 'react';
import { ScenarioSimulation } from '../types';
import { Zap } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ScenarioViewProps {
  onSimulate: (scenario: string) => void;
  result: ScenarioSimulation | null;
  isLoading: boolean;
  onReset: () => void;
}

const scenarios = [
    {
        id: 'presentation',
        title: 'ارائه مهم در محل کار',
        description: 'شما باید یک پروژه کلیدی را که ماه‌ها روی آن کار کرده‌اید به مدیران ارشد شرکت ارائه دهید.'
    },
    {
        id: 'argument',
        title: 'بحث غیرمنتظره با یک دوست',
        description: 'یک دوست نزدیک شما را به چیزی متهم می‌کند که فکر می‌کنید ناعادلانه است و بحثی بین شما در می‌گیرد.'
    },
    {
        id: 'creative_challenge',
        title: 'مواجهه با یک چالش خلاقانه',
        description: 'در پروژه خود با یک مشکل پیچیده روبرو شده‌اید که راه‌حل مشخصی ندارد و باید یک رویکرد کاملاً جدید ابداع کنید.'
    },
    {
        id: 'social_gathering',
        title: 'شرکت در یک گردهمایی اجتماعی بزرگ',
        description: 'شما به یک مهمانی دعوت شده‌اید که در آن افراد زیادی را نمی‌شناسید و باید با غریبه‌ها ارتباط برقرار کنید.'
    }
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900/80 p-2 border border-gray-600 rounded-md shadow-lg text-sm">
                <p className="label text-gray-300 font-bold">{`مرحله: ${label}`}</p>
                {payload.map((pld: any, index: number) => (
                    <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-300 border-b border-blue-300/20 pb-2 mb-3">{title}</h3>
        {children}
    </div>
);


const ScenarioView: React.FC<ScenarioViewProps> = ({ onSimulate, result, isLoading, onReset }) => {
    const [selectedScenario, setSelectedScenario] = useState<string>(scenarios[0].description);

    const handleSimulateClick = () => {
        if (selectedScenario && !isLoading) {
            onSimulate(selectedScenario);
        }
    };

    if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-green-400/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-green-400 rounded-full animate-spin"></div>
              </div>
            <h3 className="text-xl font-semibold mt-6 text-white">...در حال اجرای شبیه‌سازی سناریو</h3>
            <p className="text-gray-400 mt-2">...پردازش واکنش‌های احتمالی و پیش‌بینی نتایج</p>
          </div>
        );
    }

    if (!result) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">شبیه‌سازی سناریو</h2>
                <p className="text-gray-400 mb-6">یک سناریو را انتخاب کنید تا ببینید این پروفایل مغزی چگونه در آن موقعیت واکنش نشان می‌دهد.</p>
                
                <div className="space-y-3 mb-6">
                    {scenarios.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedScenario(s.description)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${selectedScenario === s.description ? 'bg-blue-900/50 border-blue-500' : 'bg-gray-800 border-gray-700 hover:border-blue-600'}`}
                        >
                            <h4 className="font-semibold text-white">{s.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{s.description}</p>
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSimulateClick}
                    disabled={!selectedScenario || isLoading}
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    <Zap size={18} />
                    شبیه‌سازی کن
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">نتایج شبیه‌سازی سناریو</h2>
            
            <ReportSection title="روایت رویداد">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{result.narrative}</p>
            </ReportSection>

            <ReportSection title="نتیجه نهایی">
                <p className="text-gray-400 italic">{result.outcome}</p>
            </ReportSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div>
                    <ReportSection title="معیارهای عملکرد">
                        <div className="space-y-4">
                            {result.performanceMetrics.map(metric => (
                                <div key={metric.name}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium">{metric.name}</span>
                                        <span className="text-sm font-bold text-green-300">{metric.value}/100</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${metric.value}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 italic">{metric.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </ReportSection>
                </div>
                <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700">
                     <h3 className="text-md font-semibold text-blue-300 mb-4 text-center">پاسخ هیجانی و شناختی</h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={result.emotionalResponseCurve} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                <XAxis dataKey="time" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                                <YAxis domain={[0, 100]} tick={{ fill: '#a0aec0', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                                <Line type="monotone" dataKey="stress" name="استرس" stroke="#f87171" strokeWidth={2} />
                                <Line type="monotone" dataKey="focus" name="تمرکز" stroke="#38bdf8" strokeWidth={2} />
                                <Line type="monotone" dataKey="confidence" name="اعتماد به نفس" stroke="#34d399" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
             <button
                onClick={onReset}
                className="w-1/2 mx-auto mt-8 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-all duration-300 flex items-center justify-center gap-2"
            >
                شبیه‌سازی سناریوی دیگر
            </button>
        </div>
    );
};

export default ScenarioView;
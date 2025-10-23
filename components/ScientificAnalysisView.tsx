
import React from 'react';
import { ScientificAnalysis, FormulaExplanation } from '../types';
import * as ReactKatex from 'react-katex';

interface ScientificAnalysisViewProps {
  analysisData: ScientificAnalysis;
}

const bigFiveMap: { [key: string]: string } = {
    openness: 'گشودگی به تجربه',
    conscientiousness: 'وجدان‌گرایی',
    extraversion: 'برون‌گرایی',
    agreeableness: 'سازگاری',
    neuroticism: 'روان‌رنجوری',
};

const cognitiveMetricsMap: { [key: string]: string } = {
    memory: 'حافظه',
    creativity: 'خلاقیت',
    attention: 'توجه',
    logic: 'منطق',
    emotionalIntelligence: 'هوش هیجانی',
};


const FormulaBlock: React.FC<{ title: string; data: FormulaExplanation }> = ({ title, data }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 mb-4">
        <h4 className="text-md font-semibold text-blue-300 mb-3">{title}</h4>
        <div className="space-y-3 text-sm">
            <div>
                <p className="text-xs text-gray-400 mb-1">فرمول</p>
                <div className="block bg-gray-800 p-2 rounded-md text-gray-300 text-xs whitespace-pre-wrap">
                    <ReactKatex.BlockMath math={data.formula} />
                </div>
            </div>
            <div>
                <p className="text-xs text-gray-400 mb-1">محاسبه</p>
                <div className="block bg-gray-800 p-2 rounded-md text-gray-300 text-xs whitespace-pre-wrap">
                   <ReactKatex.BlockMath math={data.calculation} />
                </div>
            </div>
             <div>
                <p className="text-xs text-gray-400 mb-1">توجیه</p>
                <p className="text-gray-400 text-xs italic">{data.explanation}</p>
            </div>
        </div>
    </div>
);


const ScientificAnalysisView: React.FC<ScientificAnalysisViewProps> = ({ analysisData }) => {
  return (
    <div className="text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-bold text-white mb-6">تحلیل علمی محاسباتی</h2>

        <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-300 border-b border-blue-300/20 pb-2 mb-4">محاسبه معیارهای شناختی</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(analysisData.cognitiveMetrics).map(([key, value]) => (
                    <FormulaBlock key={key} title={cognitiveMetricsMap[key] || key} data={value} />
                ))}
            </div>
        </div>

        <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-300 border-b border-blue-300/20 pb-2 mb-4">محاسبه ویژگی‌های شخصیتی</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(analysisData.personalityTraits).map(([key, value]) => (
                    <FormulaBlock key={key} title={bigFiveMap[key] || key} data={value} />
                ))}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-blue-300 border-b border-blue-300/20 pb-2 mb-4">خلاصه مدل</h3>
            <p className="text-sm text-gray-400 italic">
                {analysisData.summary}
            </p>
        </div>
    </div>
  );
};

export default ScientificAnalysisView;

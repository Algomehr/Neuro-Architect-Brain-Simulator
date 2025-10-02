
import React from 'react';
import { ResearcherReport } from '../types';

interface ReportViewProps {
  title: string;
  content?: string;
  reportData?: ResearcherReport;
}

const bigFiveMap: { [key: string]: string } = {
    openness: 'گشودگی به تجربه',
    conscientiousness: 'وجدان‌گرایی',
    extraversion: 'برون‌گرایی',
    agreeableness: 'سازگاری',
    neuroticism: 'روان‌رنجوری',
};

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-blue-300 border-b border-blue-300/20 pb-2 mb-3">{title}</h3>
        {children}
    </div>
);

const ReportView: React.FC<ReportViewProps> = ({ title, content, reportData }) => {
  return (
    <div className="text-gray-300 leading-relaxed">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      
      {content && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}></div>}

      {reportData && (
        <>
            <ReportSection title="تحلیل شناختی">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-green-400 mb-2">نقاط قوت</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {reportData.cognitiveAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">نقاط ضعف</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {reportData.cognitiveAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </div>
                </div>
            </ReportSection>

            <ReportSection title="پروفایل شخصیتی (Big Five)">
                <div className="space-y-3">
                    {Object.entries(reportData.bigFiveProfile).map(([key, value]) => (
                        <div key={key}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium capitalize">{bigFiveMap[key as keyof typeof bigFiveMap] || key}</span>
                                <span className="text-sm font-bold text-blue-300">{value}/100</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </ReportSection>

            <ReportSection title="استعدادها و تمایلات">
                <div className="flex flex-wrap gap-2">
                    {reportData.predispositions.map((p, i) => (
                        <span key={i} className="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1 rounded-full">{p}</span>
                    ))}
                </div>
            </ReportSection>
        </>
      )}
    </div>
  );
};

export default ReportView;

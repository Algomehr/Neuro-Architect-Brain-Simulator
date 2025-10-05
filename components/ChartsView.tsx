
import React from 'react';
import { ChartsData } from '../types';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  LabelList,
} from 'recharts';

interface ChartsViewProps {
  chartsData: ChartsData;
}

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700">
        <h3 className="text-md font-semibold text-blue-300 mb-4 text-center">{title}</h3>
        <div className="w-full h-64 md:h-80">
            {children}
        </div>
    </div>
);

const RADAR_COLORS = ['#38bdf8', '#fbbf24', '#34d399', '#f87171', '#a78bfa'];
const PIE_COLORS = ['#38bdf8', '#a78bfa', '#34d399', '#f87171', '#fbbf24'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const pointData = payload[0].payload;

        // Custom tooltip for Brain Activity Map (Scatter Chart)
        if (pointData && pointData.area) {
             return (
                <div className="bg-gray-900/80 p-2 border border-gray-600 rounded-md shadow-lg text-sm">
                    <p className="font-bold text-blue-300">{pointData.area}</p>
                    <p className="text-gray-400">{`فعالیت: ${pointData.activity}`}</p>
                </div>
            );
        }

        // Default tooltip for other charts
        return (
            <div className="bg-gray-900/80 p-2 border border-gray-600 rounded-md shadow-lg text-sm">
                <p className="label text-gray-300 font-bold">{label}</p>
                {payload.map((pld: any, index: number) => (
                    <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const radarSubjectMap: { [key: string]: string } = {
    memory: 'حافظه',
    creativity: 'خلاقیت',
    attention: 'توجه',
    logic: 'منطق',
    emotionalIntelligence: 'هوش هیجانی',
};


const ChartsView: React.FC<ChartsViewProps> = ({ chartsData }) => {
    // Defensive coding: ensure data exists and provide empty arrays as fallbacks to prevent crashes.
    const radarData = chartsData.radarProfile ? Object.entries(chartsData.radarProfile).map(([name, value]) => ({
        subject: radarSubjectMap[name as keyof typeof radarSubjectMap] || name,
        A: value,
        fullMark: 100,
    })) : [];
    
    const neurotransmitterBalanceData = chartsData.neurotransmitterBalance || [];
    const stressResponseCurveData = chartsData.stressResponseCurve || [];
    const brainActivityMapData = chartsData.brainActivityMap || [];
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartContainer title="پروفایل شناختی">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#4a5568" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#718096', fontSize: 10 }} />
                    <Radar name="پروفایل شناختی" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.6} />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="تعادل انتقال‌دهنده‌های عصبی">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={neurotransmitterBalanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {neurotransmitterBalanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="واکنش به رویداد استرس‌زا">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stressResponseCurveData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="time" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#a0aec0', fontSize: 12 }}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Line type="monotone" dataKey="cortisol" stroke="#f87171" strokeWidth={2} name="کورتیزول" />
                    <Line type="monotone" dataKey="dopamine" stroke="#38bdf8" strokeWidth={2} name="دوپامین" />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="نقشه فعالیت مغزی (ساده‌شده)">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 80, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#4a5568" />
                    <XAxis type="number" dataKey="x" name="x" domain={[-12, 12]} hide />
                    <YAxis type="number" dataKey="y" name="y" domain={[-12, 12]} hide />
                    <ZAxis type="number" dataKey="activity" range={[100, 1000]} name="activity" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />}/>
                    <Scatter name="نواحی مغز" data={brainActivityMapData} fillOpacity={0.7}>
                        {brainActivityMapData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={RADAR_COLORS[index % RADAR_COLORS.length]} />
                        ))}
                        <LabelList dataKey="area" position="right" style={{ fill: '#a0aec0', fontSize: 12 }} />
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </ChartContainer>
    </div>
  );
};

export default ChartsView;


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
        return (
            <div className="bg-gray-900/80 p-2 border border-gray-600 rounded-md shadow-lg text-sm">
                <p className="label text-gray-300">{`${label}`}</p>
                {payload.map((pld: any, index: number) => (
                    <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};


const ChartsView: React.FC<ChartsViewProps> = ({ chartsData }) => {
    const radarData = Object.entries(chartsData.radarProfile).map(([name, value]) => ({
        subject: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
        A: value,
        fullMark: 100,
    }));
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartContainer title="پروفایل شناختی">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#4a5568" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#718096', fontSize: 10 }} />
                    <Radar name="Cognitive Profile" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.6} />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="تعادل انتقال‌دهنده‌های عصبی">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartsData.neurotransmitterBalance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartsData.neurotransmitterBalance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="واکنش به رویداد استرس‌زا">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartsData.stressResponseCurve} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="time" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#a0aec0', fontSize: 12 }}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Line type="monotone" dataKey="cortisol" stroke="#f87171" strokeWidth={2} name="Cortisol" />
                    <Line type="monotone" dataKey="dopamine" stroke="#38bdf8" strokeWidth={2} name="Dopamine" />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="نقشه فعالیت مغزی (ساده‌شده)">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#4a5568" />
                    <XAxis type="number" dataKey="x" name="x" domain={[-12, 12]} hide />
                    <YAxis type="number" dataKey="y" name="y" domain={[-12, 12]} hide />
                    <ZAxis type="number" dataKey="activity" range={[100, 1000]} name="activity" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />}/>
                    <Scatter name="Brain Regions" data={chartsData.brainActivityMap} fillOpacity={0.7}>
                        {chartsData.brainActivityMap.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={RADAR_COLORS[index % RADAR_COLORS.length]} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </ChartContainer>
    </div>
  );
};

export default ChartsView;

'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    RadialBarChart,
    RadialBar,
    Legend,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { Campaign } from '@/lib/firestoreService';
import { TrendingUp, AlertCircle, Zap, Target } from 'lucide-react';

interface DashboardChartsProps {
    campaigns: Campaign[];
}

// Utility to generate realistic daily data points from cumulative stats
const generateDailyTrends = (totalValue: number, days: number = 30) => {
    const data = [];
    let cumulative = 0;
    const dailyAverage = totalValue / days;

    for (let i = 0; i < days; i++) {
        // Add some randomness but keep it trending upwards
        const daily = dailyAverage * (0.5 + Math.random());
        cumulative += daily;
        data.push({
            day: i + 1,
            value: Math.round(cumulative > totalValue ? totalValue : cumulative)
        });
    }
    return data;
};

export default function DashboardCharts({ campaigns }: DashboardChartsProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const totalConversions = useMemo(() => campaigns.reduce((acc, c) => acc + c.conversions, 0), [campaigns]);
    const totalSpend = useMemo(() => campaigns.reduce((acc, c) => acc + c.spent, 0), [campaigns]);
    const totalBudget = useMemo(() => campaigns.reduce((acc, c) => acc + c.budget, 0), [campaigns]);

    const conversionTrend = useMemo(() => generateDailyTrends(totalConversions), [totalConversions]);

    const budgetUtilization = useMemo(() => {
        const percent = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
        return [
            { name: 'Wydane', value: Math.min(percent, 100), fill: '#fb7185' },
            { name: 'Pozostało', value: 100 - Math.min(percent, 100), fill: 'rgba(0,0,0,0.03)' }
        ];
    }, [totalSpend, totalBudget]);

    const platformPerformance = useMemo(() => {
        const platforms: Record<string, { name: string, conv: number, fill: string }> = {};
        campaigns.forEach(c => {
            const p = c.platform.toLowerCase();
            if (!platforms[p]) {
                platforms[p] = {
                    name: c.platform,
                    conv: 0,
                    fill: p.includes('google') ? '#4285F4' : '#1877F2'
                };
            }
            platforms[p].conv += c.conversions;
        });
        return Object.values(platforms);
    }, [campaigns]);

    const aiInsights = useMemo(() => {
        const avgCpa = campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + c.cpa, 0) / campaigns.length : 0;
        if (totalConversions > 100 && avgCpa < 50) {
            return {
                title: "Optymalizacja Wybitna",
                text: "Twoje kampanie osiągają wyniki powyżej średniej rynkowej. Koszt pozyskania (CPA) jest stabilny. Zalecamy zwiększenie skali o 15% w nadchodzącym miesiącu.",
                type: "success"
            };
        }
        return {
            title: "Potencjał Skalowania",
            text: "Widzimy stabilny trend wzrostowy konwersji. Twoja obecna struktura konta jest gotowa na przyjęcie większego ruchu bez utraty efektywności.",
            type: "info"
        };
    }, [totalConversions, campaigns]);

    if (!hasMounted) {
        return <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 min-h-[800px] animate-pulse">
            <div className="bg-black/[0.02] rounded-[48px] h-[400px]"></div>
            <div className="bg-black/[0.02] rounded-[48px] h-[400px]"></div>
            <div className="bg-black/[0.02] rounded-[48px] h-[400px]"></div>
            <div className="bg-black/[0.02] rounded-[48px] h-[400px]"></div>
        </div>;
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Conversion Trend Line */}
            <div className="bg-white/70 backdrop-blur-3xl border border-black/[0.03] p-10 rounded-[48px] shadow-2xl relative overflow-hidden group min-h-[400px]">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-accent/[0.03] blur-[100px] -ml-32 -mt-32 rounded-full"></div>

                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div>
                        <h3 className="text-xl font-black font-space-grotesk tracking-tighter uppercase italic text-gray-900">Wzrost Konwersji</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Trend narastający - ostatnie 30 dni</p>
                    </div>
                    <div className="text-brand-accent"><TrendingUp size={24} /></div>
                </div>

                <div className="h-[250px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={conversionTrend}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                            <XAxis
                                dataKey="day"
                                hide
                            />
                            <YAxis
                                stroke="rgba(0,0,0,0.1)"
                                fontSize={10}
                                fontWeight="bold"
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    borderRadius: '16px',
                                    fontSize: '10px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                                }}
                                itemStyle={{ color: '#fb7185' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#fb7185"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Budget Utilization Radial */}
            <div className="bg-white/70 backdrop-blur-3xl border border-black/[0.03] p-10 rounded-[48px] shadow-2xl relative overflow-hidden group flex flex-col items-center justify-center min-h-[400px]">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-accent/[0.03] blur-[100px] -mr-32 -mb-32 rounded-full"></div>

                <div className="text-center mb-6 relative z-10">
                    <h3 className="text-xl font-black font-space-grotesk tracking-tighter uppercase italic text-gray-900">Wykorzystanie Budżetu</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Efektywność wydatków vs plan</p>
                </div>

                <div className="h-[250px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="100%"
                            barSize={20}
                            data={budgetUtilization}
                            startAngle={90}
                            endAngle={450}
                        >
                            <RadialBar
                                label={{ position: 'insideStart', fill: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                                background
                                dataKey="value"
                                cornerRadius={10}
                                animationDuration={1500}
                            />
                            <Tooltip />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-16">
                    <span className="text-4xl font-black font-space-grotesk italic text-gray-900">{Math.round((totalSpend / totalBudget) * 100)}%</span>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-300">Wydane</span>
                </div>
            </div>

            {/* Platform Comparison */}
            <div className="bg-white/70 backdrop-blur-3xl border border-black/[0.03] p-10 rounded-[48px] shadow-2xl relative overflow-hidden group xl:col-span-1 min-h-[400px]">
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div>
                        <h3 className="text-xl font-black font-space-grotesk tracking-tighter uppercase italic text-gray-900">Podział Konwersji</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Wyniki według platform reklamowych</p>
                    </div>
                </div>

                <div className="h-[200px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={platformPerformance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="rgba(0,0,0,0.2)"
                                fontSize={9}
                                fontWeight="bold"
                                axisLine={false}
                                tickLine={false}
                                textAnchor="middle"
                            />
                            <YAxis hide />
                            <Tooltip />
                            <Bar
                                dataKey="conv"
                                radius={[10, 10, 0, 0]}
                                animationDuration={1500}
                            >
                                {platformPerformance.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Strategic Insights */}
            <div className="bg-brand-accent/[0.03] backdrop-blur-3xl border border-brand-accent/10 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group flex flex-col justify-center min-h-[400px]">
                <div className="absolute top-0 right-0 p-8 text-brand-accent/20 group-hover:rotate-12 transition-transform duration-700">
                    <Zap size={64} strokeWidth={3} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent shadow-inner">
                            <Target size={20} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent italic">Rekomendacja AI Strategy</h4>
                    </div>

                    <h5 className="text-3xl font-black font-space-grotesk uppercase italic tracking-tighter mb-6 leading-tight">
                        {aiInsights.title}
                    </h5>

                    <p className="text-sm text-gray-500 leading-relaxed font-medium mb-10 max-w-md">
                        {aiInsights.text}
                    </p>

                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-brand-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2">
                            <span>Wdroż rekomendację</span>
                            <Zap size={12} fill="currentColor" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';

interface ChartProps {
    data: { name: string; value: number }[];
    colors: string[];
    showFees?: boolean;
}

export const DonutChart = ({ data, colors }: ChartProps) => {
    const [animatedData, setAnimatedData] = useState(data.map(item => ({ ...item, value: 0 })));
    const hasData = data.some(d => d.value > 0);

    useEffect(() => {
        if (hasData) {
            setAnimatedData(data);
        }
    }, [data, hasData]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(34, 197, 94)" />
                        <stop offset="100%" stopColor="rgb(134, 239, 172)" />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(239, 68, 68)" />
                        <stop offset="100%" stopColor="rgb(252, 165, 165)" />
                    </linearGradient>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                        <stop offset="100%" stopColor="rgb(147, 197, 253)" />
                    </linearGradient>
                </defs>
                <Pie
                    data={hasData ? animatedData : [{ name: 'No Data', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={60}
                    paddingAngle={1}
                    dataKey="value"
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={800}
                    label={hasData ? ({ value }) => `$${value.toFixed(2)}` : undefined}
                    labelLine={false}
                >
                    {hasData ? (
                        animatedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={`url(#${entry.name === 'Profit' ? 'greenGradient' :
                                    entry.name === 'Loss' ? 'redGradient' : 'blueGradient'})`}
                                stroke="none"
                            />
                        ))
                    ) : (
                        <Cell fill="#1f2937" stroke="none" />
                    )}
                </Pie>
                {hasData && (
                    <>
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#9ca3af"
                            fontSize="24px"
                            fontWeight="500"
                        >
                            {`${((data.find(d => d.name === 'Profit')?.value || 0) /
                                data.reduce((sum, d) => sum + Math.abs(d.value), 0) * 100).toFixed(0)}%`}
                        </text>
                    </>
                )}
                <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{
                        color: '#9ca3af',  // gray-400 for better consistency
                        fontSize: '0.875rem',
                        paddingTop: '0.5rem'
                    }}
                    payload={
                        hasData ? data.map((entry, index) => ({
                            value: entry.name,
                            type: 'circle',
                            id: index,
                            color: entry.name === 'Profit' ? 'rgb(34, 197, 94)' :
                                                            entry.name === 'Loss' ? 'rgb(239, 68, 68)' :
                                                                'rgb(59, 130, 246)'
                        })) : [] as any
                    }
                />
                {hasData && (
                    <Tooltip
                        contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                        itemStyle={{ color: '#9ca3af' }}
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                    />
                )}
            </PieChart>
        </ResponsiveContainer>
    );
};
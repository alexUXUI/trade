import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartProps {
    data: { name: string; value: number }[];
    colors: string[];
    showFees?: boolean;
}

export const DonutChart = ({ data, colors, showFees }: ChartProps) => {
    const hasData = data.some(d => d.value > 0);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={hasData ? data : [{ name: 'No Data', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {hasData ? (
                        data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))
                    ) : (
                        <Cell fill="#374151" />
                    )}
                </Pie>
                <Tooltip
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#e5e7eb' }}
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};
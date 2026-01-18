import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const FilingStatusChart = ({ data }) => {
    // Center label component
    const CustomLabel = ({ viewBox }) => {
        const { cx, cy } = viewBox;
        return (
            <text x={cx} y={cy} fill="white" textAnchor="middle" dominantBaseline="central">
                <tspan x={cx} y={cy - 5} fontSize="24" fontWeight="bold">850</tspan>
                <tspan x={cx} y={cy + 20} fontSize="12" fill="#9ca3af">Total</tspan>
            </text>
        );
    };

    return (
        <div className="h-full w-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Filing Status</h3>
            </div>

            <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {/* Label in middle */}
                            {/* Note: In Recharts, custom label inside donut is tricky, often easier to overlay div */}
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#fff' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', marginTop: '20px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Absolute positioned center text for donut chart */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                    <p className="text-2xl font-bold text-white">850</p>
                    <p className="text-xs text-gray-400">Total</p>
                </div>
            </div>
        </div>
    );
};

export default FilingStatusChart;

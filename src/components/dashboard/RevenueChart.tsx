import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Proposal } from '../../types';

interface RevenueChartProps {
  proposals: Proposal[];
  currencySymbol: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ proposals, currencySymbol }) => {
  // Aggregate recent months
  const monthlyData = [
    { month: 'Jun', quoted: 12000, won: 8500 },
    { month: 'Jul', quoted: 24000, won: 18000 },
    { month: 'Aug', quoted: 31000, won: 22500 },
    { month: 'Sep', quoted: 45000, won: 32700 },
    { month: 'Oct', quoted: 0, won: 0 },
  ];

  // Calculate current values from active proposals
  const currentQuoted = proposals.reduce((acc, p) => acc + (p.totalBudget || 0), 0);
  const currentWon = proposals
    .filter((p) => p.status === 'accepted')
    .reduce((acc, p) => acc + (p.totalBudget || 0), 0);

  monthlyData[4].quoted = currentQuoted || 28000;
  monthlyData[4].won = currentWon || 19500;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="month"
            stroke="#D4D8DF"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'rgba(212, 216, 223, 0.15)' }}
          />
          <YAxis
            stroke="#D4D8DF"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'rgba(212, 216, 223, 0.15)' }}
            tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#15171B',
              borderRadius: '16px',
              border: '1px solid rgba(212, 216, 223, 0.2)',
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              boxShadow: '0 15px 35px -5px rgba(0,0,0,0.8)',
            }}
            formatter={(value: any) => [`${currencySymbol}${Number(value).toLocaleString()}`, '']}
          />
          <Legend
            wrapperStyle={{ paddingTop: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}
            formatter={(val) => <span className="text-[#D4D8DF]/80 uppercase">{val}</span>}
          />
          <Bar dataKey="quoted" name="Pipeline Quoted" fill="#343941" radius={[6, 6, 0, 0]} />
          <Bar dataKey="won" name="Won Contracts" fill="#FF5A00" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

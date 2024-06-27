import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CustomBarChartProps {
  data: any[];
  xDataKey: string;
}

const BARChart: React.FC<CustomBarChartProps> = ({ data, xDataKey }) => {
  const barKeys = Object.keys(data[0]).filter(key => key !== xDataKey);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {barKeys.map((barKey, index) => (
          <Bar
            key={index}
            dataKey={barKey}
            fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
            barSize={25}
            name={barKey}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BARChart;

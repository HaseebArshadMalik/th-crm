import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CustomAreaChartProps {
  data: any[];
  xDataKey: string;
}

const colors = ['#242b60', '#dde22f', '#2096d3', '#b48e32'];
let currentColorIndex = 0;
function getNextColor() {
  const color = colors[currentColorIndex];
  currentColorIndex = (currentColorIndex + 1) % colors.length;
  return color;
}
const AREAChart: React.FC<CustomAreaChartProps> = ({ data, xDataKey }) => {
  const chartLineKeys = Object.keys(data[0]).filter(key => key !== xDataKey);


  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {chartLineKeys.map((lineKey, index) => (
          <Area
            key={index}
            type="monotone"
            dataKey={lineKey}
            stroke={getNextColor()}
            strokeWidth={2}
            fill="none"
            dot={{ r: 3 }}
            name={lineKey}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AREAChart;


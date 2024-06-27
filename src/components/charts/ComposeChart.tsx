import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CustomComposeChartProps {
  data: any[];
  xDataKey: string;
  barDataKey: string;
  lineDataKey: string;
}

const ComPosedChart: React.FC<CustomComposeChartProps> = ({
  data,
  xDataKey,
  barDataKey,
  lineDataKey,
}) => {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <ComposedChart data={data}>
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
        <Legend
          wrapperStyle={{
            backgroundColor: '#f5f5f5',
            border: '1px solid #d5d5d5',
            borderRadius: 3,
            position: 'relative',
            padding: '10px 0px',
          }}
        />
        <Bar dataKey={barDataKey} barSize={20} fill="#064F92" />
        <Line type="monotone" dataKey={lineDataKey} strokeWidth={2} stroke="#82ca9d" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ComPosedChart;

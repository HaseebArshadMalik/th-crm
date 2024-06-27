import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const colors = ['#242b60', '#dde22f', '#2096d3', '#fca130', '#49cc90', '#2db7f5', '#eb2f96', '#bfbfbf', '#f5222d', '#52c41a'];
interface CustomMultiLineChartProps {
  data: any[];

}
const MultiLineChart: React.FC<CustomMultiLineChartProps> = ({ data }) => {
  return (

    <ResponsiveContainer width="98%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        {data &&
          Object.keys(data.reduce((maxEntry, entry) => (Object.keys(entry).length > Object.keys(maxEntry).length ? entry : maxEntry), {}))
            .filter((key) => key !== 'name')
            .map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}

              />

            ))}
      </LineChart>
    </ResponsiveContainer>

  );
};

export default MultiLineChart;

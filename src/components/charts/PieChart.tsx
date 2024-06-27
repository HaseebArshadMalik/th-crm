import React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
  

interface PIEChartProps {
  data: any; 
}

const COLORS = ['#242b60', '#dde22f', '#2096d3', '#b48e32'];

const PIEChart: React.FC<PIEChartProps> = ({ data }) => {

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          {data ? (
            <Pie
              data={data}
              dataKey="Total"
              nameKey="Name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={70}
              startAngle={90}
              endAngle={-270}
              fill="#8884d8"
              strokeWidth={1}
            >
              {data.map((item: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          ) : null}
          <Tooltip />
          <Legend
            wrapperStyle={{
              borderRadius: 3,
              bottom: "-10px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
  
};

export default PIEChart;

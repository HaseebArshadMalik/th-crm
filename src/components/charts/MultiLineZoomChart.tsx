import React from 'react';
import ReactApexChart from 'react-apexcharts';


interface ApexChartProps {
  chartData: any[];
}

const MultiLineZoomChart: React.FC<ApexChartProps> = ({ chartData }) => {
  const options = {
    chart: {
      height: 350,
      id: 'line',
    },
    stroke: {
      width: 1.5,
      curve: "smooth" as "smooth",
    },
    
    xaxis: {
      categories: chartData.map(data => data.Date).reverse()
    },

  };



  const series = Object.keys(chartData[0])
    .filter(key => key !== 'Date')
    .map((key) => ({
      name: key,
      data: chartData.map(data => data[key]).reverse()
    }));

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="line" width="98%" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default MultiLineZoomChart;

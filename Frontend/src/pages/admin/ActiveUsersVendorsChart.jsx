import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react'; 
import axiosInstanceUser from '../../services/axiosInstanceUser'; 

const ActiveUsersVendorsChart = () => {
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstanceUser.get('/allbookings'); 
        const bookings = response.data;

        const activeUsers = new Set();
        const activeVendors = new Set();


        bookings.forEach(booking => {
          if (booking.user) {
            activeUsers.add(booking.user); 
          }
          if (booking.vendor) {
            activeVendors.add(booking.vendor);
          }
        });

        // Debugging outputs
        console.log("Active Users Set:", [...activeUsers]); 
        console.log("Active Vendors Set:", [...activeVendors]);

        // Prepare chart data
        const chartData = [
          { name: 'Active Users', value: activeUsers.size },
          { name: 'Active Vendors', value: activeVendors.size },
        ];

        // Configure the chart options
        const options = {
          title: {
            text: 'Active Users and Vendors',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
          },
          xAxis: {
            type: 'category',
            data: chartData.map(item => item.name),
          },
          yAxis: {
            type: 'value',
            name: 'Count',
          },
          series: [
            {
              name: 'Active Users and Vendors',
              type: 'bar',
              data: chartData.map(item => item.value),
              itemStyle: {
                color: (params) => {
                  return params.dataIndex === 0 ? '#a39f74' : '#7485a3';
                },
              },
              emphasis: {
                focus: 'series',
                itemStyle: {
                  color: '#e6e9f1',
                },
              },
            },
          ],
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            containLabel: true,
          },
        };


        setChartOptions(options);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking data:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <p>Loading chart...</p>;
  }

  if (!chartOptions) {
    return <p>No data available to display the chart.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <ReactECharts
        option={chartOptions}
        style={{ height: '400px', width: '100%' }}
        className="react_for_echarts"
      />
    </div>
  );
};

export default ActiveUsersVendorsChart;

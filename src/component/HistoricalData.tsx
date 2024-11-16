import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { useState } from 'react';
import { fetchHistoricalData } from '../services/apiCalls';
import { toast, Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

import { HistoricalChartProps } from '../Interfaces/allInterface';
import { HistoricalDataItem } from '../Interfaces/allInterface';

const HistoricalChart = ({ data }: HistoricalChartProps) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date("2024-01-03"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("2024-02-03"));
  const [historicalData, setHistoricalData] = useState<HistoricalDataItem[]>(data);

  const chartData = {
    labels: historicalData.map(item => item.date),
    datasets: [
      {
        label: 'Air Quality Index',
        data: historicalData.map(item => item.air_quality_index),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Water Quality Index',
        data: historicalData.map(item => item.water_quality_index),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Temperature',
        data: historicalData.map(item => item.temperature),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'pH Level',
        data: historicalData.map(item => item.ph_level),
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          },
          boxWidth: window.innerWidth < 768 ? 30 : 40
        }
      },
      title: {
        display: true,
        text: 'Historical Data Trends',
        font: {
          size: window.innerWidth < 768 ? 14 : 16
        }
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 8 : 12
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 8 : 12
          }
        }
      }
    }
  };

  const fetchData = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    const timeDiff = endDate!.getTime() - startDate!.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff < 0) {
      toast.error("End date must be after start date.");
      return;
    }

    if (dayDiff > 30) {
      toast.error("The date range must be less than a month.");
      return;
    }

    try {
      const result = await fetchHistoricalData(startDate!.toISOString().split('T')[0], endDate!.toISOString().split('T')[0]);
      if (result.length === 0) {
        toast.error("No data is recorded for that period. Please try dates from 2023-01-01 to 2024-11-30.");
      }
      setHistoricalData(result);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      toast.error("Error fetching historical data.");
    }
  };

  const downloadCSV = () => {
    const csvData = [
      ['Date', 'Air Quality Index', 'Water Quality Index', 'Temperature', 'pH Level'],
      ...historicalData.map(item => [
        item.date,
        item.air_quality_index,
        item.water_quality_index,
        item.temperature,
        item.ph_level
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'historical_data.csv');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-lg mt-4 sm:mt-6"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-4 mt-4 sm:mt-8">
        Historical Data Trends
      </h2>

      <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-4 sm:space-y-0 mb-4 mt-4 sm:mt-12">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0">
          <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0'>
            <p className='text-base sm:text-lg lg:text-xl'>From: </p>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full sm:w-auto border rounded-lg p-2 sm:ml-2 text-sm sm:text-base"
              dateFormat="yyyy-MM-dd"
              placeholderText="Start Date"
            />
          </div>

          <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 ml-2 lg:ml-4'>
            <p className='text-base sm:text-lg lg:text-xl'>To: </p>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full sm:w-auto border rounded-lg p-2 sm:ml-2 text-sm sm:text-base"
              dateFormat="yyyy-MM-dd"
              placeholderText="End Date"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:ml-4">
          <button
            onClick={fetchData}
            className="w-full sm:w-auto bg-blue-800 text-white rounded-lg p-2 text-sm sm:text-base hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            onClick={downloadCSV}
            className="w-full sm:w-auto bg-green-800 text-white rounded-lg p-2 sm:ml-2 text-sm sm:text-base hover:bg-green-700 transition-colors"
          >
            Download CSV
          </button>
        </div>
      </div>

      <h3 className='text-xs sm:text-sm text-right mb-4 sm:mb-6'>
        (<span className='text-[#f92828]'>**</span> Note that you can only choose dates within a duration of one month.)
      </h3>

      {/* Chart  */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
        <Line data={chartData} options={options} />
      </div>
      <Toaster />
    </motion.div>
  );
};

export default HistoricalChart;
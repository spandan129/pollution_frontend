import { useEffect, useState } from 'react';
import { getPollutionData } from '../services/apiCalls';
import SensorData from '../component/SensorData';
import { motion } from 'framer-motion';
import HistoricalChart from '../component/HistoricalData';
import WeatherPannel from '../component/WeatherPannel';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPollutionData();
        setData(response);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-full mx-auto ">
        <WeatherPannel data={data.weather_data} />
        <SensorData initialData={data.live_sensor_data} />
        <HistoricalChart data={data.historical_data.items} />
      </div>
    </motion.div>
  );
};

export default Dashboard;
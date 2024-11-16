import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

import { SensorDatas } from '../Interfaces/allInterface';
import { SensorDataProps } from '../Interfaces/allInterface';
import toast, { Toaster } from 'react-hot-toast';
import CustomToast from './customToast';

const SensorData = ({ initialData }: SensorDataProps) => {
  const [data, setData] = useState<SensorDatas>(initialData);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    ws.current = new WebSocket('ws://localhost:8000/api/ws/sensordata');

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        if (newData.water_quality_index < 40) {
          toast.custom((t) => (
            <CustomToast message="Warning! The fish in Phewa Lake are starting to complain 🐟." />
          ));
        }
        setData(newData);
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full p-4 md:p-6 lg:p-8 mt-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center w-full">Sensor Data of Phewa Lake</h2>
        <div className={`h-4 w-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className=" p-6 flex flex-col items-center"
        >

          <div>
            <p className="text-9xl font-bold text-black">{data?.air_quality_index}</p>
          </div>
          <div><p className="text-gray-500 text-xl">Air Quality Index</p></div>

        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className=" p-6 flex flex-col items-center"
        >

          <p className="text-9xl font-bold text-black">{data?.water_quality_index}</p>
          <p className="text-gray-500 text-xl">Water Quality Index</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className=" p-6 flex flex-col items-center"
        >
          <p className="text-9xl font-bold text-black">{data?.ph_level}</p>
          <p className="text-gray-500 text-xl">pH Level</p>
        </motion.div>
      </div>

      {data?.timestamp && (
        <p className="text-lg text-gray-500 mt-4 text-right">
          Last updated: {new Date(data.timestamp).toLocaleString()}
        </p>
      )}
      <Toaster />
    </motion.div>
  );
};

export default SensorData;

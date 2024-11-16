import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getPollutionData = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/get_all_data_of_pollution?start_date=${"2024-01-03"}&end_date=${"2024-02-03"}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching pollution data:', error);
    throw error;
  }
};

export const fetchHistoricalData = async (startDate: string, endDate: string) => {
  const response = await fetch(`${API_BASE_URL}/history-data?start_date=${startDate}&end_date=${endDate}`);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const result = await response.json();
  return result.items;
};
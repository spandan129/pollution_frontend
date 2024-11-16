export interface SensorDatas {
    air_quality_index: number;
    water_quality_index: number;
    ph_level: number;
    timestamp: string;
}
  
export interface SensorDataProps {
    initialData: SensorDatas;
}

export interface HistoricalDataItem {
    date: string;
    air_quality_index: number;
    water_quality_index: number;
    ph_level: number;
    temperature: number;
  }
  
export  interface HistoricalChartProps {
    data: HistoricalDataItem[];
  }

export  interface WeatherData {
    coord: { lon: number; lat: number };
    weather: Array<{ id: number; main: string; description: string; icon: string }>;
    base: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
      sea_level: number;
      grnd_level: number;
    };
    visibility: number;
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    clouds: { all: number };
    dt: number;
    sys: {
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
  }
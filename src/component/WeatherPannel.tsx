import { motion } from 'framer-motion';
import { CloudRain, Droplets, Wind, Thermometer, Sun, Sunset } from 'lucide-react';
import CloudImg from '../assets/images/cloud.jpg';
import toast, { Toaster } from 'react-hot-toast';

import { WeatherData } from '../Interfaces/allInterface';

const WeatherPannel = ({ data }: { data: WeatherData }) => {
  const celsiusTemp = (data.main.temp - 273.15).toFixed(1);
  const feelsLikeTemp = (data.main.feels_like - 273.15).toFixed(1);
  const minTemp = (data.main.temp_min - 273.15).toFixed(1);
  const maxTemp = (data.main.temp_max - 273.15).toFixed(1);
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  const windDirection = `${data.wind.deg}°`;
  const windGust = `${data.wind.gust} m/s`;
  const capturedAt = new Date(data.dt * 1000).toLocaleString();

  let clickCount = 0;
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const handlePanelClick = () => {
    toast.success("We recommend boating with an umbrella today ☂️.");
  };

  const handleClick = () => {
    clickCount++;

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      if (clickCount === 3) {
        handlePanelClick();
      }
      clickCount = 0;
    }, 500);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      id="myElement"
      className="relative w-full bg-cover  flex flex-col"
      style={{ backgroundImage: `url(${CloudImg})` }}
      onClick={handleClick}>
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col w-full p-3 sm:p-4 md:p-6 lg:p-8 space-y-4">
        {/* Weather Information */}
        <div className="p-3 sm:p-4 md:p-6 w-full text-white">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold break-words">
              Current Weather Condition of {data.name}, {data.sys.country}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-8">
            {/* Weather Status */}
            <div className="p-4">
              <p className="text-5xl md:text-6xl lg:text-8xl uppercase break-words">
                {data.weather[0].main}
              </p>
              <p className="text-2xl md:text-3xl lg:text-4xl mt-2 break-words">
                ({data.weather[0].description})
              </p>
              <p className="text-right mt-4 md:mt-6 text-sm sm:text-base">
                <span className="bg-white/10 px-2 py-1 sm:px-4 sm:py-1 rounded-2xl">
                  Captured at: {capturedAt}
                </span>
              </p>
            </div>

            {/* Temperature */}
            <div className="p-4">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2">Temperature</h3>
              <div className="flex items-center space-x-2">
                <Thermometer className="text-blue-200 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                <span className="text-6xl lg:text-8xl">{celsiusTemp}°C</span>
              </div>
              <div className="space-y-1 mt-4">
                <p className="text-xl">Feels Like: {feelsLikeTemp}°C</p>
                <p className="text-xl">Min Temp: {minTemp}°C</p>
                <p className="text-xl">Max Temp: {maxTemp}°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Humidity, Visibility, Sunrise, and Sunset */}
        <div className="p-3 sm:p-4 md:p-6 w-full text-white">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Sunrise */}
            <div className="p-3 sm:p-4 bg-white/10 rounded-lg shadow-lg">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold tracking-[0.055em] mb-2">
                Sunrise
              </h3>
              <div className="flex items-center space-x-2">
                <Sun className="text-yellow-200 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{sunrise}</span>
              </div>
            </div>

            {/* Sunset */}
            <div className="p-3 sm:p-4 bg-white/10 rounded-lg shadow-lg">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold tracking-[0.055em] mb-2">
                Sunset
              </h3>
              <div className="flex items-center space-x-2">
                <Sunset className="text-red-300 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{sunset}</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="p-3 sm:p-4 bg-white/10 rounded-lg shadow-lg">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold tracking-[0.055em] mb-2">
                Humidity
              </h3>
              <div className="flex items-center space-x-2">
                <Droplets className="text-cyan-200 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{data.main.humidity}%</span>
              </div>
            </div>

            {/* Visibility */}
            <div className="p-3 sm:p-4 bg-white/10 rounded-lg shadow-lg">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold tracking-[0.055em] mb-2">
                Visibility
              </h3>
              <div className="flex items-center space-x-2">
                <CloudRain className="text-gray-200 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{(data.visibility / 1000).toFixed(1)} km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wind and Pressure */}
        <div className="p-3 sm:p-4 md:p-6 w-full text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wind */}
            <div className="p-4">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2">Wind</h3>
              <div className="flex items-center space-x-2">
                <Wind className="text-blue-400 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                <span className="text-5xl md:text-5xl lg:text-6xl">
                  {data.wind.speed} m/s
                </span>
              </div>
              <div className="space-y-1 mt-4">
                <p className="text-xl sm:text-xl">Direction: {windDirection}</p>
                <p className="text-xl sm:text-xl">Gust: {windGust}</p>
              </div>
            </div>

            {/* Pressure */}
            <div className="p-4">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2">Pressure</h3>
              <div className="flex items-center space-x-2">
                <Droplets className="text-cyan-200 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
                <span className="text-5xl lg:text-6xl">
                  {data.main.pressure} hPa
                </span>
              </div>
              <div className="space-y-1 mt-4">
                <p className="text-xl sm:text-xl">Sea Level: {data.main.sea_level} hPa</p>
                <p className="text-xl sm:text-xl">Ground Level: {data.main.grnd_level} hPa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </motion.div>
  );
};

export default WeatherPannel;
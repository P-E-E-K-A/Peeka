import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

const WeatherSection = () => {

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-full max-w-2xl h-96 overflow-hidden shadow-2xl">
        {/* Cloudy Sky Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600">
          {/* Animated clouds */}
          <div className="absolute top-8 left-16 w-24 h-16 bg-white/20 rounded-full"></div>
          <div className="absolute top-12 left-20 w-32 h-20 bg-white/15 rounded-full"></div>
          <div className="absolute top-6 right-20 w-28 h-18 bg-white/25 rounded-full"></div>
          <div className="absolute top-16 right-32 w-20 h-12 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-20 left-8 w-36 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-16 right-16 w-32 h-20 bg-white/15 rounded-full"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-6 text-white">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4">
              <Cloud className="w-8 h-8 mb-2 text-gray-200" />
              <p className="text-4xl font-light mb-1">25°</p>
              <p className="text-sm opacity-80">Cloudy</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="w-full max-w-2xl bg-neutral-800/30 backdrop-blur-sm p-6 text-white">
        {/* Weather Details */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 text-center">
            <Sun className="w-5 h-5 mx-auto mb-1 text-yellow-300" />
            <p className="text-xs opacity-80">Mon</p>
            <p className="text-sm font-semibold">28°</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 text-center">
            <Cloud className="w-5 h-5 mx-auto mb-1 text-gray-300" />
            <p className="text-xs opacity-80">Tue</p>
            <p className="text-sm font-semibold">23°</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 text-center">
            <CloudRain className="w-5 h-5 mx-auto mb-1 text-blue-300" />
            <p className="text-xs opacity-80">Wed</p>
            <p className="text-sm font-semibold">19°</p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 text-center">
            <Wind className="w-5 h-5 mx-auto mb-1 text-gray-400" />
            <p className="text-xs opacity-80">Thu</p>
            <p className="text-sm font-semibold">22°</p>
          </div>
        </div>
        
        {/* Weather Info */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 flex justify-between text-sm">
          <div>
            <p className="opacity-80">Humidity</p>
            <p className="font-semibold">65%</p>
          </div>
          <div>
            <p className="opacity-80">Wind Speed</p>
            <p className="font-semibold">12 km/h</p>
          </div>
          <div>
            <p className="opacity-80">Visibility</p>
            <p className="font-semibold">8 km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSection;
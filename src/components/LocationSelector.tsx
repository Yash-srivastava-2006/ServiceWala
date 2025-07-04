import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { indianStates } from '../data/mockData';

interface LocationSelectorProps {
  selectedState: string;
  selectedCity: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  className = ''
}) => {
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleStateSelect = (state: string) => {
    onStateChange(state);
    onCityChange(''); // Reset city when state changes
    setShowStateDropdown(false);
  };

  const handleCitySelect = (city: string) => {
    onCityChange(city);
    setShowCityDropdown(false);
  };

  const selectedStateData = indianStates.find(state => state.name === selectedState);
  const cities = selectedStateData?.cities || [];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <MapPin className="h-5 w-5 text-gray-400" />
      
      {/* State Selector */}
      <div className="relative">
        <button
          onClick={() => setShowStateDropdown(!showStateDropdown)}
          className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <span className="text-sm font-medium text-gray-700">
            {selectedState || 'Select State'}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {showStateDropdown && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="py-1">
              <button
                onClick={() => handleStateSelect('')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                All States
              </button>
              {indianStates.map((state) => (
                <button
                  key={state.name}
                  onClick={() => handleStateSelect(state.name)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {state.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* City Selector */}
      {selectedState && (
        <div className="relative">
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <span className="text-sm font-medium text-gray-700">
              {selectedCity || 'Select City'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {showCityDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <div className="py-1">
                <button
                  onClick={() => handleCitySelect('')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  All Cities
                </button>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
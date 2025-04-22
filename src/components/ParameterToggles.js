// src/components/ParameterToggles.js
'use client';

import { formatApiParameterName } from '../lib/utils';

const SELECT_OPTIONS = {
  garment_photo_type: ['auto', 'flat-lay', 'model'],
  category: ['auto', 'tops', 'bottoms', 'one-pieces']
};

export default function ParameterToggles({ parameters, onChange }) {
  const handleToggleChange = (key) => {
    onChange({
      ...parameters,
      [key]: !parameters[key]
    });
  };

  const handleSelectChange = (key, value) => {
    onChange({
      ...parameters,
      [key]: value
    });
  };

  const renderParameter = (key) => {
    // If the parameter has predefined options, render a select
    if (SELECT_OPTIONS[key]) {
      return (
        <div key={key} className="parameter-container flex items-center justify-between p-2">
          <span>{formatApiParameterName(key)}</span>
          <select
            value={parameters[key]}
            onChange={(e) => handleSelectChange(key, e.target.value)}
            className="p-2 border rounded"
          >
            {SELECT_OPTIONS[key].map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // Otherwise render a toggle switch for boolean values
    return (
      <div key={key} className="toggle-container">
        <label className="toggle">
          <input
            type="checkbox"
            checked={parameters[key]}
            onChange={() => handleToggleChange(key)}
          />
          <span className="slider"></span>
        </label>
        <span>{formatApiParameterName(key)}</span>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col space-y-2 w-full max-w-md mx-auto">
      {Object.keys(parameters).map(key => renderParameter(key))}
    </div>
  );
}
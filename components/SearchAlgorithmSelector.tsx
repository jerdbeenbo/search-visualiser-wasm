// SearchAlgorithmSelector.tsx
import React from 'react';

type SearchAlgorithmSelectorProps = {
  selectedAlgorithm: string;
  setSelectedAlgorithm: (algorithm: string) => void;
};

const SearchAlgorithmSelector: React.FC<SearchAlgorithmSelectorProps> = ({
  selectedAlgorithm,
  setSelectedAlgorithm,
}) => {
  return (
    <div className="flex justify-center mb-2 mt-6">
      <div className="bg-slate-800 p-3 rounded-lg shadow-lg">
        <h3 className="text-white font-semibold mb-2 text-center">Select Search Algorithm</h3>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-green-500 h-5 w-5"
              value="linear"
              checked={selectedAlgorithm === 'linear'}
              onChange={() => setSelectedAlgorithm('linear')}
            />
            <span className="ml-2 text-white">Linear Search</span>
          </label>
          
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-green-500 h-5 w-5"
              value="binary"
              checked={selectedAlgorithm === 'binary'}
              onChange={() => setSelectedAlgorithm('binary')}
            />
            <span className="ml-2 text-white">Binary Search</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchAlgorithmSelector;
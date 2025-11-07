import { useState } from 'react';

interface NameInputProps {
  names: string[];
  onNamesChange: (names: string[]) => void;
  maxNames: number;
}

export function NameInput({ names, onNamesChange, maxNames }: NameInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [bulkInput, setBulkInput] = useState('');

  const addName = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (names.length >= maxNames) {
      alert(`Maximum ${maxNames} players allowed!`);
      return;
    }
    if (names.includes(trimmed)) {
      alert('This name already exists!');
      return;
    }
    onNamesChange([...names, trimmed]);
    setInputValue('');
  };

  const handleBulkPaste = () => {
    if (!bulkInput.trim()) return;

    const newNames = bulkInput
      .split(/[,\n]/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const uniqueNames = [...new Set(newNames)];
    const filtered = uniqueNames.filter((name) => !names.includes(name));
    const remaining = maxNames - names.length;
    const toAdd = filtered.slice(0, remaining);

    if (filtered.length > remaining) {
      alert(`Only ${remaining} names added. Maximum ${maxNames} players allowed.`);
    }

    onNamesChange([...names, ...toAdd]);
    setBulkInput('');
  };

  const removeName = (index: number) => {
    onNamesChange(names.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addName();
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-white text-sm font-semibold mb-2">
          Add Names ({names.length}/{maxNames})
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter name"
            className="flex-1 px-4 py-2 rounded-lg bg-white text-charcoal-black border-2 border-electric-blue focus:outline-none focus:ring-2 focus:ring-lime-green"
            disabled={names.length >= maxNames}
          />
          <button
            onClick={addName}
            disabled={names.length >= maxNames || !inputValue.trim()}
            className="px-6 py-2 bg-electric-blue text-white rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <label className="block text-white text-sm font-semibold mb-2">
          Bulk Paste (comma or line separated)
        </label>
        <div className="flex gap-2">
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="Paste names here, separated by commas or new lines"
            rows={3}
            className="flex-1 px-4 py-2 rounded-lg bg-white text-charcoal-black border-2 border-electric-blue focus:outline-none focus:ring-2 focus:ring-lime-green resize-none"
            disabled={names.length >= maxNames}
          />
          <button
            onClick={handleBulkPaste}
            disabled={names.length >= maxNames || !bulkInput.trim()}
            className="px-6 py-2 bg-lime-green text-charcoal-black rounded-lg font-bold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            Paste
          </button>
        </div>
      </div>

      {names.length > 0 && (
        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Players List
          </label>
          <div className="bg-white rounded-lg p-4 max-h-60 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {names.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-electric-blue bg-opacity-10 px-3 py-2 rounded-lg animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lime-green font-bold">⚽</span>
                    <span className="text-charcoal-black font-medium">{name}</span>
                  </div>
                  <button
                    onClick={() => removeName(index)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg transition-all transform hover:scale-125"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


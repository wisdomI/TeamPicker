interface TeamSizeSelectorProps {
  teamSize: number;
  onTeamSizeChange: (size: number) => void;
  maxPlayers: number;
}

export function TeamSizeSelector({
  teamSize,
  onTeamSizeChange,
  maxPlayers,
}: TeamSizeSelectorProps) {
  const teamCount = maxPlayers > 0 ? Math.ceil(maxPlayers / teamSize) : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-white text-sm font-semibold mb-2">
          Players per Team: {teamSize}
        </label>
        <input
          type="range"
          min="2"
          max={Math.max(2, maxPlayers || 2)}
          value={teamSize}
          onChange={(e) => onTeamSizeChange(parseInt(e.target.value))}
          className="w-full h-3 bg-electric-blue rounded-lg appearance-none cursor-pointer accent-lime-green"
          disabled={maxPlayers < 2}
        />
        <div className="flex justify-between text-white text-xs mt-1">
          <span>2</span>
          <span>{Math.max(2, maxPlayers || 2)}</span>
        </div>
      </div>

      {maxPlayers > 0 && (
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Players:</span>
            <span className="text-lime-green font-bold text-xl">{maxPlayers}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold">Teams Created:</span>
            <span className="text-electric-blue font-bold text-xl">{teamCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}


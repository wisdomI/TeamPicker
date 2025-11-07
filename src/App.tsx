import { useState } from 'react';
import { NameInput } from './components/NameInput';
import { TeamSizeSelector } from './components/TeamSizeSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { generateTeams } from './utils/shuffle';

type View = 'input' | 'results';

function App() {
  const [view, setView] = useState<View>('input');
  const [names, setNames] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState(3);
  const [teams, setTeams] = useState<string[][]>([]);
  const [generationTime, setGenerationTime] = useState<Date>(new Date());
  const [isShuffling, setIsShuffling] = useState(false);

  const MAX_NAMES = 30;

  const handleShuffle = () => {
    if (names.length < 2) {
      alert('Please add at least 2 players!');
      return;
    }

    setIsShuffling(true);
    setGenerationTime(new Date());

    // Add shake animation delay
    setTimeout(() => {
      const generatedTeams = generateTeams(names, teamSize);
      setTeams(generatedTeams);
      setIsShuffling(false);
      setView('results');
    }, 500);
  };

  const handleReset = () => {
    setView('input');
    setTeams([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-black via-gray-900 to-charcoal-black">
      {view === 'input' ? (
        <div className="min-h-screen flex items-center justify-center py-8 px-4">
          <div className="max-w-2xl w-full space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
                <div className='flex flex-col items-center justify-center'>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-electric-blue to-lime-green bg-clip-text text-transparent animate-pulse-sport">
                TeamShuffler Pro
              </h1>
              <p className='text-white text-sm opacity-70'>
                by Wisdom(ThePrincipalCodez)
              </p>
                </div>
              <p className="text-white text-lg opacity-90 mt-8">
                Create balanced teams from your player list
              </p>
            </div>

            {/* Main Content Card */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border-2 border-electric-blue">
              <TeamSizeSelector
                teamSize={teamSize}
                onTeamSizeChange={setTeamSize}
                maxPlayers={names.length}
              />

              <div className="my-8 border-t-2 border-electric-blue border-opacity-30"></div>

              <NameInput
                names={names}
                onNamesChange={setNames}
                maxNames={MAX_NAMES}
              />

              <div className="mt-8 text-center">
                <button
                  onClick={handleShuffle}
                  disabled={names.length < 2 || isShuffling}
                  className={`px-12 py-4 rounded-xl font-bold text-xl transition-all transform ${
                    isShuffling
                      ? 'animate-shake bg-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-electric-blue to-lime-green hover:from-blue-600 hover:to-green-500 hover:scale-110 shadow-lg'
                  } text-white disabled:opacity-50`}
                >
                  {isShuffling ? 'Shuffling...' : '⚽ Shuffle Teams ⚽'}
                </button>
                {names.length < 2 && (
                  <p className="text-white text-sm mt-4 opacity-75">
                    Add at least 2 players to shuffle teams
                  </p>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center text-white text-sm opacity-70">
              <p>Maximum {MAX_NAMES} players • Fair random distribution • Mobile-friendly</p>
            </div>
          </div>
        </div>
      ) : (
        <ResultsDisplay
          teams={teams}
          dateTime={generationTime}
          teamSize={teamSize}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;

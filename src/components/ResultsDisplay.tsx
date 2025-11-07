import { useEffect, useState } from 'react';
import { exportToPDF, exportToPNG, exportToTXT, formatDateTime } from '../utils/export';

interface ResultsDisplayProps {
  teams: string[][];
  dateTime: Date;
  teamSize: number;
  onReset: () => void;
}

export function ResultsDisplay({
  teams,
  dateTime,
  teamSize,
  onReset,
}: ResultsDisplayProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const formattedDateTime = formatDateTime(dateTime);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportToPDF(teams, formattedDateTime, teamSize);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportPNG = async () => {
    setIsExportingPNG(true);
    // Ensure confetti is hidden before export
    setShowConfetti(false);
    // Small delay to ensure state update and re-render
    await new Promise(resolve => setTimeout(resolve, 100));
    try {
      await exportToPNG('results-container', `teams-${Date.now()}.png`);
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('Failed to export PNG. Please try again.');
    } finally {
      setIsExportingPNG(false);
    }
  };

  const handleExportTXT = () => {
    exportToTXT(teams, formattedDateTime, teamSize);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-black via-gray-900 to-charcoal-black py-8 px-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-lime-green animate-pulse-sport"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto" id="results-container">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-electric-blue to-lime-green bg-clip-text text-transparent">
            TeamShuffler Pro
          </h1>
          <p className="text-white text-lg mt-4">
            Generated on: <span className="text-lime-green font-bold">{formattedDateTime}</span>
          </p>
          <p className="text-white text-sm mt-2 opacity-80">
            Team Size: {teamSize} players per team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {teams.map((team, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-2xl p-6 transform transition-all hover:scale-105 animate-card-flip"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-electric-blue">Team {index + 1}</h2>
                <span className="text-lime-green text-3xl">⚽</span>
              </div>
              <div className="space-y-3">
                {team.map((name, nameIndex) => (
                  <div
                    key={nameIndex}
                    className="flex items-center gap-3 bg-electric-blue bg-opacity-10 px-4 py-2 rounded-lg animate-slide-up"
                    style={{ animationDelay: `${(index * 0.1 + nameIndex * 0.05)}s` }}
                  >
                    <span className="text-lime-green font-bold">
                      {String.fromCharCode(65 + nameIndex)}
                    </span>
                    <span className="text-charcoal-black font-semibold">{name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t-2 border-electric-blue">
                <p className="text-sm text-gray-600 text-center">
                  {team.length} {team.length === 1 ? 'player' : 'players'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExportingPDF ? '⏳ Exporting...' : '📄 Export PDF'}
          </button>
          <button
            onClick={handleExportPNG}
            disabled={isExportingPNG}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExportingPNG ? '⏳ Exporting...' : '🖼️ Export PNG'}
          </button>
          <button
            onClick={handleExportTXT}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all transform hover:scale-105 flex items-center gap-2"
          >
            📝 Export TXT
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-lime-green text-charcoal-black rounded-lg font-bold hover:bg-green-400 transition-all transform hover:scale-105"
          >
            Shuffle Again
          </button>
        </div>
      </div>
    </div>
  );
}


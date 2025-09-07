import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, X, Sparkles, Heart, Music } from 'lucide-react';

interface ColorData {
  color: string;
  name: string;
  mood: string;
}

interface OptionsSelectionProps {
  selectedDate?: Date;
  onStartDrawing: (brushSize: number) => void;
  onStartJournal: () => void;
  onStartMoodCheck: () => void;
  onCancel: () => void;
}

const colors: ColorData[] = [
  { color: '#ff6b6b', name: 'Passionate Red', mood: 'great' },
  { color: '#4ecdc4', name: 'Calm Teal', mood: 'good' },
  { color: '#45b7d1', name: 'Peaceful Blue', mood: 'good' },
  { color: '#96ceb4', name: 'Serene Green', mood: 'great' },
  { color: '#feca57', name: 'Warm Yellow', mood: 'okay' },
  { color: '#ff9ff3', name: 'Gentle Pink', mood: 'good' },
  { color: '#54a0ff', name: 'Sky Blue', mood: 'great' },
  { color: '#5f27cd', name: 'Deep Purple', mood: 'bad' }
];

const OptionsSelection: React.FC<OptionsSelectionProps> = ({ 
  selectedDate, 
  onStartDrawing, 
  onStartJournal, 
  onStartMoodCheck, 
  onCancel 
}) => {
  const [selectedBrushSize, setSelectedBrushSize] = useState<number>(5);
  const [selectedOption, setSelectedOption] = useState<'drawing' | 'journal' | 'mood' | null>(null);

  const brushSizes: number[] = [2, 5, 8, 12, 16, 20];

  const handleOptionSelect = (option: 'drawing' | 'journal' | 'mood') => {
    setSelectedOption(option);
  };

  const handleStartDrawing = () => {
    onStartDrawing(selectedBrushSize);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Express Your Emotions</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          How would you like to express your feelings for{' '}
          <span className="font-semibold text-purple-600">
            {selectedDate?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>?
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Drawing Option */}
        <div 
          className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
            selectedOption === 'drawing' 
              ? 'border-purple-400 shadow-lg scale-105' 
              : 'border-transparent hover:border-purple-200 hover:shadow-md'
          }`}
          onClick={() => handleOptionSelect('drawing')}
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-md">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Creative Drawing</h3>
            <p className="text-gray-600 text-sm">
              Use colors and shapes to express your feelings through art
            </p>
            
            {selectedOption === 'drawing' && (
              <div className="space-y-4 pt-4 border-t border-purple-200">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Choose Brush Size:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {brushSizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBrushSize(size);
                        }}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                          selectedBrushSize === size
                            ? 'border-purple-400 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <div 
                          className={`rounded-full ${
                            selectedBrushSize === size ? 'bg-purple-400' : 'bg-gray-400'
                          }`}
                          style={{ 
                            width: `${Math.max(size, 8)}px`, 
                            height: `${Math.max(size, 8)}px` 
                          }}
                        />
                        <span className="text-xs font-medium">{size}px</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Available Colors Preview:</p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {colors.map((colorData) => (
                      <div key={colorData.color} className="text-center">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-300 mx-auto shadow-sm"
                          style={{ backgroundColor: colorData.color }}
                          title={`${colorData.name} - ${colorData.mood} emotions`}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">✨ You can choose up to 2 colors</p>
                </div>
                <Button
                  onClick={handleStartDrawing}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Start Drawing
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Journal Option */}
        <div 
          className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
            selectedOption === 'journal' 
              ? 'border-blue-400 shadow-lg scale-105' 
              : 'border-transparent hover:border-blue-200 hover:shadow-md'
          }`}
          onClick={() => handleOptionSelect('journal')}
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Mood Journal</h3>
            <p className="text-gray-600 text-sm">
              Write about your feelings and thoughts in a personal journal
            </p>
            
            {selectedOption === 'journal' && (
              <div className="space-y-4 pt-4 border-t border-blue-200">
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <p>📝 Express through writing</p>
                  <p>💭 Reflect on your day</p>
                  <p>🎯 Set intentions</p>
                </div>
                <Button
                  onClick={onStartJournal}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Journal
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Mood Check */}
        <div 
          className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
            selectedOption === 'mood' 
              ? 'border-green-400 shadow-lg scale-105' 
              : 'border-transparent hover:border-green-200 hover:shadow-md'
          }`}
          onClick={() => handleOptionSelect('mood')}
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-md">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Quick Mood Check</h3>
            <p className="text-gray-600 text-sm">
              Simple and fast mood rating with emoji selection
            </p>
            
            {selectedOption === 'mood' && (
              <div className="space-y-4 pt-4 border-t border-green-200">
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <p>⚡ Quick 30-second check-in</p>
                  <p>😊 Visual emoji selection</p>
                  <p>📊 Instant mood tracking</p>
                </div>
                <Button
                  onClick={onStartMoodCheck}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
                >
                  <Music className="w-4 h-4 mr-2" />
                  Quick Check
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!selectedOption && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Choose Your Expression Method</h3>
          <p className="text-gray-600 text-sm">
            Click on any option above to see more details and get started
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {selectedOption && (
          <Button
            onClick={() => setSelectedOption(null)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back to Options
          </Button>
        )}
        
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default OptionsSelection;

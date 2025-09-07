import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarDays, BarChart3, Settings, Download, Upload } from 'lucide-react';
import MoodCalendar from './Calender';
import OptionsSelection from './OptionSelection';
import DrawingCanvas from './DrawingCanvas';
// Import all components (you would normally import these from separate files)




// Type definitions
interface MoodEntry {
  mood: 'great' | 'good' | 'okay' | 'bad' | 'horrible';
  colors?: string[];
  drawing?: string; // base64 encoded image or drawing data
  timestamp?: string;
}

interface MoodData {
  [dateKey: string]: MoodEntry;
}

type ViewType = 'calendar' | 'options' | 'canvas' | 'analytics' | 'settings';

interface NavigationProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  moodDataLength: number;
}

interface SettingsViewProps {
  moodData: MoodData;
  exportData: () => void;
  importData: (event: ChangeEvent<HTMLInputElement>) => void;
}

const MoodTrackerApp: React.FC = () => {
  // Global state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const [moodData, setMoodData] = useState<MoodData>({});
  const [showOptions, setShowOptions] = useState<boolean>(false);

  // Handle date selection from calendar
  const handleDateSelect = (date: Date): void => {
    if (date && !isDateDisabled(date)) {
      setSelectedDate(date);
      setShowOptions(true);
      setCurrentView('options');
    }
  };

  // Check if date is disabled (future dates)
  const isDateDisabled = (date: Date): boolean => {
    const checkDate = new Date(date);
    const today = new Date();
    checkDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  // Start drawing session
  const startDrawingSession = (brushSize: number = 5): void => {
    setShowOptions(false);
    setCurrentView('canvas');
  };

  // Start journal session (placeholder for future implementation)
  const startJournalSession = (): void => {
    // TODO: Implement journal functionality
    console.log('Journal session starting...');
    alert('Journal feature coming soon!');
  };

  // Start quick mood check (placeholder for future implementation)
  const startMoodCheck = (): void => {
    // TODO: Implement quick mood check
    console.log('Quick mood check starting...');
    alert('Quick mood check feature coming soon!');
  };

  // Save mood data
  const handleSaveMood = (dateKey: string, moodEntry: MoodEntry): void => {
    setMoodData(prev => ({
      ...prev,
      [dateKey]: moodEntry
    }));
    setCurrentView('calendar');
    setShowOptions(false);
  };

  // Close canvas and return to calendar
  const handleCloseCanvas = (): void => {
    setCurrentView('calendar');
    setShowOptions(false);
  };

  // Cancel options and return to calendar
  const handleCancelOptions = (): void => {
    setCurrentView('calendar');
    setShowOptions(false);
  };

  // Export mood data
  const exportData = (): void => {
    const dataStr = JSON.stringify(moodData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `mood-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import mood data
  const importData = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const importedData: MoodData = JSON.parse(result);
            setMoodData(importedData);
            alert('Data imported successfully!');
          }
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input
    event.target.value = '';
  };

  // Navigation component
  const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView, moodDataLength }) => (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        onClick={() => setCurrentView('calendar')}
        variant={currentView === 'calendar' ? 'default' : 'outline'}
        className={currentView === 'calendar' 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }
      >
        <CalendarDays className="w-4 h-4 mr-2" />
        Calendar
      </Button>
      <Button
        onClick={() => setCurrentView('analytics')}
        variant={currentView === 'analytics' ? 'default' : 'outline'}
        className={currentView === 'analytics' 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }
        disabled={moodDataLength === 0}
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        Analytics
      </Button>
      <Button
        onClick={() => setCurrentView('settings')}
        variant={currentView === 'settings' ? 'default' : 'outline'}
        className={currentView === 'settings' 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }
      >
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </Button>
    </div>
  );

  // Settings view component
  const SettingsView: React.FC<SettingsViewProps> = ({ moodData, exportData, importData }) => {
    const moodDataKeys = Object.keys(moodData);
    const hasData = moodDataKeys.length > 0;

    const getDateRange = (): string => {
      if (!hasData) return 'No data yet';
      
      const dates = moodDataKeys.map(d => new Date(d));
      const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
      
      return `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings & Data</h2>
          <p className="text-gray-600">Manage your mood tracking data and preferences</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Management */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Total entries: <span className="font-semibold">{moodDataKeys.length}</span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Date range: {getDateRange()}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={exportData}
                  disabled={!hasData}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                
                <div className="flex-1">
                  <input
                    type="file"
                    id="import-data"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                  <label htmlFor="import-data" className="w-full">
                    <Button
                     
                      className="w-full bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Data
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* App Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">App Information</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p><span className="font-medium">Version:</span> 1.0.0</p>
              <p><span className="font-medium">Last Updated:</span> {new Date().toLocaleDateString()}</p>
              <p><span className="font-medium">Data Storage:</span> Local Browser Storage</p>
              <p className="text-xs text-gray-500 mt-4">
                Your mood data is stored locally in your browser. Use the export function to backup your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  const renderCurrentView = (): JSX.Element => {
    switch (currentView) {
      case 'calendar':
        return (
          <MoodCalendar
            moodData={moodData}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            isDateDisabled={isDateDisabled}
          />
        );
      
      case 'options':
        return (
          <OptionsSelection
            selectedDate={selectedDate}
            onStartDrawing={startDrawingSession}
            onStartJournal={startJournalSession}
            onStartMoodCheck={startMoodCheck}
            onCancel={handleCancelOptions}
          />
        );
      
      case 'canvas':
        return (
          <DrawingCanvas
            selectedDate={selectedDate}
            onSave={handleSaveMood}
            onClose={handleCloseCanvas}
            existingMoodData={selectedDate ? moodData[selectedDate.toISOString().split('T')[0]] : undefined}
          />
        );
      
      case 'analytics':
        return <MoodCalendar moodData={moodData} />;
      
      case 'settings':
        return (
          <SettingsView
            moodData={moodData}
            exportData={exportData}
            importData={importData}
          />
        );
      
      default:
        return (
          <MoodCalendar
            moodData={moodData}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            isDateDisabled={isDateDisabled}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Mood Tracker
          </h1>
          <p className="text-gray-600">Track, visualize, and understand your emotional journey</p>
        </div>

        {/* Navigation */}
        <Navigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          moodDataLength={Object.keys(moodData).length}
        />

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerApp;

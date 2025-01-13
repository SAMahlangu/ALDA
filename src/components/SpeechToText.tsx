import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Mic, MicOff } from 'lucide-react';

interface Language {
  value: string;
  label: string;
}

const languages: Language[] = [
  { value: 'en-US', label: 'English' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
];

function SpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript((prev) => prev + ' ' + transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const handleStartListening = () => {
    if (recognition) {
      recognition.lang = selectedLanguage.value;
      recognition.start();
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Speech to Text</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Language
        </label>
        <Select
          options={languages}
          value={selectedLanguage}
          onChange={(lang) => setSelectedLanguage(lang as Language)}
          className="w-full"
        />
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={isListening ? handleStopListening : handleStartListening}
          className={`flex items-center px-6 py-3 rounded-lg ${
            isListening
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Listening
            </>
          )}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Transcript:</h2>
        <div className="min-h-[200px] p-4 bg-gray-50 rounded border">
          {transcript || 'Start speaking to see the transcript...'}
        </div>
      </div>
    </div>
  );
}

export default SpeechToText;
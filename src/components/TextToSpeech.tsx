import React, { useState } from 'react';
import Select from 'react-select';
import { Volume2, VolumeX } from 'lucide-react';

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

function TextToSpeech() {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage.value;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Text to Speech</h1>

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

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type something to convert to speech..."
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={speak}
          disabled={!text}
          className={`flex items-center px-6 py-3 rounded-lg ${
            isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors ${!text && 'opacity-50 cursor-not-allowed'}`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-5 h-5 mr-2" />
              Stop Speaking
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5 mr-2" />
              Speak Text
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default TextToSpeech;
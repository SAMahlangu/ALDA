import React, { useState } from 'react';
import Select from 'react-select';
import { Calculator, Volume2 } from 'lucide-react';

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

function ChangeCalculator() {
  const [amountGiven, setAmountGiven] = useState('');
  const [amountCharged, setAmountCharged] = useState('');
  const [change, setChange] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  const calculateChange = () => {
    const given = parseFloat(amountGiven);
    const charged = parseFloat(amountCharged);
    
    if (!isNaN(given) && !isNaN(charged)) {
      const changeAmount = given - charged;
      setChange(Math.round(changeAmount * 100) / 100);
      
      // Speak the change amount
      if ('speechSynthesis' in window) {
        const text = getChangeText(changeAmount);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage.value;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const getChangeText = (amount: number) => {
    if (amount < 0) {
      return `Not enough money. Customer needs to pay ${Math.abs(amount).toFixed(2)} more.`;
    } else if (amount === 0) {
      return 'Exact amount paid. No change needed.';
    } else {
      return `Change due is ${amount.toFixed(2)}`;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Change Calculator</h1>

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

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Charged ($)
          </label>
          <input
            type="number"
            value={amountCharged}
            onChange={(e) => setAmountCharged(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.01"
            min="0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Given ($)
          </label>
          <input
            type="number"
            value={amountGiven}
            onChange={(e) => setAmountGiven(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.01"
            min="0"
          />
        </div>

        <button
          onClick={calculateChange}
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Change
        </button>
      </div>

      {change !== null && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Result:</h2>
          <div className="flex items-center justify-between">
            <p className="text-xl">
              {change < 0
                ? `Insufficient Payment: $${Math.abs(change).toFixed(2)} more needed`
                : `Change Due: $${change.toFixed(2)}`}
            </p>
            <button
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(getChangeText(change));
                utterance.lang = selectedLanguage.value;
                window.speechSynthesis.speak(utterance);
              }}
              className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Speak
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangeCalculator;
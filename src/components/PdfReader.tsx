import React, { useState, useRef } from 'react';
import { FileText, Volume2, VolumeX, Loader } from 'lucide-react';
import Select from 'react-select';
import * as pdfjsLib from 'pdfjs-dist';
import { TranslationServiceClient } from '@google-cloud/translate';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Language {
  value: string;
  label: string;
}

const languages: Language[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

function PdfReader() {
  const [pdfText, setPdfText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translateText = async (text: string, targetLanguage: string) => {
    setIsTranslating(true);
    try {
      // Replace 'YOUR_API_KEY' with your actual Google Cloud API key
      const apiKey = 'AIzaSyCtANaTWbX10K97uYp1JBC_BpeTQA9D4Qs';
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
          }),
        }
      );
      
      const data = await response.json();
      if (data.data && data.data.translations) {
        setTranslatedText(data.data.translations[0].translatedText);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      setPdfText(fullText);
      if (selectedLanguage.value !== 'en') {
        translateText(fullText, selectedLanguage.value);
      } else {
        setTranslatedText('');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const speak = () => {
    if ('speechSynthesis' in window) {
      const textToSpeak = translatedText || pdfText;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = selectedLanguage.value === 'en' ? 'en-US' : 
                      selectedLanguage.value === 'es' ? 'es-ES' :
                      selectedLanguage.value === 'fr' ? 'fr-FR' :
                      selectedLanguage.value === 'de' ? 'de-DE' : 'en-US';
      
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

  const handleLanguageChange = (lang: Language | null) => {
    if (lang) {
      setSelectedLanguage(lang);
      if (pdfText && lang.value !== 'en') {
        translateText(pdfText, lang.value);
      } else {
        setTranslatedText('');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">PDF Reader with Translation</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Target Language
        </label>
        <Select
          options={languages}
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="w-full"
        />
      </div>

      <div className="mb-6">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          <FileText className="w-5 h-5 mr-2" />
          Upload PDF
        </button>
      </div>

      {(pdfText || translatedText) && (
        <>
          <div className="mb-6">
            <button
              onClick={speak}
              className={`flex items-center px-6 py-3 rounded-lg ${
                isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-5 h-5 mr-2" />
                  Stop Reading
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Read PDF
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              {selectedLanguage.value === 'en' ? 'Original Content:' : 'Translated Content:'}
              {isTranslating && (
                <span className="ml-2 inline-flex items-center text-blue-500">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Translating...
                </span>
              )}
            </h2>
            <div className="max-h-[500px] overflow-y-auto p-4 bg-gray-50 rounded border">
              {selectedLanguage.value === 'en' ? pdfText : translatedText || pdfText}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PdfReader;
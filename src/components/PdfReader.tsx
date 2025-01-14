import React, { useState, useRef } from 'react';
import { FileText, Volume2, VolumeX } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function PdfReader() {
  const [pdfText, setPdfText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    };
    reader.readAsArrayBuffer(file);
  };

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(pdfText);
      utterance.lang = 'fr-FR'; // Only French

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Lecteur PDF en Français</h1>

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
          Télécharger le PDF
        </button>
      </div>

      {pdfText && (
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
                  Arrêter la lecture
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Lire le PDF
                </>
              )}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Contenu du PDF :</h2>
            <div className="max-h-[500px] overflow-y-auto p-4 bg-gray-50 rounded border">
              {pdfText}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PdfReader;

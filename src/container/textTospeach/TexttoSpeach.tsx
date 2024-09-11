
// import  { useState } from "react";
// import "./texttospeech.css";

// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }
// const TexttoSpeech = () => {
//   const [textValue, setTextValue] = useState("");
//   const [isListening, setIsListening] = useState(false);

//   const handlePlay = () => {
//     if (textValue) {
//       const textPlay = new SpeechSynthesisUtterance(textValue);
//       window.speechSynthesis.speak(textPlay);
//     }
//   };

//   const handleListen = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();

//     recognition.onstart = () => {
//       setIsListening(true);
//     };

//     recognition.onresult = (event : any) => {
//       const transcript = event.results[0][0].transcript;
//       setTextValue(transcript);
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//     };

//     recognition.onerror = (event : any) => {
//       console.error("Speech recognition error", event.error);
//       setIsListening(false);
//     };

//     if (!isListening) {
//       recognition.start();
//     } else {
//       recognition.stop();
//     }
//   };

//   return (
//     <div className="text-to-speech-container">
//       <h3>Text to Speech & Speech to Text</h3>
//       <div>
//         <input
//           value={textValue}
//           onChange={(e) => setTextValue(e.target.value)}
//           className="text-to-speech-input"
//           placeholder="Enter Text"
//         />
//         <button className="text-to-speech-btn" onClick={handlePlay}>
//           Play
//         </button>
//         <button
//           className="text-to-speech-btn"
//           onClick={handleListen}
//         >
//           {isListening ? "Stop Listening" : "Start Listening"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TexttoSpeech;


import React, { useState, useEffect } from 'react';

// Extend SpeechRecognition for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;

  start(): void;
  stop(): void;
  abort(): void;

  onresult: ((this: SpeechRecognition, event: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, event: Event) => void) | null;
  onend: ((this: SpeechRecognition) => void) | null;
  onstart: ((this: SpeechRecognition) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

const TextToSpeechAndSpeechToText: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new (window as any).webkitSpeechRecognition() as SpeechRecognition;
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const results = event.results;
        if (results.length > 0) {
          const result = results[0];
          if (result.length > 0) {
            setTranscript(result[0].transcript);
         
          }
        }
      };

      recognitionInstance.onerror = (event: Event) => {
        console.error('Speech recognition error:', (event as any).error);
        setError('Speech recognition error: ' + (event as any).error);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      setRecognition(recognitionInstance);
    } else {
      setError('Speech recognition not supported.');
    }
  }, [isListening]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setError('Speech synthesis not supported.');
    }
  };

  const startListening = () => {
    alert("in 1 startListening");
    if (recognition) {
        alert("in 2 startListening");
      try {
        recognition.start();
        setIsListening(true);
        alert("in 3 startListening");
      } catch (err) {
        alert("in 2 error");

        console.error('Failed to start speech recognition:', err);
        setError('Failed to start speech recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (err) {
        console.error('Failed to stop speech recognition:', err);
        setError('Failed to stop speech recognition');
      }
    }
  };

  return (
    <div>
      <h1>Text-to-Speech and Speech-to-Text</h1>

      <div>
        <h2>Text-to-Speech</h2>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text to speak"
        />
        <button onClick={speakText} disabled={isSpeaking}>
          {isSpeaking ? 'Speaking...' : 'Speak'}
        </button>
      </div>

      <div>
        <h2>Speech-to-Text</h2>
        <button onClick={isListening ? stopListening : startListening}>
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        <p>Transcript: {transcript}</p>
      </div>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
};

export default TextToSpeechAndSpeechToText;

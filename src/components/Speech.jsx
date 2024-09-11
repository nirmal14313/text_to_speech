import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Speech = () => {
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  const {
    transcript,
    // listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  console.log(transcript)
  return (
    <div className="h-screen bg-slate-300 flex justify-center items-center">
      <div className="w-2/5 h-96 bg-slate-500">
        <div className="w-full h-[60vh] p-4 bg-slate-200">
          <p className="text-slate-900">{transcript}</p>
        </div>
        <div className="w-full px-5 py-3 flex justify-between items-center bg-slate-500">
          <button
            className="py-2 px-3 bg-slate-700 text-slate-50 rounded"
            onClick={resetTranscript}
          >
            Reset
          </button>
          <button
            className="py-2 px-3 bg-slate-700 text-slate-50 rounded"
            onClick={SpeechRecognition.stopListening}
          >
            Stop
          </button>
          <button
            className="py-2 px-3 bg-slate-700 text-slate-50 rounded"
            onClick={startListening}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default Speech;

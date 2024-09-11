import { useState } from "react";
import "./App.css";
import Speech from "./components/Speech";
import { NewSpeech } from "./components/NewSpeech";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <NewSpeech />
    </>
  );
}

export default App;

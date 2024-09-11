
import  { useEffect, useState } from 'react';
import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';

export const NewDemotssTostt = () => {
    const [value, setValue] = useState('');
    const { speak } = useSpeechSynthesis();
    const [textValue, setTextValue] = useState('');
    const { listen, listening, stop } = useSpeechRecognition({
        onResult: (result : any) => {
           
            setTextValue(result);
        },
        continuous: true,
        interimResults: true 
    });

    useEffect(() => {
       
        listen();
        return () => stop(); 
    }, [listen, stop]);
  return (
    <div className='main-container'>
            <div>
      <textarea
        value={textValue}
        onChange={(event) => setTextValue(event.target.value)}
         placeholder="Speech recognition text"
      />
      <button onClick={listen}>
        Start
      </button>
      <button style={{marginLeft:'20px'}} onClick={stop}>
        Stop
      </button>
      <button style={{marginLeft:'20px'}} onClick={()=>setTextValue('')}>
        Reset
      </button>
      <p>{listening ? 'Listening...' : 'Not listening'}</p>
    </div>
    <div >
    <textarea
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
    <button style={{marginLeft:'20px'}}  onClick={() => speak({ text: value })}>Speak</button>
    <button style={{marginLeft:'20px'}}  onClick={() => setValue('')}>Reset</button>
  </div>
  </div>

  )
}

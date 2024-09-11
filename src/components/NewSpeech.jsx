import React, { useEffect, useState } from 'react';
import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';
import _ from 'lodash';

export const NewSpeech = () => {
    const [value, setValue] = useState('');
    const { speak } = useSpeechSynthesis();
    const [textValue, setTextValue] = useState('');

    const { listen, stop, listening } = useSpeechRecognition({
        onResult: (result) => {
            setTextValue(result);
        },
        continuous: true,
        interimResults: true
    });

    const debouncedStop = _.debounce(() => {
        stop();
        setTextValue('')
        console.log('Recognized text:', textValue);
    }, 2000);

    useEffect(() => {
        if (listening) {
            debouncedStop();
        }
        return () => debouncedStop.cancel();
    }, [listening, debouncedStop]);
  
   


    const handleStart = () => {
        listen();
    };

    const handleStop = () => {
        stop();
    };

    return (
        <div className='main-container'>
            <div>
                <textarea
                    value={textValue}
                    // onChange={(event) => handleConvertText(event.target.value)}
                    placeholder="Speech recognition text"
                />
                <button onClick={handleStart}>
                    Start
                </button>
                <button style={{ marginLeft: '20px' }} onClick={handleStop}>
                    Stop
                </button>
                <button style={{ marginLeft: '20px' }} onClick={() => setTextValue('')}>
                    Reset
                </button>
                <p>{listening ? 'Listening...' : 'Not listening'}</p>
            </div>
            <div>
                <textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
                <button style={{ marginLeft: '20px' }} onClick={() => speak({ text: value })}>Speak</button>
                <button style={{ marginLeft: '20px' }} onClick={() => setValue('')}>Reset</button>
            </div>
        </div>
    );
};
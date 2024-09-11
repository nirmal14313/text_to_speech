import { BrowserRouter, Route, Routes as Routess } from "react-router-dom";
import VoiceBots from "../container/pages/users/voiceBots/VoiceBots";
import VoiceSpeaking from "../container/pages/users/voiceSpeaking/VoiceSpeaking";
import VoiceUserSpeaking from "../container/pages/users/voiceUserSpeaking/VoiceUserSpeaking";
import TexttoSpeach from "../container/textTospeach/TexttoSpeach";
import EndSession from "../container/pages/users/voiceBots/EndSession";
import { NewDemotssTostt } from "../container/pages/users/voiceBots/NewDemotssTostt";
import IosDemo from "../container/pages/users/voiceBots/IosDemo";
// import DemospeechToAudio from "../container/pages/users/voiceBots/DemospeechToAudio";

export default function Routes() {
  return (
    <BrowserRouter >
      <Routess>
          <Route path="/" index element={<VoiceBots />} />
          <Route path="/end-session" index element={<EndSession />} />

          <Route path="/voice-speaking" index element={<VoiceSpeaking />} />
          <Route path="/voice-user-speaking" index element={<VoiceUserSpeaking />} />
          <Route path="/text-to-speech" index element={<TexttoSpeach />} />
          {/* <Route path="/demo" index element={<DemospeechToAudio />} /> */}
          <Route path="/new-demo" index element={<NewDemotssTostt />} />
          <Route path="/ios-demo" index element={<IosDemo />} />


          


      </Routess>
    </BrowserRouter>
  );
}

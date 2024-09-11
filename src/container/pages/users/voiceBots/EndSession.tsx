
import Index from "../../../Index";
import "./VoiceBots.css";
import "./voiceBots.responsive.css";
import PagesIndex from "../../../PagesIndex";
import { useNavigate } from "react-router-dom";




const EndSession = () => {
  
  const navigate = useNavigate()
  return (

      <Index.Box className="position-relative">
        <Index.Box className="voice-bot-bgcontain">
          <Index.Box className="voicebot-bg">
            <Index.Box className="voicebot-space">
              <Index.Box className="voicebot-max-card">
                <Index.Box className="voice-bot-card">
                  <Index.Box className="voicebot-card-body">
                    <Index.Box className="voicebot-img-contain">
                      <img
                        src={PagesIndex.Png.VoiceOne}
                        alt="VoiceOne"
                        className="voice-one"
                      />
                    </Index.Box>
         
                      
                    

                   

                     
                   
                      <Index.Box className="voice-contain-bots">
                        <Index.Typography className="title-voices-say">
                           <span>End session</span>,
                        </Index.Typography>
                        <Index.Typography className="title-voices-head">
                          Share your story
                          and get a written keepsake in your Voicebot Storybook.
                        </Index.Typography>
                        <Index.Box className="common-primary-main">
                          <PagesIndex.Button
                            className="btn-primary"
                            // onClick={handleOpenInterview}
                            // onClick={handleOpenChat}
                            onClick={() => navigate("/")}
                          >
                            Home
                          </PagesIndex.Button>
                        </Index.Box>
             
                  </Index.Box>
                </Index.Box>
              </Index.Box>
            </Index.Box>
          </Index.Box>
        </Index.Box>

      
      </Index.Box>

   </Index.Box>
    

  
   
  );
};

export default EndSession;

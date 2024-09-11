import Index from "../../../Index";
import "./voiceUserSpeaking.css"
import "./voiceUserSpeaking.responsive.css"
import PagesIndex from "../../../PagesIndex";

const VoiceUserSpeaking = () => {
  return (
        <Index.Box className="voice-user-speaking">
      <Index.Box className="voice-bot-bgcontain voice-speaking-main">
        <Index.Box className="voicebot-bg">
          <Index.Box className="voicebot-space">
            <Index.Box className="voicebot-max-card">
              <Index.Box className="voice-bot-card">
                <Index.Box className="voicebot-card-body">
                  <Index.Box className="voicebot-card-speaking">
                    <Index.Typography className="speaking-title-contain">
                    User is Speaking
                    </Index.Typography>
                    <img
                      src={PagesIndex.Png.VoiceOne}
                      alt="speaking"
                      className="img-speaking"
                    />
                    <Index.Box className="common-primary-main">
                      <PagesIndex.Button className="btn-primary">
                        <img
                          src={PagesIndex.Svg.Cancel}
                          alt="Cancel"
                          className="cancel-icon"
                        />{" "}
                        End
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

export default VoiceUserSpeaking;

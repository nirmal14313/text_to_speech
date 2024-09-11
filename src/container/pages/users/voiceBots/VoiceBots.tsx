
import { useEffect, useState } from "react";
import Index from "../../../Index";
import "./VoiceBots.css";
import "./voiceBots.responsive.css";
import PagesIndex from "../../../PagesIndex";
import DataService from "../../../../config/Dataservice";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { useSpeechRecognition } from 'react-speech-kit';

interface DownloadLink {
  documentFile?: string | undefined;
  audioFile?: string | undefined;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

const VoiceBots = () => {
 
  const [openChatModal, setOpenChatModal] = useState(false);
  const [AllRoomData, setAllRoomData] = useState<any>({});
  const [showWaiting, setShowWaiting] = useState(false);
  const [showPlaying, setShowplaying] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [downloadLink, setDownloadLink] = useState<DownloadLink | undefined>(
    undefined
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [openSession, setOpenSession] = useState(false);
  const handleCloseSession = () => setOpenSession(false);
  const [showCounter, setShowCounter] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [threadId, setThreadId] = useState("");
  const [copiedTooltipOpen, setCopiedTooltipOpen] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [repeatCounter, setRepeatCounter] = useState(0);
  const [timeoutCounter,setTimeoutCounter] = useState(0); 
  const [permissionStatus, setPermissionStatus] = useState<
  "granted" | "denied" | "prompt" | "unknown"
>("unknown");
  console.log(timeoutCounter,"timeoutCounter")
  const navigate = useNavigate();

  const handleOpenSessionComplete = () => {
    setOpenSession(false);
  };


  const getThreadId = () => {
    DataService.get("/thread")
      .then((res) => {
        setThreadId(res.data.threadId);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  
  const checkMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionStatus("granted");
      setIsPopupVisible(false);
    } catch (error) {
      setPermissionStatus("denied");
      setIsPopupVisible(true);
    }
  };

  useEffect(() => {
    checkMicrophonePermission();
  }, []);
  const handleAllow = async () => {
    await checkMicrophonePermission();
  };

  const handleOpenChat = async () => {
    setShowBtn(false);
    if (permissionStatus == "granted") {
      setShowWaiting(true);
      setOpenChatModal(true);
      getThreadId();
      setIsPopupVisible(false);

      await DataService.post("/create-room")
        .then((res) => {
          setAllRoomData(res?.data);
          localStorage.setItem("roomId", res?.data?.roomId);
          setShowWaiting(false);
          setShowCounter(false);
          setShowplaying(true);
        })
        .catch((err) => console.log(err));
    } else {
      setIsPopupVisible(true);
    }
  };

  const getRoomId: any = localStorage.getItem("roomId");

  const { listen, stop } = useSpeechRecognition({
    onResult: (result: string) => {
      setTextValue(result);
      localStorage.setItem("textValue", result);
     
    },
    
    continuous: true,
    interimResults: true,
    
    onError: (error:any) => {
      console.log(error,"1111111")
    }
    
  });


  useEffect(() => {
       
    listen();
    return () => stop(); 
}, [listen, stop]);

const handleAudioSubmit = async () => {
  const getTextValue: any = localStorage.getItem("textValue");
  setShowWaiting(true);
  setShowplaying(false);
  setShowCounter(false);
 
  const formData: any = {
    roomId: getRoomId,

    threadId: threadId
  };
  if (!isRepeating) {
    formData.nextAudioId = AllRoomData?.audioFile?.nextAudioId;
  }
  if (isRepeating) {
    formData.previousResponse = AllRoomData;
    formData.isRepeat = isRepeating;
  }
if(!getTextValue && AllRoomData?.audioFile.isStartRec === "Yes" && !isRepeating){
formData.previousResponse = AllRoomData;
    formData.isRepeat = true;
    setRepeatCounter((prev) => prev + 1);

}

  if (getTextValue) {
    formData.textFile = getTextValue;
    formData.questionKey = AllRoomData?.audioFile?.keyName;
    formData.answer = getTextValue;
    setAllRoomData("")
    setTimeoutCounter((prev) => prev + 1)
    console.log("in textvalue",timeoutCounter)
  }
  if (AllRoomData?.audioFile?.keyName == "topicName") {
    formData.topicName = getTextValue;
  }


  if (repeatCounter <= 2 )  {
    await DataService.post("/sent-message", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then((res) => {
        setAllRoomData(
          res.data?.previousResponse ? res.data?.previousResponse : res.data
        );
        setShowWaiting(false);
        setShowplaying(true);
        setShowCounter(false);
        setIsRepeating(false);
        setTextValue("");
        localStorage.removeItem("textValue");
       
      })
      .catch((err) => {
        console.error("Audio upload error", err);
      });
  } else if (repeatCounter <= 3) {
    setShowWaiting(false);
    setShowplaying(false);
    setAllRoomData({});
    setShowCounter(false);
    localStorage.removeItem("textValue");

     navigate("/end-session");
   
  }
};


  const handleSpeechToText = ()=>{
    
    if (AllRoomData?.audioFile?.textFile) {
      
      let textSpeechValue = AllRoomData?.audioFile?.textFile;
      const textPlay = new SpeechSynthesisUtterance(textSpeechValue);
      window.speechSynthesis.speak(textPlay);
      textPlay.onend = () => {
        console.log("on end")
        if (AllRoomData?.audioFile.isStartRec === "Yes") {
          setShowplaying(false);
          setShowCounter(true);

          listen();
        
        // Set a timeout to stop listening after a delay
        // Adjust the delay based on your requirements (e.g., 3 seconds)

        if(timeoutCounter < 3){
          setTimeout(() => {
            stop();
            console.log("in 1 counter")
            // Trigger the click event after stopping listening
            handleAudioSubmit()
          }, 5000);
        }
         if(timeoutCounter >= 3){
          setTimeout(() => {
            stop();
            console.log("in 2 counter")

            // Trigger the click event after stopping listening
            handleAudioSubmit();
          }, 10000);
        }
        }

        if (AllRoomData?.audioFile.isStartRec === "No") {
          setShowplaying(true);
          handleAudioSubmit();
          console.log("no record repeat api")
          setShowCounter(false);
        } else if (AllRoomData?.audioFile.isStartRec === "End") {
          setShowplaying(true);
          setTimeout(() => {
            setShowWaiting(true);
            setShowplaying(false);
          }, 2000);

          setTimeout(() => {
            setShowBtn(true);
            setShowWaiting(false);
            setShowplaying(false);
          }, 3000);
        }
      };
    
    }
  }

  useEffect(() => {
    handleSpeechToText()
   
  }, [AllRoomData]);

  
  useEffect(() => {
    if (textValue !== '' && AllRoomData?.audioFile?.isStartRec === 'Yes') {
      setIsRepeating(false);
      setRepeatCounter(0);
    } else if (textValue === '' && AllRoomData?.audioFile?.isStartRec === 'Yes') {
      setIsRepeating(true);
      setRepeatCounter((prev) => prev + 1);
      setTextValue('');
    }
  }, [textValue]);

  const handleCopyLink = (downloadLinks: string | undefined) => {
    if (downloadLinks) {
      navigator.clipboard
        .writeText(downloadLinks)
        .then(() => {
          setCopiedTooltipOpen(true);
          setTimeout(() => setCopiedTooltipOpen(false), 2000); // Hide tooltip after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy the download link: ", err);
        });
    } else {
      console.log("No download link available");
    }
  };
  
    // handle generate link function
    const handleGenerateLink = async () => {
        if (!getRoomId) return;
      console.log("getRoomId",getRoomId)
        setIsGenerating(true);
    setShowWaiting(true)

        try {
          const response = await DataService.post("/speech-to-text", {
            roomId: getRoomId
          });
          setShowBtn(true)
          setDownloadLink(response.data.downloadLinks)
          setShowWaiting(false)
          // Adjust based on your endpoint response
        } catch (error) {
          console.error("Error generating download link:", error);
        }
      };
  //combine text to audio
  const handleGenerateTextToAudio = async () => {

    if (!getRoomId) return;

    setIsGenerating(true);
    setShowWaiting(true);
    setShowBtn(false)
    
    try {
    await DataService.post("/generate-Audio", {
        roomId: getRoomId
      }).then((res)=>{
console.log(res)
        handleGenerateLink()
      }).catch((err)=>{
        console.log(err)
      })
 // Adjust based on your endpoint response
    } catch (error) {
      console.error("Error generating download link:", error);
    }
  };



  // handle download function
  const handleDownload = async () => {
    if (!getRoomId) return;

    try {
      const response = await DataService.get(
        `/document-download?roomId=${getRoomId}`,
        {
          responseType: "blob"
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;

      // You can set the download attribute to specify the file name
      link.setAttribute("download", "voicechat.docx");

      // Append the link to the body (it needs to be in the DOM for the click to work)
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Cleanup: Remove the link and revoke the object URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // handle audio file download
  const handleAudio = async () => {
    if (!getRoomId) return;

    try {
      const response = await DataService.get(
        `/download-audio?roomId=${getRoomId}`,
        {
          responseType: "blob"
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;

      // You can set the download attribute to specify the file name
      link.setAttribute("download", "audio.mp3");

      // Append the link to the body (it needs to be in the DOM for the click to work)
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Cleanup: Remove the link and revoke the object URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <>
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
                    {openChatModal ? (
                      <>
                        <Index.Box className="chat-voices-body-flex">
                          <Index.Box className="chat-voice-inner-body">
                            {showWaiting && (
                              <Index.Box className="loader-center">
                                <Index.Box className="loader-dots"></Index.Box>
                              </Index.Box>
                            )}

                            {showPlaying && (
                              <Index.Box
                                className="common-chat-voice-show"
                                id="playing-animation"
                              >
                                <Index.Box className="playing">
                                  <span className="playing__bar playing__bar1"></span>
                                  <span className="playing__bar playing__bar2"></span>
                                  <span className="playing__bar playing__bar3"></span>
                                </Index.Box>
                              </Index.Box>
                            )}

                            {showCounter && (
                              <Index.Box
                                className="common-chat-voice-show"
                                id="counter-animation"
                              >
                                <Index.Box className="timer animatable">
                                  <Index.Box className="user-speaking">
                                    <div id="bars">
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                      <div className="bar"></div>
                                    </div>
                                  </Index.Box>
                                </Index.Box>
                              </Index.Box>
                            )}

                            {showBtn && (
                              <Index.Box className="common-chat-voice-show">
                                <Index.Box className="">
                                  <h1 className="thankyou-text">Thank You!</h1>
                                  <div className="downlond-btn">
                                    {!isGenerating && (
                                      <button
                                        onClick={handleGenerateTextToAudio}
                                        disabled={isGenerating}
                                        className="generate-btn"
                                      >
                                        End Session
                                      </button>
                                    )}
                                    {isGenerating && (
                                      <Index.Box className="downlond-btn-flex">
                                        <button
                                          onClick={handleDownload}
                                          className="generate-btn"
                                        >
                                          Download Text
                                        </button>
                                        <Tooltip
                                          title={
                                            copiedTooltipOpen
                                              ? "Copied!"
                                              : "Copy Link"
                                          }
                                          arrow
                                        >
                                          <ContentCopyIcon
                                            onClick={() =>
                                              handleCopyLink(
                                                downloadLink?.documentFile
                                              )
                                            }
                                          />
                                        </Tooltip>
                                      </Index.Box>
                                    )}

                                    {isGenerating && (
                                      <Index.Box className="downlond-btn-flex">
                                        <button
                                          onClick={handleAudio}
                                          className="generate-btn"
                                        >
                                          Download Audio
                                        </button>
                                        <Tooltip
                                          title={
                                            copiedTooltipOpen
                                              ? "Copied!"
                                              : "Copy Link"
                                          }
                                          arrow
                                        >
                                          <ContentCopyIcon
                                            onClick={() =>
                                              handleCopyLink(
                                                downloadLink?.audioFile
                                              )
                                            }
                                          />
                                        </Tooltip>
                                      </Index.Box>
                                    )}
                                    <button
                                      onClick={handleOpenChat}
                                      className="generate-btn"
                                    >
                                      Start New Session
                                    </button>
                                  </div>
                                </Index.Box>
                              </Index.Box>
                            )}
                          </Index.Box>
                        </Index.Box>

                      </>
                    ) : (
                      <Index.Box className="voice-contain-bots">
                        <Index.Typography className="title-voices-say">
                          Hi <span>Lorem Ipsum</span>,
                        </Index.Typography>
                        <Index.Typography className="title-voices-head">
                          Welcome to the Voicebot Story Bot! Share your story
                          and get a written keepsake in your Voicebot Storybook.
                        </Index.Typography>
                        <Index.Box className="common-primary-main">
                          <PagesIndex.Button
                            className="btn-primary"
                            // onClick={handleOpenInterview}
                            onClick={handleOpenChat}
                          >
                            Start
                          </PagesIndex.Button>
                        </Index.Box>
                      </Index.Box>
                    )}
                  </Index.Box>
                </Index.Box>
              </Index.Box>
            </Index.Box>
          </Index.Box>
        </Index.Box>

        {/* custom popup start */}

        {isPopupVisible && (
          <Index.Box className="custom-modal-bg-main">
            <Index.Box className="custom-modal-card">
              <Index.Box className="custom-modal-body">
                <Index.Box className="custom-modal-details">
                  <Index.Typography className="custom-title-popup">
                    Voicebot wants to access your microphone
                  </Index.Typography>
                  <Index.Box className="custom-flex-modal">
                    <Index.Box className="custom-btn-max">
                      <PagesIndex.Button
                        className="btn-secondary"
                        onClick={() => setIsPopupVisible(false)}
                      >
                        Block
                      </PagesIndex.Button>
                    </Index.Box>
                    <Index.Box className="custom-btn-max">
                      <PagesIndex.Button
                        className="btn-primary"
                        onClick={handleAllow}
                      >
                        Allow
                      </PagesIndex.Button>
                    </Index.Box>
                  </Index.Box>
                </Index.Box>
              </Index.Box>
            </Index.Box>
          </Index.Box>
        )}

        {/* custom popup end */}
      </Index.Box>

      {/* session-end start */}
      <Index.Modal
        open={openSession}
        onClose={handleCloseSession}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="voice-bot-common-modal sesstion-end-modal"
      >
        <Index.Box sx={style} className="voice-bot-common-style">
          <Index.Box className="common-modal-close">
            <PagesIndex.Button className="btn-close-modal">
              <img
                src={PagesIndex.Svg.CancelRound}
                alt="CancelRound"
                className="cancel-round-icon"
              />
            </PagesIndex.Button>
          </Index.Box>
          <Index.Box className="modal-common-listing session-end-main">
            <Index.Box className="interview-head">
              <Index.Typography className="interview-title">
                Session Ended
              </Index.Typography>
              <Index.Typography className="session-end-desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut
              </Index.Typography>
            </Index.Box>
            <Index.Box className="interview-modal-btn">
              <Index.Box className="custom-flex-modal">
                <Index.Box className="custom-btn-max">
                  <PagesIndex.Button
                    className="btn-primary"
                    onClick={handleOpenSessionComplete}
                  >
                    Next{" "}
                    <img
                      src={PagesIndex.Svg.RightArrow}
                      alt="RightArrow"
                      className="next-icon"
                    />
                  </PagesIndex.Button>
                </Index.Box>
              </Index.Box>
            </Index.Box>
          </Index.Box>
        </Index.Box>
      </Index.Modal>
      {/* session-end end */}

    </>
  );
};

export default VoiceBots;

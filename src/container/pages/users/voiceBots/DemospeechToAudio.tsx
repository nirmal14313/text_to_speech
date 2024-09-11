// // import  { useState } from "react";
// // import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
// // import axios from "axios";

// // const DemospeechToAudio = () => {
// //   const recorderControls = useAudioRecorder();
// //   // const [AllRoomData, setAllRoomData] = useState<any>({});

// //   const [blob,setBlob] = useState(false);
// // //   const getRoomId: any = localStorage.getItem("roomId");
// //   // Callback for when recording is saved
// //   const addAudioElement = (blob : any) => {
// //     let mp3AudioBlob = new Blob([blob], { type: "audio/mp3" });
// //     console.log(mp3AudioBlob,"3333333333333")
// //     setBlob(blob)
// //     handleAudioSubmit(mp3AudioBlob);// Append audio element to DOM (or use state)
// //   };

// //   const handleAudioSubmit = async (mp3AudioBlob: any) => {

// //     const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
// //     const filename: any = `${"45689"}-${date}-${Math.floor(
// //       1000 + Math.random() * 9000
// //     )}.mp3`;

// //     const formData = new FormData();
// //     if (mp3AudioBlob) {
// //       formData.append("file", mp3AudioBlob, filename || []);
// //     }

// //     await
// //       axios.post(
// //         `http://php74.appworkdemo.com/testfileupload/fileupload.php`,
// //         formData,
// //         {
// //           headers: {
// //             "Content-Type": "multipart/form-data"
// //           }
// //         }
// //       )
// //       .then((res) => {
// //         // setAllRoomData(res.data);
// //         alert("Audio uploaded successfully");

// //       })
// //       .catch((err) => {
// //         console.error("Audio upload error", err);
// //       });
// //   };

// //   return (
// //     <div>
// //       <h2>Speech to Audio Recording</h2>

// //       {/* The AudioRecorder component */}
// //       <AudioRecorder
// //         onRecordingComplete={(blob) => addAudioElement(blob)}
// //         recorderControls={recorderControls}
// //       />

// //       {/* Control buttons for recording */}
// //       <div>
// //         <button onClick={recorderControls.startRecording}>Start Recording</button>
// //         <button onClick={recorderControls.stopRecording}>Stop Recording</button>

// //         {blob}
// //       </div>
// //     </div>
// //   );
// // };

// // export default DemospeechToAudio;

import { useEffect, useState } from "react";
import Index from "../../../Index";
import "./VoiceBots.css";
import "./voiceBots.responsive.css";
import PagesIndex from "../../../PagesIndex";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { CircleStop, Mic } from "lucide-react";
import DataService from "../../../../config/Dataservice";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";

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

const DemospeechToAudio = () => {
  const [open, setOpen] = useState(false);
  const [openChatModal, setOpenChatModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [AllRoomData, setAllRoomData] = useState<any>({});
  const [showWaiting, setShowWaiting] = useState(false);
  const [showPlaying, setShowplaying] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [downloadLink, setDownloadLink] = useState<DownloadLink | undefined>(
    undefined
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [threadId, setThreadId] = useState("");
  const [copiedTooltipOpen, setCopiedTooltipOpen] = useState(false);
  const [isRepeating, setIsRepeating] = useState<boolean | undefined | null | any>(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [repeatCounter, setRepeatCounter] = useState(0);
  const [counter, setCounter] = useState(0);
  
  console.log(counter,"1")
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  useEffect(() => {
    checkMicrophonePermission();
  }, []);
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

  const handleCloseInterview = () => {
    setOpen(false);
    // setOpenSession(true);
  };



const navigate = useNavigate();
  const recorderControls = useAudioRecorder();
  const handleAudioBlob = (blob: any) => {
    let mp3AudioBlob = new Blob([blob], { type: "audio/mp3" });
    console.log(mp3AudioBlob)
    handleAudioSubmit(mp3AudioBlob);
  };

  useEffect(() => {
    if (textValue !== "" && AllRoomData?.audioFile.isStartRec === "Yes") {
      setIsRepeating(false);
      setRepeatCounter(0)
    } else if (
      textValue == "" &&
      AllRoomData?.audioFile?.isStartRec === "Yes"
    ) {
      setIsRepeating(true);
      setRepeatCounter((prev) => prev + 1);
      setTextValue("");
      // setAllRoomData(AllRoomData)
    }
  }, [textValue]);

  const handleAudioSubmit = async (mp3AudioBlob:any) => {
    let isRepeat:any =  true 
    setShowWaiting(true);
    setShowplaying(false);
    setShowCounter(false);
    setIsSending(true);

        const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const filename: any = `${"45689"}-${date}-${Math.floor(
      1000 + Math.random() * 9000
    )}.mp3`;
    console.log(filename, "filename")

    const formData = new FormData();
    formData.append("roomId", getRoomId);
    formData.append("threadId", threadId);
    if (mp3AudioBlob) {
      formData.append("audio", mp3AudioBlob, filename || []);
  
    }

    if (AllRoomData?.audioFile?.nextAudioId) {
      // formData.nextAudioId = AllRoomData?.audioFile?.nextAudioId;
      formData.append("nextAudioId", AllRoomData?.audioFile?.nextAudioId);
  
    }
    if (isRepeating) {
      formData.append("previousResponse", AllRoomData);
      formData.append("isRepeat", isRepeating);
  
    }
if(!mp3AudioBlob && AllRoomData?.audioFile.isStartRec === "Yes" && !isRepeating){
  formData.append("previousResponse", AllRoomData);
  formData.append("isRepeat", isRepeat );

}

if (mp3AudioBlob) {
  formData.append("questionKey", AllRoomData?.audioFile?.keyName);
  formData.append("answer", textValue);
        }
    // if (textValue) {
      // formData.textFile = textValue;

    // }
    if (AllRoomData?.audioFile?.keyName == "topicName") {
      formData.append("topicName", textValue);
 
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

        })
        .catch((err) => {
          console.error("Audio upload error", err);
        });
      setIsSending(false);
    } else if (repeatCounter === 3) {
      setShowWaiting(false);
      setShowplaying(false);
      setAllRoomData({});
      setShowCounter(false);
        navigate("/end-session");

    }
  };

  const handleSpeechToText = ()=>{
    if (AllRoomData?.audioFile?.textFile) {
      let textSpeechValue = AllRoomData?.audioFile?.textFile;
      const textPlay = new SpeechSynthesisUtterance(textSpeechValue);
      window.speechSynthesis.speak(textPlay);

      textPlay.onend = () => {
        if (AllRoomData?.audioFile.isStartRec === "Yes") {
          setShowplaying(false);
          setShowCounter(true);

          //@ts-ignore
          document.getElementById("cursor-pointer-2").click();
               setCounter(5);
               const interval = setInterval(() => {
                setCounter((prev) => {
                  if (prev <= 0) {
                    clearInterval(interval);
                    //@ts-ignore
                    document.getElementById("cursor-pointer-3").click();
                    // handleAudioSubmit();
                    // Submit the audio once the timer ends
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);

        }

        if (AllRoomData?.audioFile.isStartRec === "No") {
          setShowplaying(true);
          handleAudioSubmit(null);
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

    setIsGenerating(true);
    try {
      const response = await DataService.post("/speech-to-text", {
        roomId: getRoomId
      });
      setDownloadLink(response.data.downloadLinks); // Adjust based on your endpoint response
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
                                        onClick={handleGenerateLink}
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

                        <Index.Box className="chat-voice-footer">
                          <Index.Box className="audio-record-bg-footer">
                            {!recorderControls.isRecording ? (
                              <button
                                type="button"
                                id="cursor-pointer-2"
                                disabled={isSending}
                                onClick={recorderControls.startRecording}
                                className={`${
                                  isSending ? "cursor-wait" : "cursor-pointer"
                                }`}
                              >
                                <Mic color="#ffffff" size={25} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                id="cursor-pointer-3"
                                className="cursor-pointer"
                                onClick={recorderControls.stopRecording}
                              >
                                <CircleStop color="#ff0000" size={25} />
                              </button>
                            )}
                          </Index.Box>
                        </Index.Box>

                        <Index.Box className="audio-recorder-hidden">
                          <AudioRecorder
                            onRecordingComplete={handleAudioBlob}
                            recorderControls={recorderControls}
                            downloadFileExtension="mp3"
                          />
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

      {/* interview-end start */}
      <Index.Modal
        open={open}
        onClose={handleCloseInterview}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="voice-bot-common-modal"
      >
        <Index.Box
          sx={style}
          className="voice-bot-common-style interview-max-modal"
        >
          <Index.Box className="common-modal-close">
            <PagesIndex.Button className="btn-close-modal">
              <img
                src={PagesIndex.Svg.CancelRound}
                alt="CancelRound"
                className="cancel-round-icon"
              />
            </PagesIndex.Button>
          </Index.Box>
          <Index.Box className="modal-common-listing">
            <Index.Box className="interview-head">
              <Index.Typography className="interview-title">
                Are you sure you want to end interview?
              </Index.Typography>
            </Index.Box>
            <Index.Box className="interview-modal-btn">
              <Index.Box className="custom-flex-modal">
                <Index.Box className="custom-btn-max">
                  <PagesIndex.Button className="btn-secondary">
                    No, cancel
                  </PagesIndex.Button>
                </Index.Box>
                <Index.Box className="custom-btn-max">
                  <PagesIndex.Button
                    className="btn-primary"
                    onClick={handleCloseInterview}
                  >
                    Yes, Confirm
                  </PagesIndex.Button>
                </Index.Box>
              </Index.Box>
            </Index.Box>
          </Index.Box>
        </Index.Box>
      </Index.Modal>
      {/* interview-end end */}

    </>
  );
};

export default DemospeechToAudio;

// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// function DemospeechToAudio() {
//   const {
//     transcript,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//     listening,
//   } = useSpeechRecognition();
//   alert("page loaded")
// alert(browserSupportsSpeechRecognition)
//   // Check if the browser supports speech recognition
//   if (!browserSupportsSpeechRecognition) {
//     return <div>Your browser does not support speech recognition.</div>;
//   }

//   return (
//     <div className="App">
//       <h1 style={{ textAlign: 'center' ,color:"blue" }}>Speech-to-Text Converter</h1>
//       <div>
//         <button
//           style={{color:"red"}}
//           onClick={() => SpeechRecognition.startListening()}
//           disabled={listening}
//         >
//           Start Listening
//         </button>
//         <button
//         style={{color:"red"}}
//           onClick={() => SpeechRecognition.stopListening()}
//           disabled={!listening}
//         >
//           Stop Listening
//         </button>
//         <button onClick={resetTranscript}>Reset</button>
//       </div>
//       <textarea
//         value={transcript || ''}
//         onChange={() => {}}
//         rows={10}
//         cols={50}
//         placeholder="Your speech will appear here..."
//         style={{ width: '100%' , textAlign: 'center' ,color:"blue"}}
//       />
//     </div>
//   );
// };

// export default DemospeechToAudio;



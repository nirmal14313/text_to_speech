// import { useEffect, useState } from "react";
// import Index from "../../../Index";
// import "./VoiceBots.css";
// import "./voiceBots.responsive.css";
// import PagesIndex from "../../../PagesIndex";
// import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
// import { CircleStop, Mic } from "lucide-react";
// import DataService from "../../../../config/Dataservice";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import Tooltip from "@mui/material/Tooltip";
// import { useNavigate } from "react-router-dom";
// import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';

// interface DownloadLink {
//   documentFile?: string | undefined;
//   audioFile?: string | undefined;
// }

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4
// };

// const VoiceBots = () => {
//   const [open, setOpen] = useState(false);
//   const [openChatModal, setOpenChatModal] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const [AllRoomData, setAllRoomData] = useState<any>({});
//   const [showWaiting, setShowWaiting] = useState(false);
//   const [showPlaying, setShowplaying] = useState(false);
//   const [showBtn, setShowBtn] = useState(false);
//   const [downloadLink, setDownloadLink] = useState<DownloadLink | undefined>(
//     undefined
//   );
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [openSession, setOpenSession] = useState(false);
//   const handleCloseSession = () => setOpenSession(false);
//   const [showCounter, setShowCounter] = useState(false);
//   const [textValue, setTextValue] = useState("");
//   // const [isListening, setIsListening] = useState(false);
//   const [openSessionComplete, setOpenSessionComplete] = useState(false);
//   const [threadId, setThreadId] = useState("");
//   const [copiedTooltipOpen, setCopiedTooltipOpen] = useState(false);
//   const [isRepeating, setIsRepeating] = useState(false);
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const [repeatCounter, setRepeatCounter] = useState(0);
//   const [timeoutCounter,setTimeoutCounter] = useState(0); 
//   console.log(timeoutCounter,"timeoutCounter")
//   const { speak } = useSpeechSynthesis();

//   // const { speak } = useSpeechSynthesis();
//   const { listen, stop } = useSpeechRecognition({
//     onResult: (result: string) => {
//       setTextValue(result);
     
//     },
    
//     continuous: true,
//     interimResults: true,
    
//     onError: (error:any) => {
//       console.log(error,"1111111")
//     }
    
//   });
//   const [permissionStatus, setPermissionStatus] = useState<
//     "granted" | "denied" | "prompt" | "unknown"
//   >("unknown");

//   useEffect(() => {
//     checkMicrophonePermission();
//   }, []);
//   const getThreadId = () => {
//     DataService.get("/thread")
//       .then((res) => {
//         setThreadId(res.data.threadId);
//       })
//       .catch((err) => {
//         console.log(err, "err");
//       });
//   };
  
//   const checkMicrophonePermission = async () => {
//     try {
//       await navigator.mediaDevices.getUserMedia({ audio: true });
//       setPermissionStatus("granted");
//       setIsPopupVisible(false);
//     } catch (error) {
//       setPermissionStatus("denied");
//       setIsPopupVisible(true);
//     }
//   };
//   const handleAllow = async () => {
//     await checkMicrophonePermission();
//   };

//   const handleOpenChat = async () => {
//     setShowBtn(false);
//     if (permissionStatus == "granted") {
//       setShowWaiting(true);
//       setOpenChatModal(true);
//       getThreadId();
//       setIsPopupVisible(false);

//       await DataService.post("/create-room")
//         .then((res) => {
//           setAllRoomData(res?.data);
//           localStorage.setItem("roomId", res?.data?.roomId);
//           setShowWaiting(false);
//           setShowCounter(false);
//           setShowplaying(true);
//         })
//         .catch((err) => console.log(err));
//     } else {
//       setIsPopupVisible(true);
//     }
//   };

//   const getRoomId: any = localStorage.getItem("roomId");

//   const handleCloseInterview = () => {
//     setOpen(false);
//     setOpenSession(true);
//   };

//   const handleOpenSessionComplete = () => {
//     setOpenSessionComplete(true);
//     setOpenSession(false);
//   };
//   const handleCloseSessionComplete = () => {
//     setOpenSessionComplete(false);
//   };
// const navigate = useNavigate();
//   const recorderControls = useAudioRecorder();
//   const handleAudioBlob = (blob: any) => {
//     let mp3AudioBlob = new Blob([blob], { type: "audio/mp3" });
//     console.log(mp3AudioBlob)
//     handleAudioSubmit();
//   };

//   useEffect(() => {
//     if (textValue !== '' && AllRoomData?.audioFile?.isStartRec === 'Yes') {
//       setIsRepeating(false);
//       setRepeatCounter(0);
//     } else if (textValue === '' && AllRoomData?.audioFile?.isStartRec === 'Yes') {
//       setIsRepeating(true);
//       setRepeatCounter((prev) => prev + 1);
//       setTextValue('');
//     }
//   }, [textValue]);
//   useEffect(() => {
       
//     listen();
//     return () => stop(); 
// }, [listen, stop]);

//   const handleAudioSubmit = async () => {
//     console.log("in function ")
//     setShowWaiting(true);
//     setShowplaying(false);
//     setShowCounter(false);
//     setIsSending(true);
//     const formData: any = {
//       roomId: getRoomId,

//       threadId: threadId
//     };
//     if (!isRepeating) {
//       formData.nextAudioId = AllRoomData?.audioFile?.nextAudioId;
//     }
//     if (isRepeating) {
//       formData.previousResponse = AllRoomData;
//       formData.isRepeat = isRepeating;
//     }
// if(!textValue && AllRoomData?.audioFile.isStartRec === "Yes" && !isRepeating){
//   formData.previousResponse = AllRoomData;
//       formData.isRepeat = true;
//       setRepeatCounter((prev) => prev + 1);

// }

//     if (textValue) {
//       formData.textFile = textValue;
//       formData.questionKey = AllRoomData?.audioFile?.keyName;
//       formData.answer = textValue;
//       setTimeoutCounter((prev) => prev + 1)
//       console.log("in textvalue",timeoutCounter)
//     }
//     if (AllRoomData?.audioFile?.keyName == "topicName") {
//       formData.topicName = textValue;
//     }
 

//     if (repeatCounter <= 2 )  {
//       await DataService.post("/sent-message", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       })
//         .then((res) => {
//           setAllRoomData(
//             res.data?.previousResponse ? res.data?.previousResponse : res.data
//           );
//           setShowWaiting(false);
//           setShowplaying(true);
//           setShowCounter(false);
//           setIsRepeating(false);
//           setTextValue("");
         
//         })
//         .catch((err) => {
//           console.error("Audio upload error", err);
//         });
//       setIsSending(false);
//     } else if (repeatCounter <= 3) {
//       setShowWaiting(false);
//       setShowplaying(false);
//       setAllRoomData({});
//       setShowCounter(false);
//        navigate("/end-session");
     
//     }
//   };




//   const handleSpeechToText = ()=>{
    
//     if (AllRoomData?.audioFile?.textFile) {
      
//       let textSpeechValue = AllRoomData?.audioFile?.textFile;
//       const textPlay = new SpeechSynthesisUtterance(textSpeechValue);
//       window.speechSynthesis.speak(textPlay);
//       textPlay.onend = () => {
//         console.log("on end")
//         if (AllRoomData?.audioFile.isStartRec === "Yes") {
//           setShowplaying(false);
//           setShowCounter(true);

//           //@ts-ignore
//           // document.getElementById("cursor-pointer-2").click();

//           listen();
        
//         // Set a timeout to stop listening after a delay
//         // Adjust the delay based on your requirements (e.g., 3 seconds)

//         if(timeoutCounter < 3){
//           setTimeout(() => {
//             stop();
//             console.log("in 1 counter")
//             // Trigger the click event after stopping listening
//             handleAudioSubmit()
//           }, 5000);
//         }
//          if(timeoutCounter >= 3){
//           setTimeout(() => {
//             stop();
//             console.log("in 2 counter")

//             // Trigger the click event after stopping listening
//             document.getElementById("cursor-pointer-3")?.click();
//           }, 10000);
//         }

       
     

//           // const SpeechRecognition =
//           //   window.SpeechRecognition || window.webkitSpeechRecognition;
//           // const recognition = new SpeechRecognition();
//           // let silenceTimeout: number | null = null;

          

//           // recognition.onstart = () => {
//           //   setIsListening(true);
//           // };

//           // recognition.onresult = (event: any) => {
//           //   const transcript = event.results[0][0].transcript;
//           //     setTextValue(transcript);
//           //   setIsRepeating(false);
//           //   setRepeatCounter(0)
          
         
      
//           //   // Clear the previous silence timeout if the user speaks again
//           //   if (silenceTimeout) {
//           //     clearTimeout(silenceTimeout);
//           //     silenceTimeout = null;
//           //   }

//           //   // Set a new timeout to detect 1 second of silence
//           //   silenceTimeout = window.setTimeout(() => {
//           //     recognition.stop();
//           //   }, 1000);
//           // };

//           // recognition.onend = () => {
//           //   setIsListening(false);
//           //   if (silenceTimeout) {
//           //     clearTimeout(silenceTimeout);
//           //     silenceTimeout = null;
//           //   }
          
            
            

//           //   // Automatically stop recording and submit the audio after 1 second of silence
//           //   if (AllRoomData?.audioFile.isStartRec === "Yes") {
//           //     //@ts-ignore
//           //     document.getElementById("cursor-pointer-3").click();
//           //   }
//           // };

//           // recognition.onerror = () => {
//           //   setIsListening(false);
//           //   setIsRepeating(true);
//           //   setTextValue("");
//           //   setRepeatCounter((prev) => prev + 1);

//           //   if (silenceTimeout) {
//           //     clearTimeout(silenceTimeout);
//           //     silenceTimeout = null;
//           //   }
//           // };

//           // if (!isListening) {
//           //   recognition.start();
//           // } else {
//           //   recognition.stop();
//           // }
//         }

//         if (AllRoomData?.audioFile.isStartRec === "No") {
//           setShowplaying(true);
//           handleAudioSubmit();
//           console.log("no record repeat api")
//           setShowCounter(false);
//         } else if (AllRoomData?.audioFile.isStartRec === "End") {
//           setShowplaying(true);
//           setTimeout(() => {
//             setShowWaiting(true);
//             setShowplaying(false);
//           }, 2000);

//           setTimeout(() => {
//             setShowBtn(true);
//             setShowWaiting(false);
//             setShowplaying(false);
//           }, 3000);
//         }
//       };
    
//     }
//   }

//   useEffect(() => {
//     handleSpeechToText()
   
//   }, [AllRoomData]);

//   const handleCopyLink = (downloadLinks: string | undefined) => {
//     if (downloadLinks) {
//       navigator.clipboard
//         .writeText(downloadLinks)
//         .then(() => {
//           setCopiedTooltipOpen(true);
//           setTimeout(() => setCopiedTooltipOpen(false), 2000); // Hide tooltip after 2 seconds
//         })
//         .catch((err) => {
//           console.error("Failed to copy the download link: ", err);
//         });
//     } else {
//       console.log("No download link available");
//     }
//   };

//   // handle generate link function
//   const handleGenerateLink = async () => {
//     if (!getRoomId) return;

//     setIsGenerating(true);
//     try {
//       const response = await DataService.post("/speech-to-text", {
//         roomId: getRoomId
//       });
//       setDownloadLink(response.data.downloadLinks); // Adjust based on your endpoint response
//     } catch (error) {
//       console.error("Error generating download link:", error);
//     }
//   };

//   // handle download function
//   const handleDownload = async () => {
//     if (!getRoomId) return;

//     try {
//       const response = await DataService.get(
//         `/document-download?roomId=${getRoomId}`,
//         {
//           responseType: "blob"
//         }
//       );

//       // Create a URL for the blob
//       const url = window.URL.createObjectURL(new Blob([response.data]));

//       // Create a temporary link element
//       const link = document.createElement("a");
//       link.href = url;

//       // You can set the download attribute to specify the file name
//       link.setAttribute("download", "voicechat.docx");

//       // Append the link to the body (it needs to be in the DOM for the click to work)
//       document.body.appendChild(link);

//       // Programmatically click the link to trigger the download
//       link.click();

//       // Cleanup: Remove the link and revoke the object URL
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error downloading file:", error);
//     }
//   };

//   // handle audio file download
//   const handleAudio = async () => {
//     if (!getRoomId) return;

//     try {
//       const response = await DataService.get(
//         `/download-audio?roomId=${getRoomId}`,
//         {
//           responseType: "blob"
//         }
//       );

//       // Create a URL for the blob
//       const url = window.URL.createObjectURL(new Blob([response.data]));

//       // Create a temporary link element
//       const link = document.createElement("a");
//       link.href = url;

//       // You can set the download attribute to specify the file name
//       link.setAttribute("download", "audio.mp3");

//       // Append the link to the body (it needs to be in the DOM for the click to work)
//       document.body.appendChild(link);

//       // Programmatically click the link to trigger the download
//       link.click();

//       // Cleanup: Remove the link and revoke the object URL
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error downloading file:", error);
//     }
//   };

//   return (
//     <>
//       <Index.Box className="position-relative">
//         <Index.Box className="voice-bot-bgcontain">
//           <Index.Box className="voicebot-bg">
//             <Index.Box className="voicebot-space">
//               <Index.Box className="voicebot-max-card">
//                 <Index.Box className="voice-bot-card">
//                   <Index.Box className="voicebot-card-body">
//                     <Index.Box className="voicebot-img-contain">
//                       <img
//                         src={PagesIndex.Png.VoiceOne}
//                         alt="VoiceOne"
//                         className="voice-one"
//                       />
//                     </Index.Box>
//                     {openChatModal ? (
//                       <>
//                         <Index.Box className="chat-voices-body-flex">
//                           <Index.Box className="chat-voice-inner-body">
//                             {showWaiting && (
//                               <Index.Box className="loader-center">
//                                 <Index.Box className="loader-dots"></Index.Box>
//                               </Index.Box>
//                             )}

//                             {showPlaying && (
//                               <Index.Box
//                                 className="common-chat-voice-show"
//                                 id="playing-animation"
//                               >
//                                 <Index.Box className="playing">
//                                   <span className="playing__bar playing__bar1"></span>
//                                   <span className="playing__bar playing__bar2"></span>
//                                   <span className="playing__bar playing__bar3"></span>
//                                 </Index.Box>
//                               </Index.Box>
//                             )}

//                             {showCounter && (
//                               <Index.Box
//                                 className="common-chat-voice-show"
//                                 id="counter-animation"
//                               >
//                                 <Index.Box className="timer animatable">
//                                   <Index.Box className="user-speaking">
//                                     <div id="bars">
//                                       <div className="bar"></div>
//                                       <div className="bar"></div>
//                                       <div className="bar"></div>
//                                       <div className="bar"></div>
//                                       <div className="bar"></div>
//                                       <div className="bar"></div>
//                                       <div className="bar"></div>
//                                       <div className="bar"></div>
//                                       <div className="bar"></div>
//                                       <div className="bar"></div>
//                                     </div>
//                                   </Index.Box>
//                                 </Index.Box>
//                               </Index.Box>
//                             )}

//                             {showBtn && (
//                               <Index.Box className="common-chat-voice-show">
//                                 <Index.Box className="">
//                                   <h1 className="thankyou-text">Thank You!</h1>
//                                   <div className="downlond-btn">
//                                     {!isGenerating && (
//                                       <button
//                                         onClick={handleGenerateLink}
//                                         disabled={isGenerating}
//                                         className="generate-btn"
//                                       >
//                                         End Session
//                                       </button>
//                                     )}
//                                     {isGenerating && (
//                                       <Index.Box className="downlond-btn-flex">
//                                         <button
//                                           onClick={handleDownload}
//                                           className="generate-btn"
//                                         >
//                                           Download Text
//                                         </button>
//                                         <Tooltip
//                                           title={
//                                             copiedTooltipOpen
//                                               ? "Copied!"
//                                               : "Copy Link"
//                                           }
//                                           arrow
//                                         >
//                                           <ContentCopyIcon
//                                             onClick={() =>
//                                               handleCopyLink(
//                                                 downloadLink?.documentFile
//                                               )
//                                             }
//                                           />
//                                         </Tooltip>
//                                       </Index.Box>
//                                     )}

//                                     {isGenerating && (
//                                       <Index.Box className="downlond-btn-flex">
//                                         <button
//                                           onClick={handleAudio}
//                                           className="generate-btn"
//                                         >
//                                           Download Audio
//                                         </button>
//                                         <Tooltip
//                                           title={
//                                             copiedTooltipOpen
//                                               ? "Copied!"
//                                               : "Copy Link"
//                                           }
//                                           arrow
//                                         >
//                                           <ContentCopyIcon
//                                             onClick={() =>
//                                               handleCopyLink(
//                                                 downloadLink?.audioFile
//                                               )
//                                             }
//                                           />
//                                         </Tooltip>
//                                       </Index.Box>
//                                     )}
//                                     <button
//                                       onClick={handleOpenChat}
//                                       className="generate-btn"
//                                     >
//                                       Start New Session
//                                     </button>
//                                   </div>
//                                 </Index.Box>
//                               </Index.Box>
//                             )}
//                           </Index.Box>
//                         </Index.Box>
// {/* 
//                         <Index.Box className="chat-voice-footer">
//                           <Index.Box className="audio-record-bg-footer">
//                             {!recorderControls.isRecording ? (
//                               <button
//                                 type="button"
//                                 id="cursor-pointer-2"
//                                 disabled={isSending}
//                                 onClick={recorderControls.startRecording}
//                                 className={`${
//                                   isSending ? "cursor-wait" : "cursor-pointer"
//                                 }`}
//                               >
//                                 <Mic color="#ffffff" size={25} />
//                               </button>
//                             ) : (
//                               <>
//                               <button
//                                 type="button"
//                                 id="cursor-pointer-3"
//                                 className="cursor-pointer"
//                                 onClick={recorderControls.stopRecording}
//                               >
//                                 <CircleStop color="#ff0000" size={25} />
//                               </button>
                                
//                                  <button style={{marginLeft:'20px'}}  onClick={() => speak({ text: textValue })}>Speak</button>
//                                  </>
//                             )}
//                           </Index.Box>
//                         </Index.Box>

//                         <Index.Box className="audio-recorder-hidden">
//                           <AudioRecorder
//                             onRecordingComplete={handleAudioBlob}
//                             recorderControls={recorderControls}
//                             downloadFileExtension="mp3"
//                           />
//                         </Index.Box> */}
//                       </>
//                     ) : (
//                       <Index.Box className="voice-contain-bots">
//                         <Index.Typography className="title-voices-say">
//                           Hi <span>Lorem Ipsum</span>,
//                         </Index.Typography>
//                         <Index.Typography className="title-voices-head">
//                           Welcome to the Voicebot Story Bot! Share your story
//                           and get a written keepsake in your Voicebot Storybook.
//                         </Index.Typography>
//                         <Index.Box className="common-primary-main">
//                           <PagesIndex.Button
//                             className="btn-primary"
//                             // onClick={handleOpenInterview}
//                             onClick={handleOpenChat}
//                           >
//                             Start
//                           </PagesIndex.Button>
//                         </Index.Box>
//                       </Index.Box>
//                     )}
//                   </Index.Box>
//                 </Index.Box>
//               </Index.Box>
//             </Index.Box>
//           </Index.Box>
//         </Index.Box>

//         {/* custom popup start */}

//         {isPopupVisible && (
//           <Index.Box className="custom-modal-bg-main">
//             <Index.Box className="custom-modal-card">
//               <Index.Box className="custom-modal-body">
//                 <Index.Box className="custom-modal-details">
//                   <Index.Typography className="custom-title-popup">
//                     Voicebot wants to access your microphone
//                   </Index.Typography>
//                   <Index.Box className="custom-flex-modal">
//                     <Index.Box className="custom-btn-max">
//                       <PagesIndex.Button
//                         className="btn-secondary"
//                         onClick={() => setIsPopupVisible(false)}
//                       >
//                         Block
//                       </PagesIndex.Button>
//                     </Index.Box>
//                     <Index.Box className="custom-btn-max">
//                       <PagesIndex.Button
//                         className="btn-primary"
//                         onClick={handleAllow}
//                       >
//                         Allow
//                       </PagesIndex.Button>
//                     </Index.Box>
//                   </Index.Box>
//                 </Index.Box>
//               </Index.Box>
//             </Index.Box>
//           </Index.Box>
//         )}

//         {/* custom popup end */}
//       </Index.Box>

//       {/* interview-end start */}
//       <Index.Modal
//         open={open}
//         onClose={handleCloseInterview}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         className="voice-bot-common-modal"
//       >
//         <Index.Box
//           sx={style}
//           className="voice-bot-common-style interview-max-modal"
//         >
//           <Index.Box className="common-modal-close">
//             <PagesIndex.Button className="btn-close-modal">
//               <img
//                 src={PagesIndex.Svg.CancelRound}
//                 alt="CancelRound"
//                 className="cancel-round-icon"
//               />
//             </PagesIndex.Button>
//           </Index.Box>
//           <Index.Box className="modal-common-listing">
//             <Index.Box className="interview-head">
//               <Index.Typography className="interview-title">
//                 Are you sure you want to end interview?
//               </Index.Typography>
//             </Index.Box>
//             <Index.Box className="interview-modal-btn">
//               <Index.Box className="custom-flex-modal">
//                 <Index.Box className="custom-btn-max">
//                   <PagesIndex.Button className="btn-secondary">
//                     No, cancel
//                   </PagesIndex.Button>
//                 </Index.Box>
//                 <Index.Box className="custom-btn-max">
//                   <PagesIndex.Button
//                     className="btn-primary"
//                     onClick={handleCloseInterview}
//                   >
//                     Yes, Confirm
//                   </PagesIndex.Button>
//                 </Index.Box>
//               </Index.Box>
//             </Index.Box>
//           </Index.Box>
//         </Index.Box>
//       </Index.Modal>
//       {/* interview-end end */}
//       {/* session-end start */}
//       <Index.Modal
//         open={openSession}
//         onClose={handleCloseSession}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         className="voice-bot-common-modal sesstion-end-modal"
//       >
//         <Index.Box sx={style} className="voice-bot-common-style">
//           <Index.Box className="common-modal-close">
//             <PagesIndex.Button className="btn-close-modal">
//               <img
//                 src={PagesIndex.Svg.CancelRound}
//                 alt="CancelRound"
//                 className="cancel-round-icon"
//               />
//             </PagesIndex.Button>
//           </Index.Box>
//           <Index.Box className="modal-common-listing session-end-main">
//             <Index.Box className="interview-head">
//               <Index.Typography className="interview-title">
//                 Session Ended
//               </Index.Typography>
//               <Index.Typography className="session-end-desc">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor incididunt ut
//               </Index.Typography>
//             </Index.Box>
//             <Index.Box className="interview-modal-btn">
//               <Index.Box className="custom-flex-modal">
//                 <Index.Box className="custom-btn-max">
//                   <PagesIndex.Button
//                     className="btn-primary"
//                     onClick={handleOpenSessionComplete}
//                   >
//                     Next{" "}
//                     <img
//                       src={PagesIndex.Svg.RightArrow}
//                       alt="RightArrow"
//                       className="next-icon"
//                     />
//                   </PagesIndex.Button>
//                 </Index.Box>
//               </Index.Box>
//             </Index.Box>
//           </Index.Box>
//         </Index.Box>
//       </Index.Modal>
//       {/* session-end end */}

//       {/* session-complete start */}
//       <Index.Modal
//         open={openSessionComplete}
//         onClose={handleCloseSessionComplete}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         className="voice-bot-common-modal sesstion-complete-modal"
//       >
//         <Index.Box sx={style} className="voice-bot-common-style">
//           <Index.Box className="modal-common-listing session-complete-main">
//             <Index.Box className="interview-head">
//               <Index.Typography className="interview-title">
//                 Session Complete!
//               </Index.Typography>
//               <Index.Typography className="thankyou-title">
//                 Thank You!
//               </Index.Typography>
//               <Index.Typography className="session-end-desc">
//                 Your story has been recorded. A written account of your story
//                 will be available in your Voicebot storybook.
//               </Index.Typography>
//             </Index.Box>
//             <Index.Box className="interview-modal-btn">
//               <Index.Box className="custom-flex-modal">
//                 <Index.Box className="common-primary-main max-record-contain">
//                   <PagesIndex.Button
//                     className="btn-primary"
//                     onClick={handleCloseSessionComplete}
//                   >
//                     <img
//                       src={PagesIndex.Svg.Plus}
//                       alt="Plus"
//                       className="plus-icon"
//                     />{" "}
//                     Record Another Story
//                   </PagesIndex.Button>
//                 </Index.Box>
//               </Index.Box>
//             </Index.Box>
//           </Index.Box>
//         </Index.Box>
//       </Index.Modal>
//       {/* session-complete end */}
//     </>
//   );
// };

// export default VoiceBots;
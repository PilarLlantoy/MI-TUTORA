/* eslint-disable */
import { Button, Grid, IconButton, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { Videocam, VideocamOff, Mic, MicOff, ScreenShare, StopScreenShare, Call, CallEnd, HourglassBottom, HourglassEmpty, HourglassFull, 
  HourglassTop } from "@mui/icons-material";
import Carousel from "react-elastic-carousel";
import useAuth from 'src/hooks/useAuth';
import certifyAxios from 'src/utils/aimAxios';
import Chat from "src/content/chat/Chat";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import GroupIcon from '@mui/icons-material/Group';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import "./video.css"

//85 vh total
const videoHeight = "53vh"
const videoFullHeight = "73vh"
const camarasHeight = "20vh"
const socket = io.connect(process.env.REACT_APP_VIDEO_SERVER);

const UserVideo = ({ stream, peerId, handleOnClick, name, hideCameras }) => {
  const userVideo = useRef();

  useEffect(() => {
    userVideo.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={hideCameras? "wrapper-hidden" : "wrapper"}>
      <Tooltip title="Pinear miembro" followCursor sx={{backgroundColor: "white"}}>
        <video
          playsInline
          ref={userVideo}
          autoPlay
          onClick={() => handleOnClick(peerId)}
        />
      </Tooltip>
      <div>
          <h3>{name} (yo)</h3>
      </div>
    </div>
  );
};

const Clock =() =>{
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hourGlass, setHourGlass] = useState(0);

  const deadline = Date.now();

  const getTime = () => {
    const time = Date.now() - deadline;

    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
    setHourGlass((hourGlass) => (hourGlass+1)%4 );
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);


  return (
  <Grid container>
      <Grid item md={12} xs={8} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
        { hourGlass == 0? <HourglassBottom sx={{ fontSize: 12 }}/> : hourGlass == 1? <HourglassEmpty sx={{ fontSize: 12 }}/> : hourGlass == 2? <HourglassTop sx={{ fontSize: 12 }}/> : <HourglassFull sx={{ fontSize: 12 }}/> }
        <span>
          {hours < 10 ? "0" + hours : hours}:{minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}
        </span>
      </Grid>
    </Grid>
  );
}

const PseudoClock =() =>{

  return (
  <Grid container>
      <Grid item md={12} xs={8} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
        <HourglassEmpty  sx={{ fontSize: 12 }}/>
        <span>00:00:00</span>
      </Grid>
    </Grid>
  );
}

const MainVideo = ({ stream, hideCameras }) => {
  const video = useRef();

  useEffect(() => {
    video.current.srcObject = stream;
  }, [stream]);

  const handleOnClick = () => {
    var el = document.getElementById("full-screenVideo");
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  };

  return (
    <video
      playsInline
      muted
      ref={video}
      autoPlay
      style={{
        width: "98%",
        marginLeft:"10px",
        marginRight:"10px",
        borderRadius: "10px",
        display: "block",
        height: hideCameras? videoFullHeight: videoHeight,
        objectFit:"contain"
      }}
      id="full-screenVideo"
      onClick={handleOnClick}
    />
  );
};
// const CAMARA = 'camara';
// const PANTALLA = 'pantalla';
// const ESTUDIANTE = 'estudiante'

// const videoDataHandler = (event,tipo) => {
//   let reader = new FileReader();
//   reader.readAsArrayBuffer(event.data);
//   reader.onloadend = () => {
//     socket.emit(tipo, reader.result);    
//   };
// };

// const uploadVideo = () => {
//   socket.emit("crearVideo");
// }

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 4 },
];


const Room = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState();
  const [me, setMe] = useState("");
  const [users, setUsers] = useState([]);
  const [stream, setStream] = useState();
  const [devices, setDevices] = useState({ video: true, audio: true });
  const [sharing, setSharing] = useState(false);
  const [screenStream, setScreenStream] = useState();
  const [hideChat, setHideChat] = useState(false);
  const [hideCameras, setHideCameras] = useState(false);
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const myVideo = useRef();
  const [joinedMeeting, setJoinedMeeting] = useState(false);
  const [userStream, setUserStream] = useState([]);
  const [userShareScreen, setUserShareScreen] = useState();
  const [mainStream, setMainStream] = useState();
  const peerIdMainStream = useRef();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [startMeetingClock, setStartMeetingClock] = useState(false);
  // const meRef = useRef();
  // const recordingRef = useRef(false);
  // const recorderRef = useRef();
  // const pantallaRecorderRef = useRef();
  // const estudianteRecorderRef = useRef();
  // const myStreamRef = useRef();
  // const userStreamRef = useRef([]);

  const handleChangeHideChat = () => {
    setHideChat(!hideChat)
  }

  const handleChangeHideCamaras = () => {
    setHideCameras(!hideCameras)
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(devices).then((stream) => {
      setStream(stream);
      setMainStream(stream);
      if(myVideo && myVideo.current){
        myVideo.current.srcObject = stream;
      }
      // myStreamRef.current = stream;
    });

    socket.on("me", (id) => {
      setMe(id);
      // meRef.current = id
    });
    
    socket.on("timeout", (data) => {

      const pathname = window.location.pathname;
      if (pathname.split("/")[2] === 'associated'){
        navigate('/aim/associated/classes');
      }else{
        navigate(`/aim/student/temp/${pathname.split("/")[5]}`);
      }
    });

    return () => {
      socket.off("me");
      socket.off("getParticipants");
      socket.off("newUser");
      socket.off("callUser");
      socket.off("callAccepted");
      socket.off("responseToShareScreen");
      socket.off("userShareScreen");
      socket.off("userEndShareScreen");
      setStream();
      // myStreamRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    socket.on("userShareScreen", (data) => {
      let { user } = data;
      let userStreamObj = userStream.find(({ peerId }) => peerId == user);
      if (userStreamObj != undefined) {
        setUserShareScreen(user);
        // if(recordingRef.current){
        //   recorderRef.current.stop();
        //   let options = { mimeType: 'video/webm'};
        //   let newStream = userStreamObj.stream.clone();
        //   newStream.addTrack(stream.getAudioTracks()[0]);
        //   let mediaRecorder = new MediaRecorder(newStream, options);
        //   mediaRecorder.ondataavailable = (event) => {videoDataHandler(event,ESTUDIANTE)};
        //   mediaRecorder.onstop = uploadVideo;
        //   estudianteRecorderRef.current = mediaRecorder;
        //   socket.emit("initEstudiante",{roomId: roomId});
        //   mediaRecorder.start(1000);
        // }
      }
    });

    return () => {
      socket.off("userShareScreen");
    };
  }, [userStream]);

  const handleOnClickJoinMeeting = () => {

    setStartMeetingClock(true);

    socket.off("getParticipants");
    socket.off("newUser");
    socket.off("callUser");
    socket.off("callAccepted");
    socket.off("callEnd");
    socket.off("responseToShareScreen");
    socket.off("userShareScreen");
    socket.off("userEndShareScreen");

    socket.on("getParticipants", (data) => {
      let { participants, message } = data;
      const peers = [];
      const pathname = window.location.pathname;
      // if (pathname.split("/")[2] === 'associated'){
      //   recordingRef.current = true;
      //   let options = { mimeType: 'video/webm'};      
      //   let mediaRecorder = new MediaRecorder(myStreamRef.current.clone(), options);
      //   mediaRecorder.ondataavailable = (event) => {videoDataHandler(event,CAMARA)};
      //   mediaRecorder.onstop = uploadVideo;
      //   recorderRef.current = mediaRecorder;
      //   socket.emit("initCamara",{roomId: roomId});
      //   mediaRecorder.start(1000);
      // }
      participants.forEach(async (participant) => {
        callUser(participant);
      });

      setMessage(message);
      setUsers([...participants]);
    });

    socket.on("newUser", (data) => {
      setUsers((users) => [...users, data.id]);
    });

    socket.on("callUser", (data) => {
      answerCall(data.from, data.signal, data.name);
    });

    socket.on("callAccepted", (data) => {
      let { signal, from, name } = data;
      try {
        let item = peersRef.current.find((p) => p.peerId === from);
        item.name = name;
        item.peer.signal(signal);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("callEnd", (data) => {
      setUserStream((userStream) =>
        userStream.filter(({ peerId }) => data.from !== peerId)
      );
      // userStreamRef.current = userStreamRef.current.filter(({ peerId }) => data.from !== peerId)
      peersRef.current = peersRef.current.filter(
        ({ peerId }) => data.from !== peerId
      );

      if (data.from == peerIdMainStream.current) {
        setMainStream(stream);
        peerIdMainStream.current = undefined;
      }
    });

    socket.on("userEndShareScreen", (data) => {
      setUserShareScreen(undefined);
      // if(recordingRef.current){
      //   estudianteRecorderRef.current.stop();
      //   let options = { mimeType: 'video/webm'};
      //   let mediaRecorder = new MediaRecorder(myStreamRef.current.clone(), options);
      //   mediaRecorder.ondataavailable = (event) => {videoDataHandler(event,CAMARA)};
      //   mediaRecorder.onstop = uploadVideo;
      //   recorderRef.current = mediaRecorder;
      //   socket.emit("initCamara",{roomId: roomId});
      //   mediaRecorder.start(1000);   
      // }
    });

    socket.on("getParticipants", (data) => {
      if (data.message != "ok"){
        const pathname = window.location.pathname;
        if (pathname.split("/")[2] === 'associated'){
          navigate('/aim/associated/classes');
        }else{
          navigate(`/aim/student/temp/${pathname.split("/")[5]}`);
        }
      }
    });

    socket.emit("joinRoom", { from: socket.id, roomId: roomId });
    setJoinedMeeting(true);
  };

  const handleOnClickExitMeeting = () => {
    socket.emit("callEnd", { from: socket.id });
    for (const obj of peersRef.current) {
      try {
        obj.peer.destroy();
      } catch (error) {
        console.log(error);
      }
    }
    // Clear
    peersRef.current = [];
    setUserStream([]);
    // userStreamRef.current = []
    setPeers([]);
    setJoinedMeeting(false);
    setMainStream(stream);
    peerIdMainStream.current = undefined;
    // if(recordingRef.current){
    //   recorderRef.current.stop();
    //   socket.emit("finalizar",{roomId: roomId});
    //   recordingRef.current = false;
    // }
  };

  const handleOnClickCamera = async () => {
    let stateCamera = !devices.video;
    stream.getVideoTracks().forEach(async (track) => {
      track.enabled = devices.video ? false : true;
    });
    setStream(stream);
    // myStreamRef.current = stream;
    setDevices((devices) => {
      return { ...devices, video: stateCamera };
    });
  };

  const handleOnClickMic = async () => {
    let stateMic = !devices.audio;
    stream.getAudioTracks().forEach(async (track) => {
      track.enabled = devices.audio ? false : true;
    });
    setStream(stream);
    // myStreamRef.current = stream;
    setDevices((devices) => {
      return { ...devices, audio: stateMic };
    });
  };

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
      },
    });

    // 4. SE EMITE LA SEÑAL
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: socket.id,
        name: user.person.fullName,
      });
    });

    peer.on("stream", (stream) => {
      let item = peersRef.current.find((peerObj) => peerObj.peerId == id);
      let name = item != undefined ? item.name : "";
      setUserStream((userStream) => [...userStream, { peerId: id, stream, name }]);
      // userStreamRef.current = [...userStreamRef.current, { peerId: id, stream }]
    });

    peersRef.current.push({ peerId: id, peer });
    setPeers((peers) => [...peers, peer]);

    // return peer;
  };

  const answerCall = (id, signal, name) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
      },
    });

    // 7. EMITIR EVENTO
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: id, from: socket.id, name: user.person.fullName });
    });

    peer.on("stream", (stream) => {
      setUserStream((userStream) => [...userStream, { peerId: id, stream, name: name }]);
      // userStreamRef.current = [...userStreamRef.current, { peerId: id, stream }]
    });

    // 7. EMITIR EVENTO
    peer.signal(signal);

    peersRef.current.push({ peerId: id, peer, name: name });
    setPeers((peers) => [...peers, peer]);
  };

  const switchStream = (screenShareStream) => {
    setSharing(true);
    peersRef.current.forEach(({ peer }) => {
      peer.replaceTrack(
        stream.getVideoTracks()[0],
        screenShareStream.getVideoTracks()[0],
        stream
      );
    });
  };

  const shareScreen = () => {
    if (!sharing) {
      socket.off("responseToShareScreen");

      socket.on("responseToShareScreen", (data) => {
        let { from, message } = data;
        if (message === "OK") {
          // alert(`Message from server: ${message}`);
          navigator.mediaDevices
            .getDisplayMedia({ video: true, audio: true })
            .then((screenShareStream) => {
              screenShareStream.oninactive = () => {
                // if(recordingRef.current){
                //   pantallaRecorderRef.current.stop();
                //   let options = { mimeType: 'video/webm'};
                //   let mediaRecorder = new MediaRecorder(myStreamRef.current.clone(), options);
                //   mediaRecorder.ondataavailable = (event) => {videoDataHandler(event,CAMARA)};
                //   mediaRecorder.onstop = uploadVideo;
                //   recorderRef.current = mediaRecorder;
                //   socket.emit("initCamara",{roomId: roomId});
                //   mediaRecorder.start(1000);              
                // }

                // Emitir evento "endShareScreen"
                socket.emit("endShareScreen", { from: socket.id });
                peersRef.current.forEach(({ peer }) => {
                  peer.replaceTrack(
                    stream.getVideoTracks()[0],
                    myVideo.current.srcObject.getVideoTracks()[0],
                    stream
                  );
                });
                setSharing(false);
                setScreenStream(null);
              };
              setScreenStream(screenShareStream);
              // if(recordingRef.current){
              //   recorderRef.current.stop();
              //   let options = { mimeType: 'video/webm'};
              //   screenShareStream.addTrack(stream.getAudioTracks()[0])
              //   let mediaRecorder = new MediaRecorder(screenShareStream.clone(), options);
              //   mediaRecorder.ondataavailable = (event) => {videoDataHandler(event,PANTALLA)};
              //   mediaRecorder.onstop = uploadVideo
              //   pantallaRecorderRef.current = mediaRecorder
              //   socket.emit("initPantalla",{roomId: roomId});
              //   mediaRecorder.start(1000);
              // }
              switchStream(screenShareStream);
            });
        }
      });

      // Emit 'requestToShareScreen' event
      socket.emit("requestToShareScreen", { from: socket.id });

      /* navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true }).then((screenShareStream) => {
          screenShareStream.oninactive = () => {
            peersRef.current.forEach(({ peer }) => {
              peer.replaceTrack(stream.getVideoTracks()[0], myVideo.current.srcObject.getVideoTracks()[0], stream);
            });
            setSharing(false);
            setScreenStream(null);
          }
          setScreenStream(screenShareStream);
          switchStream(screenShareStream);
        }); */
    } else {
      //TEST
      // if(recordingRef.current){
      //   pantallaRecorderRef.current.stop();
      //   let options = { mimeType: 'video/webm'};
      //   let mediaRecorder = new MediaRecorder(myStreamRef.current.clone(), options);
      //   mediaRecorder.ondataavailable = (event) => {videoDataHandler(event,CAMARA)};
      //   mediaRecorder.onstop = uploadVideo;
      //   recorderRef.current = mediaRecorder;
      //   socket.emit("initCamara",{roomId: roomId});
      //   mediaRecorder.start(1000);              
      // }
      //
      
      // Emitir evento "endShareScreen"
      socket.emit("endShareScreen", { from: socket.id });
      screenStream.getTracks().forEach(async (track) => track.stop());
      peersRef.current.forEach(({ peer }) => {
        peer.replaceTrack(
          stream.getVideoTracks()[0],
          myVideo.current.srcObject.getVideoTracks()[0],
          stream
        );
      });
      setSharing(false);
      setScreenStream(null);
    }
  };

  const switchMainVideo = (peerId) => {
    console.log("Onclick ok")
    if (peerId == undefined) {
      setMainStream(stream);
      peerIdMainStream.current = undefined;
    } else {
      let peerObj = userStream.find((obj) => obj.peerId === peerId);
      if (peerObj != undefined) {
        setMainStream(peerObj.stream);
        peerIdMainStream.current = peerObj.peerId;
      }
    }
  };

  const cerrarSesion = () => {
    const pathname = window.location.pathname;

    let reqObj = {
      "reservationId": pathname.split("/")[5],
      "personId" : user.person.id
    };

    certifyAxios.post('reservationRequest/endClass', reqObj)
            .then(
                (response) => {
                  if(response.status == 200){
                    if (pathname.split("/")[2] === 'associated'){
                      navigate('/aim/associated/classes');
                    }else{
                      navigate(`/aim/student/temp/${pathname.split("/")[5]}`);
                    }
                  }
                }
            )
    
  };

  return (
    <>
    <div
      style={{
        paddingLeft: "15px",
        paddingTop: "15px"
      }}
      >
      <Grid container>
        <Grid item xs={12} sm={hideChat? 11.5 : 8} md={hideChat? 11.5 : 8}>
          {/* Video principal */}
          <Grid
              item
              md={12}
              sm={12}
              xs={12}
              sx={{
                textAlign: "center",
                background: "#282828",
                color: "white"
              }}
            >
              
              <Grid item  md={12}  xs={12} style={{
                display : "flex",
                columns : true,
                color: "white",
                py:"8px"
              }}>
                <Grid item  md={8}  xs={12} >
                  <span>Transmitiendo {stream ? " prendido" : " apagado"}</span>
                </Grid>
                <Grid item  md={4}  xs={12} >
                  <span>
                    {startMeetingClock ? <Clock /> : <PseudoClock />}
                  </span>
                </Grid>
              </Grid>
              <div style={{display: "flex", justifyContent:"center"}}>
                <MainVideo stream={mainStream} hideCameras={hideCameras}/>
              </div>
          </Grid>
          {/* Camaras */}
          <Grid
              item
              md={12}
              sm={12}
              xs={12}
              sx={{
                textAlign: "center",
                background: "#282828",
                color: "white",
                px: "10px"
              }}
              >
              {/* Me */}
              <div style={{height: hideCameras? "4px":camarasHeight, position:"relative"}}>
                <div className="icono-camaras">
                  <Tooltip title={hideChat? "Mostrar Miembros" : "Ocultar Miembros"} sx={{backgroundColor: "white"}} placement="top-start">
                    <IconButton onClick={handleChangeHideCamaras} color="white" sx={{borderRadius:"20px"}}>
                      {hideCameras? 
                        <KeyboardArrowUpIcon sx={{fontSize:18}}/>
                        :<KeyboardArrowDownIcon sx={{fontSize:18}}/>
                      }
                      <GroupIcon sx={{fontSize:20}}/>
                    </IconButton>
                  </Tooltip> 
                </div> 
                <Carousel breakPoints={breakPoints} pagination={false}>
                  <div className={hideCameras? "wrapper-hidden" : "wrapper"}>
                    <Tooltip title="Pinear miembro" followCursor sx={{backgroundColor: "white"}}>
                      <video
                        playsInline
                        ref={myVideo}
                        autoPlay
                        muted
                        onClick={() => switchMainVideo()}
                        />
                    </Tooltip>
                      <div>
                          <h3 style={{color:"white"}}>{user.person.fullName} (yo)</h3>
                      </div>
                  </div>
                  {userStream.map(({ peerId, stream, name }) => (
                    <UserVideo
                    stream={stream}
                    key={`user-video-stream-${peerId}`}
                    handleOnClick={switchMainVideo}
                    peerId={peerId}
                    name={name}
                    hideCameras={hideCameras}
                    />
                    ))}
                </Carousel>
              </div>
              <Grid item md={12} sm={12} xs={12} style={{ display:"flex", justifyContent:"center", paddingBottom:"5px" }}>
                <Grid item md={hideChat? 5: 7} sm={hideChat? 7 : 10} xs={12} style={{ backgroundColor: "rgba(254,114,1)", borderRadius: "30px"}}>
                  <Grid container spacing={3} display="flex" justifyContent="center">
                    <Grid item style={{ textAlign: "center" }}>
                      <IconButton onClick={handleOnClickCamera}>
                        {devices.video ? <Videocam /> : <VideocamOff />}
                      </IconButton>
                    </Grid>
                    <Grid item style={{ textAlign: "center" }}>
                      <IconButton onClick={handleOnClickMic}>
                        {devices.audio ? <Mic /> : <MicOff />}
                      </IconButton>
                    </Grid>
                    <Grid item style={{ textAlign: "center" }}>
                      <IconButton
                        onClick={shareScreen}
                        disabled={!joinedMeeting || userShareScreen != undefined}
                        >
                        {!sharing ? <ScreenShare /> : <StopScreenShare />}
                      </IconButton>
                    </Grid>
                    <Grid item style={{ textAlign: "center" }}>
                      <Tooltip title={hideChat? "Mostrar Chat" : "Ocultar Chat"} sx={{backgroundColor: "white"}}>
                        <IconButton onClick={handleChangeHideChat}>
                          <ChatBubbleIcon />
                        </IconButton>
                      </Tooltip> 
                    </Grid>
                    <Grid item style={{ textAlign: "center" }}>
                      {!joinedMeeting ? (
                        <IconButton onClick={handleOnClickJoinMeeting}>
                          <Call />
                        </IconButton>
                      ) : (
                        <IconButton onClick={handleOnClickExitMeeting}>
                          <CallEnd />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
          </Grid>
        </Grid>
        { !hideChat && <Grid item xs={12} sm={3.5} md={3.5} sx={{overflowX: "auto"}}>
          <div style={{height: joinedMeeting?"8%":"0%", display:"flex", justifyContent:"center"}}>
            {joinedMeeting ? (
              <Button variant="contained" size="small" onClick={() => cerrarSesion()} style={{ margin: "10px" }}>Cerrar Sesión</Button>
            ) : (
              null
            )}
          </div>
          <div style={{height: joinedMeeting?"90%":"100%"}}>
            <Chat hideChatList={true} chatvideo={true} forceChattingWith={25} forceChatId={3}/>
          </div>
        </Grid>}
      </Grid>
      {/* <Grid
        container
        style={{
          position: "fixed",
          bottom: "20px",
          width: "100%",
        }}
        >
        <Grid container xs={8}>
        <Grid item md={2} sm={2}></Grid>
        <Grid item md={4} sm={8}>
        <div
        style={{
          borderRadius: "30px",
          backgroundColor: "rgba(254,114,1)",
          boxShadow: "2px 4px rgb(60, 60, 60) ",
        }}
        >
        <Grid container spacing={2}>
        <Grid item xs={3} style={{ textAlign: "center" }}>
        <IconButton onClick={handleOnClickCamera}>
        {devices.video ? <Videocam /> : <VideocamOff />}
        </IconButton>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
        <IconButton onClick={handleOnClickMic}>
        {devices.audio ? <Mic /> : <MicOff />}
        </IconButton>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
        <IconButton
        onClick={shareScreen}
        disabled={!joinedMeeting || userShareScreen != undefined}
        >
        {!sharing ? <ScreenShare /> : <StopScreenShare />}
        </IconButton>
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
        {!joinedMeeting ? (
          <IconButton onClick={handleOnClickJoinMeeting}>
          <Call />
          </IconButton>
          ) : (
            <IconButton onClick={handleOnClickExitMeeting}>
            <CallEnd />
            </IconButton>
                  )}
                </Grid>
                </Grid>
            </div>
            </Grid>
            <Grid item md={4} sm={2}></Grid>
            </Grid>
          </Grid> */}
    </div>
  </>
  );
};


// const Room = () => {
  //   return <h1>Hello world</h1>
  // }
  
  export default Room;
  
  /* eslint-enable */
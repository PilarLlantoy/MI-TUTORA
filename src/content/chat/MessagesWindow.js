
/* Author: Mitsuo */
/* eslint-disable */
import React from "react";
import Autolinker from 'autolinker';
import "./chat.css";
import { Avatar, Box, Button, Divider, IconButton, Input, Tooltip, Typography, useTheme } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CardWrapperSecondary, CardWrapperPrimary } from "src/content/applications/Messenger/ChatContent";
import Scrollbar from "src/components/Scrollbar";
import { ChatWindow } from "../applications/Messenger";
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { fechaFormato } from "src/utils/chat";
import QRCode from 'react-qr-code';
import Reports from "../student/courses/Reports";
import { formatNameCapitals } from "src/utils/training";

const MsgType = {
  TEXT: null,
  IMAGE: 0,
  FILE: 1,
  QRCODE: 2
};

function QRCodeDisplay(props) {
  const componentRef = React.useRef();
  // let qrcode = new QRCode(document.getElementById("qrcode"), "http://jindo.dev.naver.com/collie");

  return (
    <div className="qrcode">
      <QRCode
        title="Mi QR de Yape"
        value={props.text}
        bgColor="#F1F7FF"
        fgColor="#000"
        size={150}
      />
    </div>
  );
}

function MsgBubble(props) {
  /* style for incoming and outgoing messages */
  if (props.msg.authorId === props.id1) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="flex-end"
        ml={2}
        my={1}
      >
        <CardWrapperPrimary>
          {props.children}
        </CardWrapperPrimary>
      </Box>
    );
  } else {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        ml={2}
        my={1}
      >
        <CardWrapperSecondary>
          {props.children}
        </CardWrapperSecondary>
      </Box>
    );
  }

}

function MsgContainer(props) {
  const { msg } = props;
  const date = new Date(props.msg.registerDate);
  const linkedText = Autolinker.link(msg.message);

  let content;
  /* support for images and files */
  if (msg.type === MsgType.IMAGE) {
    content = (<>
      <a href={""} target="_blank">
        <img src={""} alt="My sample image"
          width="200" />
      </a>
    </>);
  } else if (msg.type === MsgType.FILE) {
    content = (<></>);
  } else if (msg.type === MsgType.QRCODE) {
    content = (
      <>
        <span dangerouslySetInnerHTML={{ __html: linkedText }}></span>
        <QRCodeDisplay text="https://tokumori.xyz" />
      </>
    );
  } else {
    /* MsgType === text */
    content = (
      <>
        <span dangerouslySetInnerHTML={{ __html: linkedText }}></span>
      </>
    );
  }

  return (
    // TODO: mostrar el globito segun usuario
    <MsgBubble msg={msg} id1={props.id1}>
      <div style={{ marginBottom: "5px", paddingLeft: "5px", overflowWrap: "break-word" }}>
        {content}
      </div>
      <div className="hora-chat">
        <label>{fechaFormato("hora", props.msg.registerDate)}</label>
      </div>
    </MsgBubble>
  );
}

const ROLE = {
  MEMBER: 1,
  PARTNER: 2,
  STUDENT: 0,
};

function roleid2rolename(roleId) {
  let rolename = ""
  if (roleId === ROLE.MEMBER) {
    rolename = "Miembro Aim"
  } else if (roleId === ROLE.PARTNER) {
    rolename = "Socia Aim"
  } else if (roleId === ROLE.STUDENT) {
    rolename = "Cliente"
  }
  return rolename;
}

export default function MessagesWindow({chatvideo = false, ...props}) {
  const [msg, setMsg] = React.useState("");
  const theme = useTheme();

  /* I have no idea when or why this got erased in a previous in the last merge */
  // only partner can report a client (student)
  function isReportEnabled(props) {
    let showReportButton = false;
    if (props.user && props.user.person.role == ROLE.PARTNER &&
      props.targetUser && props.targetUser.person.role == ROLE.STUDENT) {
      showReportButton = true;
    } else {
      showReportButton = false;
    }
    return showReportButton;
  }


  function sendText() {
    props.sendMessage(msg);
    setMsg("");
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      /* prevents the trailing new line on the textarea (after the message is sent) */
      event.preventDefault();
      sendText();
    }
  }

  function sendQRCode() {
    props.sendMessage("Le comparto mi código QR de Yape:", MsgType.QRCODE);
  }

  let hideQRButton = true;
  if (props.user && props.user.person.role === ROLE.PARTNER) {
    hideQRButton = false;
  }

  return (
    <ChatWindow>
      <div className="messages-header">
        <Box
          sx={{
            display: { sm: 'flex' },
            mx: 2,
            my: 1
          }}
          alignItems="center"
        >
          <Avatar
            variant="circular"
            sx={{
              width: 50,
              height: 50
            }}
            alt="Zain Baptista"
            src={props.targetUser !== null ? (props.targetUser.person.profilePictureURL !== null ? (props.targetUser.person.profilePictureURL.split('#').length > 1 ? props.targetUser.person.profilePictureURL.split('#')[1] : props.targetUser.person.profilePictureURL) : null) : null}
          />
          <Box
            sx={{
              pl: { sm: 1.5 },
              pt: { xs: 1.5, sm: 0 }
            }}
          >
            <div>
              <Typography variant="h5" gutterBottom>
                {props.targetUser ? formatNameCapitals(props.targetUser.person.fullName).replace(',', '') : ""}
              </Typography>
              <Typography variant="h6">
                {roleid2rolename(props.targetUser ? props.targetUser.person.role : null)}
                {/* Miembro aim */}
              </Typography>
            </div>
          </Box>
        </Box>
        <Box
          sx={{
            mt: { xs: 3, md: 0 }
          }}
        >
          <div className={isReportEnabled(props) ? "" : "hidden"}>
            <Reports
              userName={props.targetUser ? props.targetUser.person.fullName : ""}
              clientId={props.targetUser ? props.targetUser.person.id : null}   // reportado
              partnerId={props.id1}  // reportador
              partnerName={props.user.person.fullName}
            />
          </div>
          {/* <IconButton>
            < MoreVertIcon />
          </IconButton> */}
        </Box>
      </div>
      {/* <Scrollbar> */}
      <Box id="scrollmepls" className="messages" p={3} sx={{ background: "#FAF8F8", height: "100%", overflow: "auto" }}>
        <dl>
          {props.messages.map((msg) => (
            <dt key={msg.messageId}>
              <MsgContainer
                msg={msg}
                id1={props.id1}
              />
            </dt>
          ))}
        </dl>
      </Box>
      {/* </Scrollbar> */}
      <Divider />
      <Box
        sx={{
          background: theme.colors.alpha.white[50],
          display: 'flex',
          alignItems: 'center',
          p: 2
        }}
      >
        <Box>
          <Input accept="image/*" id="messenger-upload-file" type="file" sx={{ display: "none" }} />
          <label htmlFor="messenger-upload-file">
            <IconButton sx={{ mr: .5 }} color="secondary" component="span">
              <AttachFileTwoToneIcon fontSize="small" />
            </IconButton>
          </label>
          {!chatvideo && <span style={{ display: hideQRButton ? "none" : "inline" }}>
            <Tooltip arrow placement="top" title="Enviar datos de pago">
              <IconButton sx={{ mr: 1 }} color="secondary" component="span" onClick={sendQRCode}>
                <QrCodeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </span>}

        </Box>
        <Box flexGrow={1} display="flex" alignItems="center" sx={{ mr: .5 }}>
          <textarea
            type="text"
            value={msg}
            placeholder="Escriba un mensaje aqui..."
            onKeyPress={handleKeyPress}
            onChange={(e) => setMsg(e.target.value)}
          />
        </Box>
        <Box>
          {chatvideo? 
            <IconButton sx={{ mr: .5 }} color="secondary" component="span">
              <SendTwoToneIcon fontSize="small" />
            </IconButton>
          : <Button
              sx={{ color: "#f1f1f1" }}
              variant="contained"
              size="small"
              color="secondary"
              onClick={sendText}
            >
              <SendTwoToneIcon sx={{ fontSize: "1.2rem" }} />
            </Button>
          }

        </Box>
      </Box>
    </ChatWindow>
  );
}

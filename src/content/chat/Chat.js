/* Author: Mitsuo
 *
 * All functionality of the module should be here.  Rest of files are only
 * presentation 
 */
/* eslint-disable */
import "./chat.css";
import React from "react";
import { Box, Paper, Button, TextField } from "@mui/material";
import useAuth from 'src/hooks/useAuth';
// import axios from "./axiosDP2";
import axios from "../../utils/aimAxios";
import MessagesWindow from "./MessagesWindow";
import ChatListWindow from "./ChatListWindow";
import Reports from "../student/courses/Reports";

/* APIs consumption
 * ================ */

function getUser(userId, setUser) {
  axios
    .get(`/user/${userId}`, {
    })
    .then((response) => {
      setUser(response.data);
    })
    .catch(console.log);
}

function getUsers(setUsers) {
  axios
    .post("/user/query", {
      firstResult: 1,
      maxResults: 20,
    })
    .then((response) => {
      setUsers(response.data.list);
    })
    .catch(console.log);
}

function getChats(userId, setChats, extra = null) {
  console.log('MANDO A BACK ID: ', userId)
  axios
    .post("/chat/query", {
      firstResult: 1,
      maxResults: 10,
      personId: userId,
    })
    .then((response) => {
      console.log("Chats:", response)
      setChats(response.data.list);

      if (!extra) return;
      extra.autoselectFirstChatAvailable(response.data.list);
    })
    .catch(console.log);
}

function registerChat(id1, id2, msg) {
  return axios
    .post("/chat/register", {
      personAId: id1,
      personBId: id2,
      firstMessage: msg
    })
    .catch(console.log);
}

function getMessages(setMessages, chatId, doScrollDown = true) {
  axios
    .post("/chat/message/query", {
      chatId: chatId,
      firstResult: 1,
      maxResults: 50,
    })
    .then((response) => {
      setMessages(response.data.list);
      if (doScrollDown)
        scrollMessageWindow();
    })
    .catch(console.log);
}

function registerMessage(id1, chatId, msg, type = null, urlFile = null) {
  return axios
    .post("/chat/message/register", {
      authorId: id1,
      chatId: chatId,
      message: msg,
      type: type,
      urlFile: urlFile,
    })
    .catch(console.log);
}

/* Other functions
 * =============== */

function scrollMessageWindow(id = "scrollmepls") {
  let e = document.getElementById(id)
  if (e === null) return;
  e.scroll({
    top: e.scrollHeight,
    left: 0,
    behavior: 'smooth'
  });
}

/* iniciarChat(msg: string, idCliente: int, idSocia: int); */
export function iniciarChat(msg, idCliente, idSocia) {
  /* crea chat, envia mensaje,  redirecciona a la pagina de chats */
  registerChat(idCliente, idSocia, msg)
    .finally(() => {
      window.location.href = `${document.location.origin}/aim/student/chat`;
    })
}


/* Functional Components
 * ===================== */

function DebugForm(props) {

  return (
    <div className="debug-form">
      <div className="form-group">
        <label>id1</label>
        <input
          type="text"
          value={props.id1}
          onChange={(e) => props.setId1(parseInt(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>id2</label>
        <input
          type="text"
          value={props.id2}
          onChange={(e) => props.setId2(parseInt(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>chatId</label>
        <input
          type="text"
          value={props.chatId}
          onChange={(e) => props.setChatId(parseInt(e.target.value))}
        />
      </div>
      <button onClick={() => props.getUsers()}> Get Users</button>
      <button onClick={() => props.registerChat()}>Create new chat</button>
      <button onClick={() => props.getChats()}>Get Chats</button>
      <button onClick={() => props.getMessages()}> Get Messages</button>
      <button onClick={() => props.getMessages()}> Get Messages</button>
      <div></div>
      <button onClick={() => iniciarChat("Nuevo chat iniciado", props.id1, props.id2)}>Iniciar Chat</button>

      {props.users.length ? (<p>Users:</p>) : (<></>)}
      <ul>
        {props.users.map((user) => (
          <li key={user.person.id}>
            {user.person.id} {user.username}
          </li>
        ))}
      </ul>

      {props.chats.length ? (<p>Chats:</p>) : (<></>)}
      <ul>
        {props.chats.map((chat) => (
          <li key={chat.chatId}>
            {chat.chatId} {chat.person} {chat.lastMessageContent} {chat.lastMessageDate}
          </li>
        ))}
      </ul>
    </div>
  );
}



export default function Chat({chatvideo = false, ...props}) {
  /* `id1` is the user personId, `id2` is the targetUser's (receiver of messages)
   * 
   * For use inside videconferencia (/aim/student/room):
   * - props.hideChatList = true
   * - props.forceChattingWith = {some id2}
   */
  const { user } = useAuth();
  // const [user, setUser] = React.useState({id: 27});
  const [messages, setMessages] = React.useState([]);
  const [targetUser, setTargetUser] = React.useState(null);

  const [users, setUsers] = React.useState([]);
  const [chats, setChats] = React.useState([]);

  /* TODO: remove default values */
  const [chatId, setChatId] = React.useState(props.forceChatId);
  const [id1, setId1] = React.useState(27);
  const [id2, setId2] = React.useState(props.forceChattingWith);

  const INTERVAL = 4000;  // in ms
  const MAXLEN = 1000;

  /* query new messages every 5 seconds.
   * Refs: 
   * https://stackoverflow.com/questions/65049812/how-to-call-a-function-every-minute-in-a-react-component
   * https://stackoverflow.com/questions/59146524/call-api-every-x-seconds-in-react-function-component
   */

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     /* FIXME: chatId doesn't update because it's in a closure */
  //     getMessages(setMessages, chatId, false);
  //   }, INTERVAL);
  //   return () => clearInterval(interval);
  // }, [chatId])

  React.useEffect(() => {
    if (!user) {
      return;
    }

    getChats(user.person.id, setChats, {autoselectFirstChatAvailable});
    setId1(user.person.id);
  }, [user]);

  React.useEffect(() => {
    if(!id2) {
      return;
    }

    getUser(id2, setTargetUser);
  }, [id2]);

  function sendMessage(msg, type = null, urlFile = null) {
    if (msg.length != 0 && msg.length < MAXLEN) {
      registerMessage(id1, chatId, msg, type, urlFile)
        .then(() => getMessages(setMessages, chatId))
        .then(() => getChats(id1, setChats))
        .catch(console.log);
    }
  }

  function selectChatOnChatList(chatId, targetUserId) {
    /* maybe should detect if a different chat row (conversation) is selected */
    setChatId(chatId);
    getMessages(setMessages, chatId);
    setId2(targetUserId);
  }

  function autoselectFirstChatAvailable(chats) {
    /* To be called after the chat list is received */
      if (!chats || chats.length == 0) {
        console.log("Warning: No chats available.  Can't select first by default");
        return;
      }
      selectChatOnChatList(chats[0].chatId, chats[0].personId);
      console.log("This is what I got: ", chats);
  }

  return (
    <>
    { !chatvideo && <div className="container">
      <h3>Mensajes</h3>
      <div className="chat-window">
        <div className={props.hideChatList ? "hidden" : null}>
          <ChatListWindow
            chats={chats}
            users={users}
            targetUser={targetUser} setTargetUser={setTargetUser}

            getUsers={() => getUsers(setUsers)}
            selectChatOnChatList={selectChatOnChatList}
          />
        </div>
        <MessagesWindow
          id1={id1}
          chatId={chatId}
          messages={messages}
          user={user}
          targetUser={targetUser}

          sendMessage={sendMessage}

        />
      </div>

      <DebugForm
        id1={id1} setId1={setId1}
        id2={id2} setId2={setId2}
        chatId={chatId} setChatId={setChatId}
        user={user}
        users={users} setUsers={setUsers}
        chats={chats} setChats={setChats}

        getUsers={() => getUsers(setUsers)}
        getMessages={() => getMessages(setMessages, chatId)}
        registerChat={() => registerChat(id1, id2)}
        getChats={() => getChats(id1, setChats)}
      />
    </div>}
    {chatvideo && 
      <div className="chat-video-window">
        <MessagesWindow
          id1={id1}
          chatId={chatId}
          messages={messages}
          user={user}
          targetUser={targetUser}
          sendMessage={sendMessage}
          chatvideo
        />
      </div>
    }
    </>
  );
}

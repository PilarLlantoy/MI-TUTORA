/* Author: Mitsuo */
/* eslint-disable */
import "./chat.css";
import React from "react";
import { Avatar, Box } from "@mui/material";
import { fechaFormato, obtenerNombreCortado } from "src/utils/chat";

function ChatListRow(props) {

  const state = props.activeItemId == props.chat.chatId ? "active" : null;

  function onClick() {
    /* parent functionality */
    props.selectChatOnChatList(props.chat.chatId, props.chat.personId);
    /* extra functionality */
    props.setActiveItemId(props.chat.chatId);
  }

  return (
    <li
      className={"chat-list-row"}
      state={state}
      key={props.chat.chatId}
      onClick={onClick}
    >
      <table style={{ width: "100%" }}>
        <tbody>
          <tr style={{ width: "100%" }}>
            <td style={{ width: "15%", marginRight: 1 }}>
              {/* <Avatar src="https://lh3.googleusercontent.com/ogw/AOh-ky0W8mpU7-oAlJfwAgwAkBkU5QRiZnPtWCqxpA0w=s32-c-mo" alt="" /> */}
              <Avatar variant='circular' src={props.chat.photoUrl !== null ? (props.chat.photoUrl.split('#').length > 1 ? props.chat.photoUrl.split('#')[1] : props.chat.photoUrl) : null} />
            </td>
            <td style={{ width: "60%", maxWidth: "60%", minWidth: "60%", whiteSpace: "nowrap", overflow: "hidden" }}>
              <h5>{obtenerNombreCortado(props.chat.person)}</h5>
              <p>{obtenerNombreCortado(props.chat.lastMessageContent, 25, true)}</p>
            </td>
            <td style={{ width: "20%", paddingLeft: 1 }}>
              <label>
                {fechaFormato("fecha", props.chat.lastMessageDate)}
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </li>
  );
}

export default function ChatListWindow(props) {
  const [activeItemId, setActiveItemId] = React.useState("");

  return (
    <aside className="sidebar">
      <div className="search-bar">
      </div>
      <ul className="chat-list">
        {props.chats.map((chat) => (
          <ChatListRow
            key={chat.messageId}
            chat={chat}
            activeItemId={activeItemId} setActiveItemId={setActiveItemId}
            selectChatOnChatList={props.selectChatOnChatList}
          />
        ))}
      </ul>
    </aside>
  );
}

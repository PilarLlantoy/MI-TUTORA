// No se si debe ir aqui, sino hay que moverlo a un lugar apropiado

// import { useState, useEffect, useCallback } from 'react';
// import axios from 'src/utils/axios';

import { Helmet } from 'react-helmet-async';
import { Container, TextField, Button } from '@mui/material';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

function PruebaChat() {

  return (
    <>
      <Helmet>
        <title>Prueba de chat</title>
      </Helmet>
      <PageTitleWrapper>
        "Ayuda"
      </PageTitleWrapper>

      <Container
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        
        <div><TextField label="Username" variant="standard" /></div>
        <div><TextField label="Username" variant="standard" /></div>
        <div><Button variant="contained">Start Chatting</Button></div>
        
      </Container>

      <>
        <div id="chat-page" className="hidden">
          <div className="chat-container">
            <div className="chat-header">
              <h2>Spring WebSocket Chat Demo</h2>
            </div>
            <div className="connecting">
              Connecting...
            </div>
            <ul id="messageArea" />
            <form id="messageForm" name="messageForm" nameForm="messageForm">
              <div className="form-group">
                <div className="input-group clearfix">
                  <input type="text" id="message" placeholder="Type a message..." autoComplete="off" className="form-control" />
                  <button type="submit" className="primary">Send</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>

      <Footer />
    </>
  );
}

export default PruebaChat;

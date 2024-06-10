import './App.css';
import React, { useState } from 'react'
import ChatBox from './components/chatBox';
import Profile from './components/Profile';

export default function App() {

  const [profileInfo, setProfileInfo] = useState('');
  const [showChat, setShowChat] = useState(false);


  return (
    <>{!showChat ?
      <Profile setProfileInfo={setProfileInfo} setShowChat={setShowChat} />
      :
      <ChatBox profileInfo={profileInfo} />}
    </>
  )
}
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [ welcomeMessage, setData ] = useState(null)
  const [ emailSentMessage, setEmailSentMessage ] = useState(null)
  
  useEffect(() => {
    const sendApiCall = async () => {
      try {
        const response = await axios.get('http://localhost:3000/')
        setData(response.data)
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }
    sendApiCall()
  }, [])

  const sendEmail = async () => {
    try {
      const response = await axios.post('http://localhost:3000/send_email', {to: "pipinasdarius@gmail.com"});
      setEmailSentMessage(response.data);
    } catch (error) {
      setEmailSentMessage('Failed to send email: ' + error);
    }
  };

  return (
    <>
      <div>{welcomeMessage}</div>
      <button onClick = {sendEmail}>Send email</button>
      <div>{emailSentMessage}</div>
    </>
  )
}

export default App

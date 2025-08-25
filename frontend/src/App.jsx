import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { ViewableItems } from './components/ViewableItems'

function App() {
  
  const [ welcomeMessage, setWelcomeMessage ] = useState(null)

  useEffect(() => {
    const sendApiCall = async () => {
      try {
        const response = await axios.get('http://localhost:3000/')
        setWelcomeMessage(response.data)
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }
    sendApiCall()
  }, [])

  // const sendEmail = async (receiver) => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/send_email', {to: receiver});
  //     setEmailSentMessage(response.data);
  //   } catch (error) {
  //     setEmailSentMessage('Failed to send email: ' + error);
  //   }
  // };

  return (
    <div>
      <div>{welcomeMessage}</div>

      <br></br><br></br>

      <div className='viewable-items-container'>
        <ViewableItems />
      </div>

    </div>
  )
}

export default App

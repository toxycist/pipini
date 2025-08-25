import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  
  const [ welcomeMessage, setWelcomeMessage ] = useState(null)
  const [viewCounters, setViewCounters] = useState({
    1: 0,
    2: 0,
    3: 0,
  });
  // const [ emailSentMessage, setEmailSentMessage ] = useState(null)
  
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

  const viewItem = (id) => {
    setViewCounters((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  return (
    <div>
      <div>{welcomeMessage}</div>

      <br></br><br></br>

      <div className='viewable-items-container'>
        {Object.entries(viewCounters).map(([itemId, value]) => (
          <div key={itemId}  className='viewable-item'>
            <button onClick={() => {viewItem(itemId)}}>View item {itemId}</button>
            <div>Item viewed {value} times.</div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default App

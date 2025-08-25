import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { ViewableItems } from './components/ViewableItems'

function App() {
  
  const [ welcomeMessage, setWelcomeMessage ] = useState(null)
  const [ emailSentMessage, setEmailSentMessage ] = useState(null)
  const [viewCounters, setViewCounters] = useState({
    1: 0,
    2: 0,
    3: 0,
  });

  const getMuchViewedItems = () => {
    return Object.entries(viewCounters).filter(([id, value]) => value > 2).map(([id, value]) => id)
  }

  const handleDiscountChange = (event) => {
    const isApplied = event.target.checked;
    if (isApplied && getMuchViewedItems().length > 0) {
      sendEmail("pipinasdarius@gmail.com")
    }
  }

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

  const sendEmail = async (receiver) => {
    try {
      const response = await axios.post('http://localhost:3000/send_email', {to: receiver, items: getMuchViewedItems()});
      setEmailSentMessage(response.data);
    } catch (error) {
      setEmailSentMessage('Failed to send email: ' + error);
    }
  };

  return (
    <div>
      <div>{welcomeMessage}</div>

      <br></br><br></br>

      <div className='viewable-items-container'>
        <ViewableItems
        viewCounters={viewCounters}
        setViewCounters={setViewCounters}
        />
      </div>

      <div className="discount-checkbox">
        <input type="checkbox" id="discount" onChange={handleDiscountChange}/>
        <label htmlFor="discount">Apply a discount</label>
      </div>

      <div>{emailSentMessage}</div>

    </div>
  )
}

export default App
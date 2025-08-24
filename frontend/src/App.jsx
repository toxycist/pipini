import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [ data, setData ] = useState(null)
  
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

  return (
    <>
      <div>{data}</div>
    </>
  )
}

export default App

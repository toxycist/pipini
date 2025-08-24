import express from 'express'
import cors from 'cors'
import { spawn } from 'child_process'

const app = express()
const port = 3000

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Connected to the backend server.')
})

function sendEmail(to) {
  return new Promise((resolve, reject) => {
    const email_python_process = spawn("python", ["email_agent.py", to])

    email_python_process.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    email_python_process.on("close", (code) => {
      if (code === 0) resolve(code);
      else reject(new Error(`Python exited with ${code}`));
    });
  })
}

app.post('/send_email', async (req, res) => {
   console.log(req)
   const { to } = req.body
   try {
    const result = await sendEmail(to);
    res.send(`Email sent to ${to}. Output: ${result}`);
  } catch (err) {
    res.status(500).send(`Tried to send an email to ${to}. Error: ${err.message}`);
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
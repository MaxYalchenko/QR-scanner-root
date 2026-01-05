const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/routes')

const PORT = process.env.PORT || 8082
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', userRouter)

app.listen(PORT, () => console.log(`server started on post ${PORT}`))


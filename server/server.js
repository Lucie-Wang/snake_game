const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors(), express.urlencoded({extended:true}), express.json())

require('./config/config')
require('./models/model')
require('./routes/routes')(app)

app.listen(8000)
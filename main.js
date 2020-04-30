const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors');
const db = require('./queries')
require("dotenv").config();
const port = process.env.PORT1 ;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/blah', db.getBug)
app.get('/blah/:id', db.getBugById)
app.post('/blah', db.createBug)
app.put('/blah/:id', db.updateBug)
app.delete('/blah/:id', db.deleteBug)

app.listen(port, () => {
  console.log(`Server running on port ${port}.`)
})
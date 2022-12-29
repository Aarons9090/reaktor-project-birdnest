const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()

const baseUrl = "https://assignments.reaktor.com/birdnest"

app.use(cors())
app.use(express.json())

app.get("/drones", (req, res) => {
    axios.get(baseUrl + "/drones")
        .then(response => {
            res.header('Content-Type', 'text/xml');
            res.send(response.data);
        })
        .catch(error => {
            console.log(error)
        })
})

app.get("/pilots/:id", (req, res) => {
    axios.get(baseUrl + "/pilots/" + req.params.id)
        .then(response => {
            res.json(response.data)
        })
        .catch(error => {
            console.log(error)
        })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

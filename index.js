const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const Entry = require('./models/entries.js')



const app = express()
morgan.token('body', function(req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(function(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}))
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.get('/api/persons', (req, res) => {
  Entry.find({}).then(result => {
    //console.log(123123123, result);
    res.json(result)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Entry.findOne({ _id: req.params.id }).then(result => {
    if (!result) {
      return res.status(404).end()
    }
    res.json(result)
  })
    .catch(error => {
      next(error)
    })
})

app.get('/info', (req, res) => {
  Entry.find({}).then(notes => {
    const numberOfPeople = `Phonebook has info for ${notes.length} people`
    const currentTime = new Date(Date.now())
    const sendString = `<div>${numberOfPeople}</div> <div>${currentTime}</div>`
    res.send(sendString)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Entry.deleteOne({ _id: req.params.id }).then(result => {
    //console.log("deleted", result)
    return res.status(204).end()
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' })
  }
  const note = new Entry({
    name: body.name,
    number: body.number,
    id: body.id,
  })

  note.save().then(savedEntry => {
    res.json(savedEntry)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res) => {
  if (!req.body.number) {
    return res.status(400).json({
      error: 'number is missing'
    })
  }
  //console.log("id and body", req.params.id, req.body);
  Entry.updateOne({ _id: req.params.id }, { $set: req.body }, { new: true, runValidators: true, context: 'query' })
    .then(result => {
      if (!result.modifiedCount) {
        return res.status(400).json({
          error: 'person does not exist anymore, please refresh the page to update person list'
        })
      }
      res.json(result)
    })
    .catch(error => {
      return res.json(error)
    })


})
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})
app.use((error, req, res, next) => {
  console.error(error)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

})
const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
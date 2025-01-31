import express from "express"
import morgan  from "morgan"
import cors from "cors"

const app = express();

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
})

app.use(morgan(function(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(" ")
}))

app.use(cors());

let notes = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json());
app.get("/api/persons", (req, res) => {
    res.json(notes);
})

app.get("/api/persons/:id", (req, res) => {
    const retPerson = notes.find((person => person.id === req.params.id));
    if (!retPerson) {
        res.status(404).end()
    }
    console.log(retPerson);
    res.json(retPerson);

})

app.get("/info", (req, res) => {
    const numberOfPeople = `Phonebook has info for ${notes.length} people`;
    const currentTime = new Date(Date.now())
    const sendString = `<div>${numberOfPeople}</div> <div>${currentTime}</div>`
    res.send(sendString);
})

app.delete("/api/persons/:id", (req, res) => {
    console.log(1);
    const id = req.params.id;
    notes = notes.filter(person => person.id !== id);
    res.status(204).end();
})

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
      }
    for (let person of notes) {
        if (person.name === body.name) {
            return res.status(400).json({
                error: "name already exists"
            })
        }
    }

    const note = {
    name: body.name,
    number: body.number,
    id: generateId().toString(),
  }

    console.log(note);
    notes = notes.concat(note);

    res.json(note);
})

function generateId() {
    return Math.round(Math.random()*8000)
}
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
})
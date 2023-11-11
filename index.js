const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express();

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(express.static('dist'))
app.use(cors())
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.json());

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get("/api/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(204).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const id = generateID();

  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };

  const checkName = persons.find((p) => p.name === person.name);

  if (!person.name || !person.number) {
    response.status(404).json({ error: "The name or number data is missing" });
  } else if (checkName) {
    response.status(404).json({ error: "Name must be unique" });
  } else {
    persons = persons.concat(person);
    response.json(person);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

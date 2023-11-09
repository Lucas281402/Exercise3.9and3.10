const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateID = () => {
  return Math.floor(Math.random() * 1000000) + 1;
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

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

//homepage
app.get("/", (req, res) => {
  res.send("<h1>Phonebook</h1>");
});

//get all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// get info
app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people<br/><p>${new Date()}</p>`
  );
});

// get a specific person
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  person ? res.json(person) : res.status(404).end();
});

// delete a specific person
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => id !== person.id);
  res.status(204).json(persons);
});

// add a new person
app.post("/api/persons", (req, res) => {
  const person = req.body;
  if (persons.some((obj) => obj.name === person.name)) {
    res.status(409).json({ error: "name must be unique" });
    return;
  }
  if (person.name === "" || person.number === "") {
    res.status(409).json({ error: "all fields must be completed" });
    return;
  }
  person.id = persons.length + 1;
  res.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

const dataFilePath = path.join(__dirname, 'data.json');

const readData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.get('/books', (req, res) => {
  const data = readData();
  res.json(data);
});

app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const data = readData();
  const book = data.find(item => item.id === bookId);
  if (book) {
    res.json(book);
  } else {
    res.status(404).send('Book not found');
  }
});

app.post('/books', (req, res) => {
  const newBook = req.body;
  const data = readData();
  const newId = data.length ? data[data.length - 1].id + 1 : 1;
  const bookWithId = { id: newId, ...newBook };
  data.push(bookWithId);
  writeData(data);
  res.status(201).json(bookWithId);
});

app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  const data = readData();
  const bookIndex = data.findIndex(item => item.id === bookId);
  if (bookIndex === -1) {
    return res.status(404).send('Book not found');
  }
  data[bookIndex] = { id: bookId, ...updatedBook };
  writeData(data);
  res.json(data[bookIndex]);
});

app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const data = readData();
  const bookIndex = data.findIndex(item => item.id === bookId);
  if (bookIndex === -1) {
    return res.status(404).send('Book not found');
  }
  data.splice(bookIndex, 1);
  writeData(data);
  res.status(204).send();
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import { useEffect, useState } from "react";

interface Book {
  id: number;
  author: string;
  title: string;
  year: number;
  genre: string;
  pages: number;
  available: boolean;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formState, setFormState] = useState({
    author: "",
    title: "",
    year: "",
    genre: "",
    pages: "",
    available: false,
  });

  const fetchBooks = async () => {
    const response = await fetch('http://localhost:5000/books');
    const result = await response.json();
    setBooks(result);
  };

  useEffect(() => {
    fetchBooks(); 
  }, []); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target;
    setFormState({ ...formState, [name]: value }); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(editingBook){
      await updateBook();
    } else {
      await addBook(); 
    }
  };

  const addBook = async () => {
    const response = await fetch('http://localhost:5000/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: formState.author,
        title: formState.title,
        year: parseInt(formState.year),
        genre: formState.genre,
        pages: parseInt(formState.pages),
        available: formState.available,
      }),
    });
    if (response.ok) {
      fetchBooks(); 
      resetForm(); 
    }
  };

  const editBook = (book: Book) => {
    setEditingBook(book);
    setFormState({
      author: book.author,
      title: book.title,
      year: book.year.toString(),
      genre: book.genre,
      pages: book.pages.toString(),
      available: book.available,
    });
  };

  const updateBook = async () => {
    if (!editingBook) return;
    const response = await fetch(`http://localhost:5000/books/${editingBook.id}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: formState.author,
        title: formState.title,
        year: parseInt(formState.year),
        genre: formState.genre,
        pages: parseInt(formState.pages),
        available: formState.available,
      }),
    });
    if (response.ok) { 
      fetchBooks(); 
      resetForm(); 
    }
  };

  const deleteBook = async (id: number) => {
    const response = await fetch(`http://localhost:5000/books/${id}`, { 
      method: 'DELETE', 
    });
    if (response.ok) {
      await fetchBooks();
    }
  };

  const resetForm = () => {
    setFormState({ author: '', title: '', year: '', genre: '', pages: '', available: false });
    setEditingBook(null);
  };

  return (
    <>
      <h1>Könyvek kezelése</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="author">Szerző:</label>
        <br />
        <input
          type="text"
          name="author"
          id="author"
          value={formState.author}
          onChange={handleInputChange}
        />
        <br />
        <label htmlFor="title">Cím:</label>
        <br />
        <input
          type="text"
          name="title"
          id="title"
          value={formState.title}
          onChange={handleInputChange}
        />
        <br />
        <label htmlFor="year">Év:</label>
        <br />
        <input
          type="number"
          name="year"
          id="year"
          value={formState.year}
          onChange={handleInputChange}
        />
        <br />
        <label htmlFor="genre">Műfaj:</label>
        <br />
        <input
          type="text"
          name="genre"
          id="genre"
          value={formState.genre}
          onChange={handleInputChange}
        />
        <br />
        <label htmlFor="pages">Oldalszám:</label>
        <br />
        <input
          type="number"
          name="pages"
          id="pages"
          value={formState.pages}
          onChange={handleInputChange}
        />
        <br />
        <label htmlFor="available">Elérhető:</label>
        <input
          type="checkbox"
          name="available"
          id="available"
          checked={formState.available}
          onChange={(e) => setFormState({ ...formState, available: e.target.checked })}
        />
        <br /><br />
        <button type="submit">{editingBook ? 'Módosítás' : 'Felvitel'}</button>
      </form>
      <br />
      <table>
        <thead>
          <tr>
            <th>Szerző</th>
            <th>Cím</th>
            <th>Év</th>
            <th>Műfaj</th>
            <th>Oldalszám</th>
            <th>Elérhetőség</th>
            <th>Szerkesztés</th>
            <th>Törlés</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.author}</td>
              <td>{book.title}</td>
              <td>{book.year}</td>
              <td>{book.genre}</td>
              <td>{book.pages}</td>
              <td>{book.available ? 'Elérhető' : 'Nem elérhető'}</td>
              <td><button onClick={() => editBook(book)}>Szerkesztés</button></td>
              <td><button onClick={() => deleteBook(book.id)}>Törlés</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;

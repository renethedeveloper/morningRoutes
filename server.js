const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const helmet = require('helmet'); // adds a bunch of standard security to server
const Book = require('./models/Book.js');
require('dotenv').config();
require('./config/db.js');
const PORT = 3000;


const app = express();


// START MIDDLEWARE //
app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use(morgan('dev'));
// app.use(helmet());
// END MIDDLEWARE //

// START ROUTES //


// find   - finds everything

app.get('/books/search/:keyword', async (req, res) => {
    const keyword = req.params.keyword;
  
    try {
      const matchingBooks = await Book.find({ title: { $regex: keyword, $options: 'i' } });
  
      if (matchingBooks.length > 0) {
        res.send(matchingBooks);
      } else {
        res.send('No matching books found.');
      }
    } catch (error) {
      res.status(500).send('Error, sorry.');
    }
  });
  



// .find()

app.get("/books/title/:keyword", async (req,res)=>{
   
    let response = await Book.find({title:req.params.keyword})
    res.send(response)
})




 
// findById

app.get("/books/:id", async (req, res) => {
    const bookId = req.params.id;
    
    // Use a database query method, like Mongoose if you're using MongoDB
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// insertMany
app.post('/books', async (req, res) => {
    // in the request there should be an array of books objects.
    let books = req.body.books;

    let dbResponse =  await  Book.insertMany(books);
    res.send(dbResponse);
})

// findByIdAndUpdate
app.put('/books/:id', async (req, res) => {
    const id = req.params.id;
    const { title, pages } = req.body;
  
    try {
      const updatedBook = await Book.findByIdAndUpdate(id, { title, pages }, { new: true });
  
      if (updatedBook) {
        res.send('Updated');
      } else {
        res.send('Not Found');
      }
    } catch (error) {
      res.status(500).send('Error, sorry.');
    }
  });
  //findbyIdAndDelete

  app.delete("/books/" , async (req, res)=>{

  })





// END ROUTES //

app.listen(PORT, () => {
    console.log(`Server LIVE on port ${PORT}`);
});



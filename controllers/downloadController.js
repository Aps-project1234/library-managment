const fs=require('fs/promises');

const Author=require('../models/author');
const Book=require('../models/book');
const BookInstance=require('../models/bookinstance');
const Genre=require('../models/genre');

exports.download=async function(req,res,next){
    try {
        const store={};
        store.authors=await Author.find();
        store.books=await Book.find();
        store.bookInstances=await BookInstance.find();
        store.genres=await Genre.find();
        await fs.writeFile('./public/downloads/store.json',JSON.stringify(store),'utf-8');
        res.redirect('/downloads/store.json');
    } catch (error) {
        next(err);
    }
}
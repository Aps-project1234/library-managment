var async = require('async');
var Book = require('../models/book');
var BookInstance = require('../models/bookinstance');
var {
  body,
  validationResult
} = require("express-validator");
// Display list of all BookInstances
exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
      .populate('book')
      .exec(function (err, list_bookinstances){
        if(err){
          return next(err);
        }
        //Successful, so render
        res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances});
      });
};

// Display detail page for a specific BookInstance
exports.bookinstance_detail = function(req, res, next) {

  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('bookinstance_detail', { title: 'Book:', bookinstance: bookinstance });
    });

  };

// Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res) {
    Book.find({}, 'title')
    .exec(function(err, books){
      if(err){return next(err); }
      //Successful, so render
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books});
    });
};

// Handle BookInstance create on POST
exports.bookinstance_create_post = function(req, res, next) {

  body('book', 'Book must be specified').notEmpty(); //We won't force Alphanumeric, because book titles might have spaces.
  body('imprint', 'Imprint must be specified').notEmpty();
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).notEmpty();

  //('book').escape();
  //('imprint').escape();
  //('status').escape();
  //('book').trim();
  //('imprint').trim();
  //('status').trim();
  //('due_back').toDate();

  var bookinstance = new BookInstance({
    book: req.body.book,
    imprint: req.body.imprint,
    status: req.body.status,
    due_back: req.body.due_back
  });

  var errors = validationResult(req).errors;
  if(errors.length > 0){

    Book.find({}, 'title')
    .exec(function(err, books){
      if(err){return next(err);}
      //Successful, so render
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors:errors, bookinstance:bookinstance });

    });
    return;
  }
  else {
    //Data from form is valid
    bookinstance.save(function(err){
      if(err){return next(err); }
      //Successful - redirect to new book-instance record.
      res.redirect(bookinstance.url);
    });
  }
};

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = function(req, res, next) {
    async.parallel({
      bookinstance: function(callback){
        BookInstance.findById(req.params.id).exec(callback);
      },
    }, function(err, results) {
      if(err){return next(err); }
      //successful
      res.render('bookinstance_delete', {title: 'Delete BookInstance', bookinstance: results.bookinstance});
    });
};

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res, next) {
    body('bookinstanceid', 'BookInstance id must exist').notEmpty();

    async.parallel({
      bookinstance: function(callback){
        BookInstance.findById(req.body.id).exec(callback);
      },
    }, function(err, results){
      if(err){return next(err); }
      //successful
      BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err){
        if(err){return next(err); }
        //successful
        res.redirect('/catalog/bookinstances');
      });
    })
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};

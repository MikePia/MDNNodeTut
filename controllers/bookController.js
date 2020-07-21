const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const { body, validationResult } = require('express-validator')

const async = require('async');
const bookinstance = require('../models/bookinstance');
const book = require('../models/book');

exports.index = (req, res) => {
    async.parallel({
        book_count: (callback) => {
            Book.countDocuments({}, callback);
        },
        book_instance_count: (callback) => {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: (callback) => {
            BookInstance.countDocuments({ status: 'Available' }, callback);
        },
        author_count: (callback) => {
            Author.countDocuments({}, callback);
        },
        genre_count: (callback) => {
            Genre.countDocuments({}, callback);
        }
    }, (err, results) => {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
    ;
}

// Display list of all books
exports.book_list = (req, res, next) => {
    Book.find({}, 'title author').populate('author').exec((err, list_books) => {
        if (err) { return next(err); }
        res.render('book_list', { title: 'Book List', book_list: list_books });
    });
}


// Display detail for a specific book
exports.book_detail = (req, res) => {
    async.parallel({
        book: (callback) => {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance: (callback) => {
            BookInstance.find({ 'book': req.params.id }).exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);
        if (results.book == null) {
            const err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('book_detail',
            {
                title: results.book.title,
                book: results.book,
                book_instances: results.book_instance
            });
    });
}

// Display book create form on GET
exports.book_create_get = (req, res, next) => {
    async.parallel({
        authors: (callback) => {
            Author.find(callback);
        },
        genres: (callback) => {
            Genre.find(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        res.render('book_form', {
            title: 'Create Book',
            authors: results.authors,
            genres: results.genres
        });
    });
};

// Handle book create on POST
exports.book_create_post = [
    // Convert the genre to an array
    (req, res, next) => {
        if (!req.body.genre instanceof Array) {
            if (typeof req.body.genre === 'undefined') req.body.genre = [];
            else req.body.genre = new Array(req.body.genre);
        }
        next();
    },
    body('title', "Title must not be empty").trim().isLength({ min: 1 }).escape(),
    body('author', "Author must not be empty").trim().isLength({ min: 1 }).escape(),
    body('summary', "Summary must not be empty").trim().isLength({ min: 1 }).escape(),
    body('isbn', "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        let book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: req.body.genre,
            });
        if (!errors.isEmpty()) {
            async.parallel({
                authors: (callback) => {
                    Author.find(callback);
                },
                genres: (callback) => {
                    Genre.find(callback);
                },
            }, (err, results) => {
                if (err) return next(err);
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true'
                    }
                }
                res.render('book_form', {
                    title: 'Create Book',
                    authors: results.authors,
                    genres: results.genres,
                    book: book,
                    errors: errors.array()
                });
            });
        }
        else {
            book.save((err) => {
                if (err) return next(err);
                res.redirect(book.url);
            })
        }
    }

]

// Display book delete form on GET
exports.book_delete_get = (req, res, next) => {
    async.parallel({
        book: (callback) => {
            Book.findById(req.params.id).exec(callback);
        },
        bookinstances_book: (callback) => {
            BookInstance.find({ book: req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.book == null) {
            res.redirect('/catalog/books')
        }
        res.render('book_delete', {
            title: 'Delete book',
            book: results.book,
            bookinstances_book: results.bookinstances_book
        });
    });
};
// Handle book delete on POST
// Delete only if no BookInstance of the book exists
exports.book_delete_post = (req, res, next) => {
    async.parallel({
        book: (callback) => {
            Book.findById(req.params.id).exec(callback);
        },
        bookinstance: (callback) => {
            BookInstance.find({ book: req.params.id}).exec(callback)
        }
    }, (err, results)=> {
        
        if (err) return next(err);
        if (results.bookinstance.length > 0) {
            // This case will propbably not get called as it is found in the form and rerendered there
            res.render('book_delete', {
                title: 'Delete Book',
                book: results.book,
                bookinstance: results.bookinstance
            });
            return

        } else {

            Book.findByIdAndRemove(req.body.bookid, function deleteBook(err) {
                if (err) return next(err);
                res.redirect('/catalog/books')
            })
        }


    })
}

// Display book update form on GET
exports.book_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED Book update GET')
};
// Handle book update on POST
exports.book_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED Book update POST')
};

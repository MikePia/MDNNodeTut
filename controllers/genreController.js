const Genre = require('../models/genre');
const Book = require('../models/book')
const async = require('async');
const validator = require('express-validator');
const { body, validationResult } = require('express-validator');


// Display list of all Genre
exports.genre_list = (req, res, next) => {
    Genre.find()
        .sort([['name', 'ascending']])
        .exec((err, list_genres) => {
            res.render('genre_list',
                {
                    title: 'Genre List',
                    genre_list: list_genres
                })
        })
};

// Display detail page for a specific genre
exports.genre_detail = (req, res, next) => {

    async.parallel({
        genre: (callback) => {
            Genre.findById(req.params.id).exec(callback);
        },
        /** Find books associated with the genre */
        genre_books: (callback) => {
            Book.find({ 'genre': req.params.id }).exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);
        if (results.genre == null) {
            const err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('genre_detail',
            {
                title: 'Genre Detail',
                genre: results.genre,
                genre_books: results.genre_books
            });
    });
};

// Display Genre create form on GET
exports.genre_create_get = (req, res, next) => {
    res.render('genre_form', { title: 'Create Genre' })
};

// Handle Genre create on POST
exports.genre_create_post = [
    validator.body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    // validator.sanitizeBody('name').escape(),
    (req, res, next) => {
        const errors = validator.validationResult(req);
        var genre = new Genre({ name: req.body.name });
        if (!errors.isEmpty()) {
            res.render('genre_form', {
                title: 'Create Genre',
                genre: genre,
                // errors: 'fred'
                errors: errors.array()
            });
            return;
        }
        else {
            // Data is valid
            // Check if data with the same name already exists
            Genre.findOne({ 'name': req.body.name })
                .exec((err, found_genre) => {
                    if (err) { return next(err); }
                    if (found_genre) {
                        res.redirect(found_genre.url);
                    }
                    else {
                        genre.save((err) => {
                            if (err) return next(err);
                            res.redirect(genre.url);
                        });
                    }
                });
        }
    }
];

// Display Genre delete form on GET
exports.genre_delete_get = (req, res, next) => {
    // Get the genre id from the url
    async.parallel({
        genre: (callback) => {
            Genre.findById(req.params.id).exec(callback)
        },
        genre_books: (callback) => {
            Book.find({ 'genre': req.params.id }).exec(callback)
        },
    }, (err, results) => {
        if (err) return next(err)
        if (results.genre == null) {
            res.redirect('/catalog/genres')
        }
        res.render('genre_delete', {
            title: 'Delete Genre',
            genre: results.genre,
            genre_books: results.genre_books
        });
    });
};

// Handle Genre delete on POST
// Delete only if no books include the genre
exports.genre_delete_post = (req, res, next) => {

    async.parallel({
        genre: (callback) => {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: (callback) => {
            Book.find({ 'genre': req.params.id }).exec(callback)
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.genre_books.length > 0) {
            res.render('genre_delete', {
                title: 'Delete Genre',
                genre: results.genre,
                genre_books: results.genre_books
            });
            return;
        }
        else {
            Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
                if (err) return next(err);
                res.redirect('/catalog/genres')
            })
        }

    });

};

// Display Genre update form on GET
exports.genre_update_get = (req, res, next) => {
    async.parallel({
        genre: (callback) => {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: (callback) => {
            Book.find({'genre': req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.genre == null) {
            res.redirect('/catalog/genres');
        }

        res.render('genre_form', {
            title: 'Update genre',
            genre: results.genre,
            genre_books: results.genre_books
        });
    });
};


// Handl Genre update on POST
exports.genre_update_post =  [
    body('name', 'Name must not be empty').trim().isLength({ min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        let genre = new Genre( {
            name: req.body.name,
            _id: req.params.id
        });
        if(!errors.isEmpty()) {
            async.parallel({
                genres: (callback) => {
                    Genre.findById(req.params.id).exec(callback);
                },
                genre_books: (callback) => {
                    Book.find({ 'genre': req.params.id }).exec(callback)
                },
            }, (err, results) => {
                if (err) return next(err);
                res.render('genre_form', {
                    title: 'Update genre',
                    genre: results.genre,
                    genre_books: results.genre_books
                });
            }) 
            return;
        } else {
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, thegenre) {
                if (err) return next(err);
                res.redirect('/catalog/genres')
            });
        }
    }
];

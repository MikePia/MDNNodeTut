const Genre = require('../models/genre');
const Book = require('../models/book')
const async = require('async');
const validator = require('express-validator')


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
exports.genre_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED Genre delete GET');
};

// Handl Genre delete on POST
exports.genre_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED Genre delete POST');
};

// Display Genre update form on GET
exports.genre_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED Genre update GET');
};

// Handl Genre update on POST
exports.genre_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED Genre update POST');
};
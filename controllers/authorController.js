const Author = require('../models/author')
const Book = require('../models/book')
const async = require('async')
const { body, validationResult } = require('express-validator/check')
const author = require('../models/author')

// Display list of all Authors
exports.author_list = (req, res, next) => {
    Author.find().populate('author')
        .sort([['family_name', 'ascending']])
        .exec((err, list_authors) => {
            if (err) return next(err);
            res.render('author_list',
                {
                    title: 'Author List',
                    author_list: list_authors
                });
        });
};

// Display detail page for a specific Author
exports.author_detail = (req, res, next) => {

    async.parallel({
        author: (callback) => {
            Author.findById(req.params.id).exec(callback);
        },
        author_books: (callback) => {
            Book.find({ 'author': req.params.id }, 'title, summary').exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.author == null) {
            const err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        res.render('author_detail',
            {
                title: 'Author Detail',
                author: results.author,
                author_books: results.author_books
            });
    });
};

// Display Author create form on GET
exports.author_create_get = (req, res, next) => {
    res.render('author_form', { title: 'Create Author' });
}

// Handle Author create on POST
exports.author_create_post = [
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters').escape(),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters').escape(),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().escape(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().escape(),

    // sanitizeBody('first_name').escape(),
    // sanitizeBody('family_name').escape(),
    // sanitizeBody('dete_of_birth').escape(),
    // sanitizeBody('date_of_death').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
            return;
        }
        else {
            let author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death,
                });
            // Should check for already existing author here like genre does
            author.save((err) => {
                if (err) return next(err);
                res.redirect(author.url);
            });
        }
    }
];

// Display Author delete from on GET
exports.author_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Author delete GET');
}

// Handle Author delete on POST
exports.author_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Author delete POST');
}

// Display Authoreds update form on GET
exports.author_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Author update GET');
}

// Handle Autthor update on POST
exports.author_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Author update POST');
}
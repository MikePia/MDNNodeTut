#MDN Node tutorial
These notes are abbreviated from a couple dozen web pages. Dig into the code or go to the tut to get more.
## express-generator
Was used to initialize the project. It sets up the workflow and directories to create a mvc app.
### Runit (bash or cmd) -- prefer bash with nodemon
* npm install
* DEBUG=locallibrary:* npm start
* DEBUG=locallibrary:* nodemon ./bin/www
* SET DEBUG=locallibrary:* npm start

### express-generator file structure
* Divieds beginning js files to include
  * app.js
  * /bin
    * www
  * routes
    * index.js
    * users.js
* The bin/www file is the top server and includes listeners

# Mongoose
    mongodb+srv://<username>:<password>@nodetut.renqw.gcp.nodemongodb.net/library?retryWrites=true&w=majority
Like everyone else, MDN tut uses Mongodb in atlas. They will use virtual properties. This is exactly the practice I need for FCC short URL thing. 
The virtual properties provide a way to change the ouput with minimal code and no need to update the db.  It allows to isolate the changeable point in an application. 
## Virtual properties example:
```JavaScript
personSchema.virtual('fullName').get(function () {
  return this.name.first + ' ' + this.name.last;
});
```
first and last are db fields. fullname is a virtual field useable by the app
### Mongoose creates a new associated connection  ...
... when you call .model to do anything. The connection works and doesn't need to be messed with
### Error First
MDN helpfully explains Mongoose uses the error first convention for callbacks.
### Create new records
* use save or create
### Modify fields
* Use save or update
### Search (same call back convention)
* Use JSON objects as search parameters
* Check for no results == null or daisy chain orFail() method
* With no callback, search returns the query without running it.
# Router is used to direct the routes
By the end of this tutorial section, all the routes are setup to respond to an address and to return a 'NOT IMPLEMNTED' statement
#### in app
* ```app.use('catalog', catalogRouter)```
#### in routes/catalog/catalog.js
* ```router.get('/asdf', author_controller.index) and router.post('wwweertte')```
#### in controllers directory
* The methods pointed to 


# Next part of the tutorial is templates.
MDN uses PUG. I opted to stick with ejs to get better at it. So I have to translate the Pug files to ejs. Means I learn more about both libs.
* ejs has no block content or inheritance. Layout stuff is all done with includes
* ```<%- jsstuff %>``` outputs unescaped stuff iuncluding html tags
* ```<%= jsstuff %>``` outputs html as a string without implementing tags
* Most everythng else is javascript plain and simple.
    * ```<% let avar= 'makeup stuff here' %>``` can be used later on the page inside tags
* This is deja vu for 2001 Accumedia and JSP. Its been a while but there is not much difference. The tags and the includes are (nearly?) identical.
### My implementation in ejs is not as good as MDN's implementation in Pug. There are at least two reasons:
* Pug has block content and ejs does not. Everything between templates in ejs is done with include
* My ejs follows the structure of the MDN tutorial. I'm sure there are better ways to strucure these pages in ejs.
* By 'not as good' I mean less maintainable as some tags, belonging properly to a layout file, are included in each template view. Changing those tags would be nightmarish in a production setting.
## List Pages for book, bookinstance, author and genre
* Edit the controller file method. e.g. controllers.genreController.genre_list()
    *  Each list method uses ```find()``` without parameters
    * Except book using ```find({}, "title, author")```. This deconstructs the return to only include title and author
* Create the view page e.g. views.genre_list.ejs
* Introduced the moment package to format date. Implemented in virtual fields in bookinstance and author models.

## Detail Pages. Mostly same except:
* Includes an id parameter in find

# Did the initial git commit ...
... at the end of Part 5 (templates) and before Part 6 (forms)
### validation will use [express-validator](https://github.com/express-validator/express-validator#express-validator)

# Forms for create stuff
### First define the create_get and create_post method for genre, author, book and bookinstance
1. Add the requires from express-generator. Note that sanitize only methods are deprectaed. Using body().escape instead of sanitizeBody().escape() (differing from MDN tut)
2. In the get methods, do the necessary finds and call render with {title:title, result(s):findResult}
3. In the post methods, 
    1. Create an array of of validations and the main callback. The methods will be called in order when sent to the exports through the router.
    2. In the main callback (req, res, next) =>{}, get the validation errors with ```validationResult()req```
    3. If errors exist, re-render the form (code will look like the get method) but add the user data and errors to render
        * The data added will be a model object populated with the data the user entered so far.
        * errors are the result of validationResult(req)
    4. If No errors:
        1. Optionally check the database for a possible  duplicate
        2. Save the new data

### Create the view as defined in the render above
#### My stumbling block
This was a frustrating point of discovery for me in translating from the pug to the ejs code:
In the pug code. looking for an undefined variable looks like:
```
if errors
  ul
    for error in errors
      li!= error.msg

```
The equvalent code in ejs reveals that pug does a bunch of stuff behind the scene:
```ejs
<% if (typeof(errors) != 'undefined') { %>
    <ul>
        <% errors.forEach(error => { %>
            <li><%= error.msg %> </li>
        <% }) %>
    </ul>
<% } %>
```
Note: this code is formatted what I would call correctly.. Unfortunately vscode has no ejs formater and the code is formatted as html in vscode: all ejs tags have no indentation either way.
The advantage of ejs remains that it *is* javascrpt and it *is* html. Obviously it lacks some elegance to retain the entire syntax of both

  
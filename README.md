# MDN Node tutorial
These notes are abbreviated from a couple dozen web pages. Dig into the code or go to the tut to get more.
## express-generator
Was used to initialize the project. It sets up the workflow and directories to create a mvc app.
### Runit (bash or cmd) -- prefer bash with nodemon
* npm install
* DEBUG=locallibrary:* npm start
* DEBUG=locallibrary:* nodemon ./bin/www
* SET DEBUG=locallibrary:* npm start

### express-generator file structure
* Divides beginning js files to include
  * app.js
  * /bin
    * www
  * routes
    * index.js
    * users.js
* The bin/www file is the top server and includes listeners

# Mongoose
    mongodb+srv://<username>:<password>@nodetut.renqw.gcp.nodemongodb.net/library?retryWrites=true&w=majority
Like everyone else, MDN tut uses Mongodb in atlas. They will use virtual properties. Good practice stuff. 
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
By the end of this tutorial section, all the routes are setup to respond to an address and to return a view.
Each route is defined using express.router. 
* In addition to '/' 
    * list and detail routes are provided for book, bookinstance, author and genre. 
    * There is get and post for each for [delete, create, update] (24 methods)
    * each of the methods are defined in one of the 4 controller pages (e.g. bookController.js ). Views are created as needed
    * Naming convention is logical and leaves no question as to the meaning of any particular file

The skeletal outline of the site defines stubs with 'NOT IMPLEMNTED' statement for each controller method
#### in app
* ```app.use('catalog', catalogRouter)```
#### in routes/catalog/catalog.js
* ```router.get('/asdf', author_controller.index) and router.post('wwweertte')```
#### in controllers directory
* The methods pointed to 
#### in views directory
* All the ejs views 


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
The advantage of ejs remains that it *is* (mostly) javascrpt and it *is* html. Obviously it lacks some elegance to retain the entire syntax of both

#### The options element
After implementing the author select drop down form element, I am reminded (again) that js sucks. Its all so squirrelly. OTOH, the MDN pug code is clean and elegant, but this stuff I just wrote is the js I remember and the pug code hides a bunch of stuff that is still there under its surface. It reminds me of the state of Windows code in the 90s -- lots of legacy stuff required because the current hip api is inadequate. The development mantra of javascript seems to be create as many ways to do things as possible and make none of them the obvious choice. 

### Delete get, post, view and link for Author, Genre, Book and BookInstance
* MDN demonstrates for Author and assigns the rest as an exercise.
Get and post both receive an id. In get, it is retrieved by the url ```req.params.id```. In post it is retrieved from the form ```req.body.authorid``` as it is named in the form.

* Retrieve the author object and all her books using async to run the two find methods. Render to the page with [title, author, author_books]. 
* In post view, if the author has books, re-render with the same variables.
    * It would be better to render the books in the get page before providing the delete button, but hey, its a tutorial.
* In post view, if there are no books for the author give an *are you sure?* and provide the delete form submit button then redirect to the author list page.
* Add the link to ./catalogs/author/:id/delete at the bottom of the author detail page
* On the view page, if there any author_books, show the books and a message. If there are no books delete.

The tutorial 'challenges' to provide delete for book, bookinstance and genre
### Each is denied if:
* Genre deletion requires no books have the genre
* Book deletion requires there is no bookinstance of the book
* Author instance requires there is no Book by the author
* BookInstance deletion requires there the bookinstance is not loaned or reserved status
## Misc Pitfalls
#### Using async.parallel
    * Send a object of functions to async parallel, get the results in the callback
    ```Javascript
    exports.arouterfunc = (req, res, next) ={
        async.parallel(err, {func1: ()=>{}, func2: ()=>{},
        }, (err, results) => {
            console.log(results.func1);
            console.log(results.func2);
        });
    }
    ```
      I think you can also send a list of functions.
    * Using it to populate data from Mongo, each find function must end with callback in the argument. If the call is daisy chained then ```<model>.x().y().exec(callback)``` is used. If not then ```<model>.find(callback)```  is fine. If the callback is absent, the errors are not helpful. The behavior I got was the call just hung.
    * My last resort debugging process was to rewrite the controller method bit by bit. On the one hand, its effective and solidifies my understanding. OTOH I think I have not yet discovered the more effecient debugging tools I need.
* Other tutorials used different asynchronous tools. I think, generally one of these approaches only should be used in a project. Its anti-zen of js.  Create as many ways to do things as possible and make none of them the obvious choice.
    * The FCC challenges used a 'done' callback out of ? library
    * The NetNinja tutorial used promises with .then() and .catch(). These are great and should be the obvious choice but the busy bodies continue to evolve the language with prejuidice and without need or pattern.
    * async does about a million other things that I don't know I need.
    * fetch 
### Problems with MDN tut html code?
* In html ```<Select><Options selected>...```  the selected attribute is existant or not. selected=false resolves to true
* Similarly in input checkbox checked, checked is there or not.
Pug code From the tut
```Pug
option(value=author._id selected=( author._id.toString()==book.author._id || author._id.toString()==book.author ) ? 'selected' : false ) #{author.name}
```
I believe (?) the selected attribute resolves in the html file to either:
```selected='selected'``` or ```selected=false```
In both cases selected is turned on. The result in my case was everything was selected, so it chose the last one. 
Similarly the checked attribute resolved to all true and everything was checked.

Here is some really ugly ejs code I used to fix up the checkboxes
```
<div class="form-group">
    <label>Genre:</label>
    <% 
    let gen_array=[];
    if (typeof(book) != 'undefined') {  
        book.genre.forEach(gen => {gen_array.push(gen.name)})
    } 
    genres.forEach(genre => { 
        let checked=null 
        if (gen_array.includes(genre.name)) { checked='checked' }
        %> 
        <div style='display: inline; padding-right:10px;'>
            <input type="checkbox" class="checkbox-input" name='genre' id="<%= genre._id %>"
                value="<%= genre._id %>" <%= checked %> >
            <label for="<%= genre._id %>"><%= genre.name %> </label>
        </div>

    <% }) %>
</div>

```
The problem with the code is the random mixing of GET and PORT variables. One possible fix for this file would be to supply the GET and POST with the same variables, just with empty values where they should be empty. OTOH display is sometimes messy period. 





  

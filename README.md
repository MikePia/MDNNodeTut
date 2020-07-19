#MDN Node tutorail
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
Like everyone else, MDN tut uses Mongodb in atlas. They will use virtual properties. Bingo-- for good practice for FCC project short url to store the malleable url path. The path will change depending on where it gets installed so it is important to isolate the changeable point. 
## Virtula properties example:
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


  

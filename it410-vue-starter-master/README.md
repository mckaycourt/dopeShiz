# IT410 Vue Starter

This is a starter template for your final projects that has the front-end build tools set up to simplify application development.

## File Structure

**`server` directory** - Contains all of your server code. Right now that isn't much. Here are some things you'll want to do inside this directory:

1. Add a router directory. Within this directory you should create a JavaScript file for each set of REST endpoints. For example, if you have a set of endpoints that have to do with a user, then create a `user.js` file that looks something like this:

    ```js
    const Router = require('express').Router;
    const router = new Router();

    module.exports = router;

    // get a user by user ID
    router.get('/:userId', (req, res) => {
        // use a controller to get the user by ID and send it back
    });
    ```

    You will also need to add a middleware to the main server file at `server/index` that uses this router. For more information check out the documentation at the bottom of this page: http://expressjs.com/en/guide/routing.html
    
2. Add a controller directory. Within this directory you will create functions that make calls to your database. This is also where your logic exists. For example, does the currently authenticated user have access to perform the operation, what information can they see, etc.

    Here is an example of a controller that gets user info by user ID:
    
    ```js
    module.exports = Users;
    
    // use dependency injection to send the database into the controller
    // to simplify testing of the controller
    function Users(database) {
        this.database = database;
    }
    
    Users.prototype.getById = function(currentUser, userId) {
        // hit the database to get the requested user by id
    }
    ```
    
3. You also need to add session management. I recommend that you use [passport](http://www.passportjs.org/) along with either [express-session-mongo](https://npmjs.com/packages/express-session-mongo) or [express-mysql-session](https://npmjs.com/packages/express-mysql-session). You can get additional details from this [sessions lesson](http://james.darktech.org/#/lessons/sessions).

4. You need to use the [express static middleware](http://expressjs.com/en/starter/static-files.html) to serve your static files.

**`src` directory** - This is where all of your front-end files will reside (except for your `index.html` file that exists in your `www` directory. This directory must be built before you can use your front-end application.

- **`components` directory** - This is where you put your Vue components.
- **`css` directory** - Place your CSS and SCSS files here. Support for SCSS already added through the build process.
- **`js` directory** - Contains your main `app.js` file that is the entry point into your app.
- **`router` directory** - Contains your Vue components that are route pages.
- **`store` directory** - Contains your Vuex store.

**`tasks` directory** - Don't worry about this directory really unless you want to customize your build process.

**`www` directory** - Contains your `index.html` file and will have your `bundle.js` file after the build completes.

## Development

The root directory contains a file `config.js` that contains all of the configuration options for your app. You'll notice that the tasks and the server use some of these configuration values.

To start your app in development mode, run the command: `npm run dev`.

Once you are ready for production run `npm run build` that will generate your `bundle.js` file and allow you to run your server in production mode by running the command `npm start`.

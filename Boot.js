var Controller = require('./handlers/Controller');
var application;

function boot(){
    application = new Controller();
    application.boot();    
}

boot();
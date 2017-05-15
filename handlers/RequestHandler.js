var TemplateHandler = require('./TemplateHandler');

class RequestHandler{

    constructor(){
        this._tmpltMgr = new TemplateHandler();
    }

    handleRequest(req, resp){
        
    }

}

module.exports = RequestHandler;

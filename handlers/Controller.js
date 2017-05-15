/**
    Quorum-Workbench - Quorum network management and administration
    Copyright (C) 2017  Ashfaq Ahmed Shaik

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
* +--------------------------------------------------------------+
*  Controller - Express JS controller / routing 
*  Version : v1.0.0-Alpha
*  Author  : Ashfaq Ahmed S [https://github.com/0yukikaze0]
* +--------------------------------------------------------------+
*/

var path        = require('path');
var config      = require('config');
var express     = require('express');
var bodyParser  = require('body-parser');
var logger      = require('../Logger.js');
var exhb        = require('express-handlebars');

class Controller{

    constructor(){
        logger.info('Initializing application');
        this._app           =   express();
        this._viewEngine    =   exhb.create({layoutsDir : '../assets/markup/'})
    }

    boot(){
        logger.info('Executing boot routines');
        
        this._bootExpress()
            .then(  (response)  => this._startListening(),
                    (err)       => {logger.error(err); process.exit(1)})
            .then(  (response)  => this._registerRoutes(),
                    (err)       => {logger.error(err); process.exit(1)})
    }

    _bootExpress(){
        return new Promise((respond,reject) => {
            try{                
                this._app.use(bodyParser.json());
                this._app.use(express.static('assets')); 
                this._app.use(bodyParser.urlencoded({extended:true}));
                this._app.engine('html', this._viewEngine.engine);
                this._app.set('view engine', 'handlebars');
                this._app.set('views', path.join(__dirname, '/../assets','markup'));
                respond()
            }catch(e){                
                reject(e);
            }
            
        });
    }

    _startListening(){
        return new Promise((respond,reject) => {
            try{
                this._app.listen(config.get('server.port'), () => {
                    logger.info('Workbench is listening on ' + config.get('server.port'));
                    respond();
                })
            }catch(e){
                reject(e);
            }  
        });
        
    }

    _registerRoutes(){
        this._app.get('/', (req, resp) => {
            resp.render('index.html', {user:"samaritan"})
        });
    }

}

module.exports = Controller;
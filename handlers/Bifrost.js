/**
    Quorum-Workbench - Bifrost Network request/response manager
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
*  Bifrost - Utility:Network request/response manager
*  Version : v1.0.0-Alpha
*  Author  : Ashfaq Ahmed S [https://github.com/0yukikaze0]
*  Description :    This network management utitlity talks to a 
*                   unix socket on the same host machine. 
*
*                   Keeping in mind the security concerns,
*                   Connectivity to docker via tcp is not implemented
*                   and isnt part of any future implementation plan.
*
*                   This program doesnt take security into consideration.
*                   Please make sure you have proper access controls in
*                   place.
* +--------------------------------------------------------------+
*/

var config  = require('config');
var request = require('request');
var qs      = require('querystring');

const GET       = 'GET';
const POST      = 'POST';
const PUT       = 'PUT';
const DELETE    = 'DELETE';

class Bifrost{
    constructor(){}

    /**
     * @function {_transmitRequest}
     * @param  {string} method {HTTP Method}
     * @param  {string} path   {URI path}
     * @param  {object} params {parameter map}
     * @return {Promise} 
     */
    transmitRequest(method, path, params) {
        return new Promise((respond, reject) => {
            if(method === GET){
                this._transmitGetRequest(path, params)
                    .then(  (result)    => respond(result),
                            (err)       => reject(err));
            } else if(method === POST){
                this._transmitPostRequest(path, params)
                    .then(  (result)    => respond(result),
                            (err)       => reject(err));
            } else if(method === DELETE){
                this._transmitDeleteRequest(path, params)
                    .then(  (result)    => respond(result),
                            (err)       => reject(err));
            }
        })
    }

    /**
     * @function {_transmitDeleteRequest}
     * @param  {string} path   {HTTP URI path}
     * @param  {string} params {Parameter map}
     * @return {Promise}
     */
    _transmitDeleteRequest(path, params) {
        return new Promise((respond,reject) => {
             request.delete({
                url: `http://unix:${config.get('docker.socketPath')}:${path}`,
                body: params,
                json:true,                
                headers: { host: 'http' }
            }, (err, resp, body) => {
                if (err) {
                    reject(err)
                } else {
                    respond(body);
                }
            });
        });
    }

    /**
     * Transmits a POST request to URI and returns a promise
     * @function {_transmitPostRequest}
     * @param  {string} path   {HTTP URI path}
     * @param  {object} params {Parameter map}
     * @return {Promise} 
     */
    _transmitPostRequest(path, params) {
        return new Promise((respond,reject) => {
            request.post({
                url: `http://unix:${config.get('docker.socketPath')}:${path}`,
                body: params,
                json:true,                
                headers: { host: 'http' }
            }, (err, resp, body) => {
                if (err) {
                    reject(err)
                } else {
                    respond(body);
                }
            });
        });
    }

    /**
     * @function {_transmitGetRequest}
     * @param  {string} path   {HTTP URI path}
     * @param  {object} params {Parameter map}
     * @return {Promise} 
     */
    _transmitGetRequest(path, params){
        return new Promise((respond,reject) => {
            try{
            let qsJson      = {};
            let qsString    = '';
            if( typeof params === 'string'){
                qsString = '?' + params;
                console.log(qsString)
            } else {
                console.log('Object')
                qsJson = params;
            }
            request.get({
                url: `http://unix:${config.get('docker.socketPath')}:${path}${qsString}`,
                qs: qsJson,
                headers: { host: 'http' }
            }, (err, resp, body) => {
                if (err) {
                    reject(err)
                } else {
                    respond(JSON.parse(body));
                }
            })  
            }catch(e){console.log(e)}
        });
    }
}

module.exports = Bifrost;
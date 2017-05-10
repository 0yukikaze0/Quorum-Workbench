/**
    Quorum-Workbench - Docker connectivity client (docker-connect)
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
*  Docker engine connectivity client 
*  Version : v1.0.0-Alpha
*  Author  : Ashfaq Ahmed S [https://github.com/0yukikaze0]
* +--------------------------------------------------------------+
*/
var config      = require('config');
var Bifrost     = require('./Bifrost')

const GET       = 'GET';
const POST      = 'POST';
const PUT       = 'PUT';
const DELETE    = 'DELETE';

let bifrost;
class DockerConnect {

    constructor() {
        bifrost = new Bifrost();
        
    }

    /**
     * Returns an array of all available docker images
     * @function {getAllImages}
     * @return {Promise}
     */
    getAllImages() {
        return new Promise((respond, reject) => {
            let images = [];
            bifrost.transmitRequest(GET,'/images/json')
                .then(  (response)  => respond(response),
                        (err)       => reject(err) );
        })        
    }

    /**
     * Returns an array of all docker containers
     * @function {getAllContainers}
     * @return {Promise}
     */
    getAllContainers() {
        return new Promise((respond, reject) => {            
            bifrost.transmitRequest(GET,'/containers/json', {all:true})
                .then(  (response)  => respond(response),
                        (err)       => reject(err) );
        })
    }
    
    /**
     * Returns list of current docker networks
     * @function {getNetworkListing}
     * @return {Promise}
     */
    getNetworkListing() {
        return new Promise((respond,reject) => {
            bifrost.transmitRequest(GET, '/networks')
                .then(  (networks)  => respond(networks),
                        (err)       => reject(err)  );
        });
    }
    
    /**
     * Returns metadata for a network
     * @function {inspectNetwork}
     * @return {Promise}
     */
    inspectNetwork(networkName) {
        return new Promise((respond,reject) => {
            networkName = networkName.replace(/ /g,'_');            
            bifrost.transmitRequest(GET, '/networks',`filters={"name":{"${networkName}":true}}`)
                .then(  (networks)  => respond(networks),
                        (err)       => reject(err)  );
        });
    }

    /**
     * Creates a docker network with 
     * @function {createNetwork}
     * @param  {string} networkName {Name of the network}
     * @return {Promise} {Promise with network id}
     */
    createNetwork(networkName) {
        return new Promise((respond,reject) => {
            networkName = networkName.replace(/ /g,'_');
            bifrost.transmitRequest(POST, '/networks/create', {Name:networkName,Driver:"bridge"})
                .then(  (result)    => {console.log(result), respond(result)},
                        (err)       => {console.log(err); reject(err)})

        });
    }

    /**
     * Creates a docker network with 
     * @function {deleteNetwork}
     * @param  {string} networkName {Name of the network}
     * @return {Promise}
     */
    deleteNetwork(networkName) {
        return new Promise((respond,reject) => {
            networkName = networkName.replace(/ /g,'_');
            this.inspectNetwork(networkName)
                .then( (result) => {
                    if(result.length > 0){
                        let networkId = result[0].Id;
                        console.log(networkId)
                        bifrost.transmitRequest(DELETE, `/networks/${networkId}`)
                            .then(  (result)    => respond(result),
                                    (err)       => reject(err));
                    } else {
                        console.log('Network doesnt exist')
                    }
                })
        });
    }
    
}

module.exports = DockerConnect;
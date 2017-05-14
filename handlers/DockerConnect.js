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

    /* +----------------------------------------------------------------------+
     *  Image Operations
     * +----------------------------------------------------------------------+ */
    
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
    
    /* +----------------------------------------------------------------------+ */
    
    /* +----------------------------------------------------------------------+
     *  Container Operations
     * +----------------------------------------------------------------------+ */
    
    /**
     * Returns a JSON listing of all docker containers
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
     * @function {getConatainersByStatus}
     * @param  {string | array} Status List {comma separated string or array}
     * @return {Promise}
     */
    getContainersByStatus(statusList){
        return new Promise((respond,reject) => {
            let statusFilter = [];
            if(typeof statusList === 'string'){
               if(statusList.includes(',')){
                   let listing = statusList.split(',');
                   statusFilter = listing;
               } else {
                   statusFilter.push(statusList);
               }
            } else if (typeof statusList === 'object'){
               statusFilter = statusList;
            }

            bifrost.transmitRequest(GET, '/containers/json', `filters={"status":${JSON.stringify(statusFilter)}}`)
                .then(  (response)  => respond(response),
                        (err)       => reject(err) );
        });
    }

    /**
     * @function {createContainer}
     * @param  {Object} Request parameters packed into JSON {Name of the container}
     * @return {Promise} 
     */
    createContainer(params) {
        return new Promise((respond,reject) => {
            
            let containerName = params.containerName.replace(/ /g,'_');
            
            /** Build request */
            let request = {
                "Image" : params.image,
                "Cmd" : params.cmd,
                "AttachStdout" : params.detached,
                "Tty" : params.tty,
                "HostConfig":{
                    "Binds" : params.mounts,
                    "PortBindings" : params.ports,
                    "NetworkMode" : params.networkName 
                }
            }
            bifrost.transmitRequest(POST, '/containers/create', request, `name=${containerName}`)
                .then(  (response)  => respond(response),
                        (err)       => reject(err) );
        });
    }

    /**
     * Starts a container matching the provided name/id
     * @function {startContainer}
     * @param  {string} containerName | Id {Name or Id of the container to start}
     * @return {Promise} {description}
     */
    startContainer(container) {
        return new Promise((respond,reject) => {
            bifrost.transmitRequest(POST, `/containers/${container}/start`,{})
                .then(  (response)  => respond(response),
                        (err)       => reject(err) );
        });
    }
    
    /**
     * Stops a container matching the provided name/id
     * @function {stopContainer}
     * @param  {string} containerName | Id {Name or Id of the container to start}
     * @return {Promise} {description}
     */
    stopContainer(container) {
        return new Promise((respond,reject) => {
             bifrost.transmitRequest(POST, `/containers/${container}/stop`,{})
                .then(  (response)  => respond(response),
                        (err)       => reject(err) );
        });
    }
    /* +----------------------------------------------------------------------+ */

    /* +----------------------------------------------------------------------+
     *  Network Operations
     * +----------------------------------------------------------------------+ */
    
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
                .then(  (result)    => respond(result),
                        (err)       => reject(err)  )

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
                                    (err)       => reject(err)  )
                    } else {
                        console.log('Network doesnt exist')
                    }
                })
        });
    } 
    
    /* +----------------------------------------------------------------------+ */

    

    
    
}

module.exports = DockerConnect;
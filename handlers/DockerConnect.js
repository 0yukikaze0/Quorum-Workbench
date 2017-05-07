var config  = require('config');
var request = require('request');

class DockerConnect {
    constructor() {}

    /**
     * Returns an array of all available docker images
     * @return array
     */
    getAllImages() {
        return new Promise((respond, reject) => {
            let images = [];
            this._transmitRequest('GET','/images/json')
                .then((response) => {
                        response.forEach((imageEntry) => {
                            imageEntry.RepoTags.forEach((tag) => {
                                images.push(tag);
                            }, this);
                        }, this);
                        respond(images);
                    },(err) => {
                        console.log(err);
                        reject();
                    })        
        })        
    }

    _transmitRequest(method, path) {
        return new Promise((respond, reject) => {
            request({
                method: method,
                url: `http://unix:${config.get('docker.socketPath')}:${path}`,
                headers: { host: 'http' }
            }, (err, resp, body) => {
                if(err){
                    reject(err)
                } else {
                    respond(JSON.parse(body));
                }
            })
        })
    }
}

module.exports = DockerConnect;
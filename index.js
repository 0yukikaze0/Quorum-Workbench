var request = require('request');
var config  = require('config');
var dockerConnect = require('./handlers/DockerConnect');

var docker = new dockerConnect();
//docker.getAllImages().then((images) => { console.log(images)})
//docker.getAllContainers().then((containers) => {console.log(containers)})
//docker.getNetworkListing().then((networks) => {console.log(networks)})
docker.deleteNetwork('New Test Network').then((result) => {console.log(result)})
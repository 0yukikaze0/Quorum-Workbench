var request = require('request');
var config  = require('config');
var dockerConnect = require('./handlers/DockerConnect');

var docker = new dockerConnect();
//docker.getAllImages().then((images) => { console.log(images)})
//docker.getAllContainers().then((containers) => {console.log(containers)})
//docker.getContainersByStatus('created,restarting,running,removing,paused,exited,dead').then((containers) => {console.log(containers)})
//docker.getContainersByStatus('created').then((containers) => {console.log(containers)})
//docker.getNetworkListing().then((networks) => {console.log(networks)})
//docker.createNetwork('MyTest Network').then((result) => {console.log(result)})
//docker.deleteNetwork('MyTest Network').then((result) => {console.log(result)})

var contReq = {
    containerName : "My New Test Container",
    image : "ubuntu:16.04",
    tty : true,
    detached : true,
    cmd : [],
    mounts : ["/home/quorum:/data/xyz"],
    ports : {
        "22000/tcp":[{"HostPort":"25000"}]
    },
    networkName : "TestNet"
}

//docker.createContainer(contReq).then((containers) => {console.log(containers)})
//docker.startContainer('My_New_Test_Container').then((result) => {console.log(result)})
docker.stopContainer('My_New_Test_Container').then((result) => {console.log(result)})
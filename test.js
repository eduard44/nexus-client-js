var nc = require('./NexusClient');

var client1 = new nc();

client1.fetch(function (collection) {
    console.log(collection.getKeyAsJson('properties.json'));
});
var redis = require('redis');

var redisClient = redis.createClient(); //creates a new client
redisClient.on('connect', function() {
  console.log('redis connected');
});

localRedis = redis;

var redisSub = redis.createClient();
var redisPub = redis.createClient();

var COMMS_MAIN = {};

// - - Insert a new Event in the Events table
COMMS_MAIN.connect = function(socket) {
  console.log('COMMS_MAIN!!');
  socket.emit('working', { hello: 'world' });

  redisSub.subscribe("playTrailer");
  redisSub.subscribe("snapFace");
  redisSub.subscribe("requestExperience");
  redisSub.subscribe("requestEndExperience");

  redisSub.on("message", function(channel, message){
    if(channel == "playTrailer"){
      socket.emit('playTrailer', message);
    }

    if(channel == "snapFace"){
      socket.emit('snapFace', message);
    }

    if(channel == "requestExperience"){
      console.log("START!@!");
      socket.emit('startExperience', message);
    }

    if(channel == "requestEndExperience"){
      console.log("END!@!");
      socket.emit('endExperience', message);
    }
  });

  socket.on('requestTrailer', function(message){
    console.log('REQ TRAILER ~~~~~~~~~~~~');
    console.log(message);
    redisPub.publish("playTrailer", message);
  });

  socket.on('snapFace', function(message){
    console.log('SNAP FACE ~~~~~~~~~~~~');
    console.log(message);
    redisPub.publish("snapFace", message);
  });

  socket.on('requestExperience', function(message){
    console.log('START EXPERIENCE ~~~~~~~~~~~~');
    console.log(message);
    redisPub.publish("requestExperience", "requestExperience");
  });

  socket.on('requestEndExperience', function(message){
    console.log('END EXPERIENCE ~~~~~~~~~~~~');
    console.log(message);
    redisPub.publish("requestEndExperience", message);
  });
}

module.exports = COMMS_MAIN

var login = require("facebook-chat-api");
var rest = require('restler');

var extensions = [
  {
    "name": "Giphy",
    "icon": "/icons/giphy.png",
    "endpoint": "https://vast-dusk-6334.herokuapp.com/giphy",
    "description": "Retrieve a random gif for a keyword",
    "shortcut": "/giphy",
    "parse": function (query, message) {
      return {text: query};
    }
  }, {
    "name": "Cats",
    "icon": "/icons/cats.png",
    "endpoint": "https://vast-dusk-6334.herokuapp.com/cats",
    "description": "Retrieve a random cat gif",
    "shortcut": "/cats",
    "parse": function (query, message) {
      return {};
    }
  }, {
    "name": "Venmo Charge",
    "icon": "/icons/venmo.png",
    "endpoint": "https://vast-dusk-6334.herokuapp.com/venmo-charge",
    "description": "Create a Venmo Charge with your username", // user amount
    "shortcut": "/venmo-charge",
    "parse": function (query, message) {
      query = query.split(" ");
      return {user: query[0], amount: query[1]};
    }
  }, {
    "name": "Venmo Pay",
    "icon": "/icons/venmo.png",
    "endpoint": "https://vast-dusk-6334.herokuapp.com/venmo-pay",
    "description": "Share your Venmo Profile", // user
    "shortcut": "/venmo-pay",
    "parse": function (query, message) {
      return {user: query[0]};
    }
  }, {
    "name": "Uber Me",
    "icon": "/icons/uber.png",
    "endpoint": "https://vast-dusk-6334.herokuapp.com/uber-me",
    "description": "Send an Uber to your location", //lat lng name
    "shortcut": "/uber-me",
    "parse": function (query, message) {
      console.log(message);
    }
  }, {
    "name": "Spotify Artist",
    "icon": "/icons/Spotify.png",
    "endpoint": "https://vast-dusk-6334.herokuapp.com/sa",
    "description": "Share Spotify Artist",
    "shortcut": "/spotify-artist",
    "parse": function (query, message) {
      return {text: query};
    }
  }, {
    "name": "Spotify Track",
    "icon": "/icons/Spotify.png",
    "endpoint": "https://vast-dusk-6334.herokuapp.com/st",
    "description": "Share Spotify Tracks",
    "shortcut": "/spotify-track",
    "parse": function (query, message) {
      return {text: query};
    }
  }, {
    "name": "Yelp",
    "icon": "/icons/yelp.png",
    "endpoint": "https://vast-dusk-6334.herokuapp.com/raw",
    "description": "Get restaurant recommendations", //type: raw
    "shortcut": "/yelp",
    "parse": function (query, message) {
      return {text: query, type: "raw"};
    }
  }
];

login({email: process.env.EMAIL, password: process.env.PASSWORD}, function (err, api) {
  if (err) return console.error(err);

  api.listen(function callback(err, message) {
    parse(message, function (response) {
      if (response) {
        api.sendMessage(response, message.thread_id);
      }
    });
  });
});

function parse(message, callback) {
  var text = message.body;
  for (var i = 0; i < extensions.length; i++) {
    var extension = extensions[i];
    if (text.indexOf(extension.shortcut) == 0) {
      console.log(extension);
      var query = text.substring(extension.shortcut.length + 1);
      var data = extension.parse(query, message);
      rest.post(extension.endpoint, {data: data}).on('complete', function (data) {
        console.log(data);
        if (data.results && data.results.length > 0) {
          callback(data.results[0].text);
        }
      });
      break;
    }
  }
}

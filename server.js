//Require Statments
var express = require('express');

//Create a new instance of express
var app = express();

var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

//object that has two methods
//add method- this creates an item object that pushes that item into the users item array
//register method-this method creaates a user object and pushes it to the users array 

var Storage = {
  add: function(name,user) {
    var item = {
        name: name, 
        id: this.setId
    };
    user['items'].push(item);
    this.setId += 1;
    return item;
  },
  register: function(username){

    var user = {
      username:username,
      items:[]
    };

    //pushes user into the users storage array  
    this.users.push(user);

  }

};

//create storage object extends Storage Object 
//storage.users creates an empty array which registerd users will be pushed to

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items   = [];
  storage.users = [];
  storage.setId = 1;
  return storage;
}

//Registerd two users Alex and Jesus
var storage = createStorage();
storage.register('Alex');
storage.register('Jesus');

//Adding items to a specififc user 
//Alex Data----------------------------------
storage.add('Broad beans',storage.users[0]);
storage.add('Tomatoes',storage.users[0]);
storage.add('Peppers',storage.users[0]);

//Jesus Data----------------------------------
storage.add('chicken',storage.users[1]);
storage.add('stuff',storage.users[1]);
storage.add('things',storage.users[1]);

//this is a call to the index.html file that is in the public folder 
app.use(express.static('public'));

/*This is my items get route this will show 
all the users in Alexs array
did it this way just because the ui was not set up to register users
it was just an extension test case*/
app.get('/items', function(request, response) {
  
  response.json(storage.users[0].items);

});

//This is the users route this will show Alex and Jesus with all 
//the items they both have in their storage array*/
app.get('/users', function(request, response){

  response.json(storage.users);

});

//This Route will take and comepare the name of the user
//to the id that was entered and display that particular
//users array of items
app.get('/users/:name', function(request, response){

  var username = request.params.name;
  
  for(var i = 0; i < storage.users.length;i++){

    if(storage.users[i].username===username){

      response.json(storage.users[i]);

    }
  }
});

//This route will post items to Alex array again the registered
//Jesus user is test data for extension test
app.post('/items', jsonParser, function(request, response) {

    if (!('name' in request.body)) {

        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name,storage.users[0]);

    response.status(201).json(item);
});

//This route will delete an items from Alex's list of array items
//Again this was set up like this as to allow for expansion test data 
app.delete('/items/:id',function(request, response){
  
  //this gives me the id of what i clicked on 
  // console.log("Look at me "+storage.items[request.params.id-1].id);//this is the index using that id -1 since that id starts at 1 
  // console.log(storage.items);//this is the array of itmes in the items array 

  var item = parseInt(request.params.id)

  for(var i = 0;i < storage.users[0].items.length;i++){

    if(item === storage.users[0].items[i].id){

      storage.users[0].items.splice(i,1);

    } 

  }

  response.json(storage.users[0].items);

});

app.put('/items/:id',jsonParser,function(request, response){

  var item = parseInt(request.params.id);

  var updated = request.body;

  console.log(updated);

  for(var i = 0;i < storage.users[0].items.length;i++){

    if(item === storage.users[0].items[i].id){

        storage.users[0].items[i] = updated;

    } 
  }

response.json(storage.users[0].items);      

});

app.listen(process.env.PORT || 8080, process.env.IP);





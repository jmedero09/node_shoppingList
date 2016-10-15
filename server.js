var express = require('express');

var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

//object that has two methods
//add method- this creates an item object that pushes that item into the users item array
// register method-this method creaates a user object and pushes it to the users array 

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
//storage.users creates an empty array
var createStorage = function() {
  var storage = Object.create(Storage);
  //storage.items   = [];
  storage.users = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();
storage.register('Alex');
storage.register('Jesus');

storage.add('Broad beans',storage.users[0]);
storage.add('Tomatoes',storage.users[0]);
storage.add('Peppers',storage.users[0]);

storage.add('chicken',storage.users[1]);
storage.add('stuff',storage.users[1]);
storage.add('things',storage.users[1]);

console.log("this is whats in your storage.users "+storage.users[0]);

//creates an instance of express similar to using the new keyword
//this is where we start creating our routes using express.js
var app = express();

app.use(express.static('public'));

app.get('/items', function(request, response) {

    //this returns the updatd array of items
    response.json(storage.items);
});

app.get('/users', function(request, response){

  response.json(storage.users);

});

app.get('/users/:name', function(request, response){

  var username = request.params.name;
  
  for(var i = 0; i < storage.users.length;i++){

    if(storage.users[i].username===username){

      response.json(storage.users[i]);

    }
  }
});

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);

    }

    var item = storage.add(request.body.name);

    console.log(request.body);

    response.status(201).json(item);
});

app.delete('/items/:id',function(request, response){
  
   console.log("clicked id "+request.params.id);//this gives me the id of what i clicked on 
   console.log("Look at me "+storage.items[request.params.id-1].id);//this is the index using that id -1 since that id starts at 1 
  // console.log(storage.items);//this is the array of itmes in the items array 
  var item = parseInt(request.params.id)

  for(var i = 0;i < storage.items.length;i++){

    if(item === storage.items[i].id){

        storage.items.splice(i,1);

        //returns the new array after we have deleted from it 
    } 

  }
  response.json(storage.items);

});

app.put('/items/:id',jsonParser,function(request, response){

  var item = parseInt(request.params.id);

  var updated = request.body;

  for(var i = 0;i < storage.items.length;i++){

    if(item === storage.items[i].id){

        storage.items[i] = updated;

              
    } 
  }

response.json(storage.items);      

});

app.listen(process.env.PORT || 8080, process.env.IP);


















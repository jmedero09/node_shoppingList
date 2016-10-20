var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
//app is the app from server.js that requ
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);
//QUESTIONS TO ASK: WHAT IS THIS RES CALLING
//WHAT THAT ERR THAT WE PASS INTO THE FUNCTION 
//ALSO IS THERE A BEST PRACTISE OF THINGS TO LOOK FOR WHEN TESTING 
describe('Shopping List', function() {
it('should list items on GET', function(done) {
    chai.request(app)
        .get('/items')
        .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.have.length(3);
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('id');
            res.body[0].should.have.property('name');
            res.body[0].id.should.be.a('number');
            res.body[0].name.should.be.a('string');
            res.body[0].name.should.equal('Broad beans');
            res.body[1].name.should.equal('Tomatoes');
            res.body[2].name.should.equal('Peppers');
            done();
        });
});
it('should add an item on POST',function(done){
	chai.request(app)
		.post('/items')
		.send({'name':'kale'})
		.end(function(err,res){
			should.equal(err,null);
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.have.property('name');
			res.body.should.have.property('id');
			res.body.name.should.be.a('string');
			res.body.id.should.be.a('number');
			res.body.name.should.equal('kale');
			storage.items.should.be.a('array');
			//the number is 4 because we added the kale

			storage.users[0].items.should.have.length(4);
			storage.users[0].items[3].should.be.a('object');
			storage.users[0].items[3].should.have.property('id');
			storage.users[0].items[3].should.have.property('name');
			storage.users[0].items[3].id.should.be.a('number');
			storage.users[0].items[3].name.should.be.a('string');
			storage.users[0].items[3].name.should.equal('kale');
			//console.log(storage.item[3]);
			done();
		});

});
it('should edit an item on PUT',function(done){
	chai.request(app)
		.get('/items')
		.end(function(err,res){
			chai.request(app)
				.put('/items/'+res.body[3].id)
				.send({'name':'jesus','id':7})
				.end(function(err,res){
	            	should.equal(err, null);
	            	res.should.have.status(200);
	            	res.should.be.json;
	            	res.body.should.be.a('array');
					res.body[3].should.have.a.property('name');
					res.body[3].should.have.a.property('id');
					res.body[3].name.should.be.a('string');
					res.body[3].id.should.be.a('number');
					res.body[3].name.should.equal('jesus');

					storage.users[0].items.should.have.length(4);
					storage.users[0].items.should.be.a('array');
					storage.users[0].items[3].should.have.property('id');
					storage.users[0].items[3].should.have.property('name');
					storage.users[0].items[3].name.should.equal('jesus');
					storage.users[0].items[3].id.should.equal(7);

					//console.log(res.body[3].id);

           			done();	
			});
		});
});
it('should delete an item on DELETE',function(done){
	chai.request(app)
		.get('/items')
		.end(function(err,res){
			chai.request(app)
				.delete('/items/'+res.body[3].id)
				.end(function(err,res){
	            	should.equal(err, null);
	            	res.should.have.status(200);
	            	res.should.be.json;
	    			res.body.should.be.a('array');
					storage.users[0].items.should.have.length(3);
           			done();	
			});
		});
});

});
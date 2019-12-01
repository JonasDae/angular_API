/***************************************************************
**	Opens at http://localhost:8081
**	
**	SQL connection in ./runsql.sh
**
**	You mess up POST body you get to keep the pieces.
**
** MAPPINGS:
**	GET:
**		/users/				// get all users
**		/user/ID			// get user by id
**		/userdel/ID			// delete user by id
**
**		/polls				// get all polls
**		/poll/ID			// get poll by id
**
**		/answers			// get all answers 
**		/answer/ID			// get answer  by ID
**		/answersbypoll/ID	// get answers by poll id
**		/answerdel/ID		// delete answer by id
**
**		/votes				// get all votes
**		/votesbyanswer/ID	// get votes by answer id
**		/votesbyuser/ID		// get votes by user id
**		/votedel/ID			// delete vote by ID
**	POST:
**		/useradd/			// add user
**							// BODY: name=XXX,secret=XXX,email=XXX
**		/userchange/ID		// update user
**							// BODY: name=XXX,secret=XXX,email=XXX
**
**		/polladd/			// add poll
**							// BODY: name=XXX,owner=123
**		/pollchange/ID		// update poll
**							// BODY: name=XXX,owner=123
**
**		/answeradd/			// add answer
**							// BODY: answer=XXX,pollid=123
**		/answerchange/ID	// update answer
**							// BODY: answer=XXX,pollid=123
**
**		/voteadd/			// add vote
**							// BODY: answerid=123,userid=123
***************************************************************/


var express = require('express');
var app = express();
var parser = require('body-parser');
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
var exec = require('child_process').execSync;

var sqlcmd = function(args) {
	
	var p = exec('csvq -f JSON ' + '"' + args + '"');
	return p;
};

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
	res.set('Content-Type', 'text/json');
    next();
});


// user API
app.get('/users', function(req, res) {
	var args = "SELECT * FROM user";
	var out = sqlcmd([args]);
	res.end(out);
});
app.get('/user/:id', function(req, res) {
	var args = "SELECT * FROM user WHERE id = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});
app.post('/useradd/', function(req, res) {
	var args = "INSERT INTO user VALUES((SELECT MAX(id)+1 FROM user),\\\"" + req.body.name + "\\\",\\\"" + req.body.secret + "\\\",\\\"" + req.body.email + "\\\");";
	var out = sqlcmd([args]);
	res.end();
});
app.post('/userchange/:id', function(req, res) {
	var args = "UPDATE user SET name=\\\"" + req.body.name + "\\\",secret=\\\"" + req.body.secret + "\\\",email=\\\"" + req.body.email + "\\\" WHERE id = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});
app.get('/userdel/:id', function(req, res) {
	var args = "DELETE FROM user WHERE id = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});

// polls API
app.get('/polls', function(req, res) {
	var args = "SELECT * FROM poll";
	var out = sqlcmd([args]);
	res.end(out);
});
app.get('/poll/:id', function(req, res) {
	var args = "SELECT * FROM poll WHERE id = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});
app.post('/polladd/', function(req, res) {
	var args = "INSERT INTO poll VALUES((SELECT MAX(id)+1 FROM poll),\\\"" + req.body.name + "\\\",\\\"" + req.body.owner + "\\\");";
	var out = sqlcmd([args]);
	res.end();
});
app.post('/pollchange/:id', function(req, res) {
	var args = "UPDATE poll SET name=\\\"" + req.body.name + "\\\",owner=\\\"" + req.body.owner + "\\\" WHERE id = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});

// answers API
app.get('/answers', function(req, res) {
	var args = "SELECT * FROM answer";
	var out = sqlcmd([args]);
	res.end(out);
});
app.get('/answer/:id', function(req, res) {
	var args = "SELECT * FROM answer WHERE id = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});
app.get('/answersbypoll/:id', function(req, res) {
	var args = "SELECT * FROM answer WHERE pollid = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});
app.get('/answerdel/:id', function(req, res) {
	var args = "DELETE FROM answer WHERE id = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});
app.post('/answeradd/', function(req, res) {
	var args = "INSERT INTO answer VALUES((SELECT MAX(id)+1 FROM answer),\\\"" + req.body.answer+ "\\\",\\\"" + req.body.pollid+ "\\\");";
	var out = sqlcmd([args]);
	res.end();
});
app.post('/answerchange/:id', function(req, res) {
	var args = "UPDATE answer SET answer=\\\"" + req.body.answer+ "\\\",pollid=\\\"" + req.body.pollid+ "\\\" WHERE id = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});

// votes API
app.get('/votes', function(req, res) {
	var args = "SELECT * FROM vote";
	var out = sqlcmd([args]);
	res.end(out);
});
app.get('/votesbyanswer/:id', function(req, res) {
	var args = "SELECT * FROM vote WHERE answerid = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});
app.get('/votesbyuser/:id', function(req, res) {
	var args = "SELECT * FROM vote WHERE userid = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});
app.get('/votedel/:id', function(req, res) {
	var args = "DELETE FROM vote WHERE id = " + req.params.id;
	var out = sqlcmd([args]);
	res.end(out);
});
app.post('/voteadd/', function(req, res) {
console.log(req.body);
	var args = "INSERT INTO vote VALUES((SELECT MAX(id)+1 FROM vote),\\\"" + req.body.answerid+ "\\\",\\\"" + req.body.userid+ "\\\");";
	var out = sqlcmd([args]);
	res.end();
});

// start server
var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("started at http://%s:%s", host,port);
});

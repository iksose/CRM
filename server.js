var express = require('express')
    , path = require('path')
    , basic_routes = require('./routes/user')
    , userList = require('./api/userlist')
    , campaigns = require('./api/campaigns')
    , prospects = require('./api/prospects')
    , tasks = require('./api/tasks')
    , queries = require('./api/savedQueries')


var app = module.exports = express();
var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/client/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
// app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.session({ secret: 'keyboard cat' }));
app.use(app.router);

// clearly denote public content
app.use(express.static(path.join(__dirname, 'client')));

// Basic pages
app.get('/', basic_routes.index);


app.post('/api/login', userList.findOne)

app.get('/api/users', userList.findAll)

app.get('/api/campaigns', campaigns.allCampaigns)

app.post('/api/singlecampaign', campaigns.singleCampaign)

app.get('/api/prospect', prospects.one)
//
// app.delete('/api/prospects', prospects.returnProspects)

// app.get('/api/randomProspect', prospects.randomProspect)

app.post('/api/usertasks', tasks.userTasks)

app.post('/api/taskdetails', tasks.singleTask)

app.get('/api/alltasks', tasks.alltasks)

app.get('/api/thisQuery', queries.returnQueryResults)

app.post('/api/queries', queries.saveQuery)

app.get('/api/queries', queries.getQueries)

app.get('/api/query/:queryid', queries.singleQuery)


server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

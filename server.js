var express = require('express')
    , path = require('path')
    , basic_routes = require('./routes/user')
    , userList = require('./api/userlist')
    , campaigns = require('./api/campaigns')
    , prospects = require('./api/prospects')
    , tasks = require('./api/tasks')


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

app.get('/api/campaigns', campaigns.allCampaigns)

app.post('/api/singlecampaign', campaigns.singleCampaign)

app.get('/api/prospects', prospects.returnProspects)

app.get('/api/randomProspect', prospects.randomProspect)

app.post('/api/usertasks', tasks.userTasks)

app.post('/api/taskdetails', tasks.singleTask)

app.get('/api/alltasks', tasks.alltasks)


server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

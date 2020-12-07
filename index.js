var express = require('express');
var bodyParser = require('body-parser');
var dataStore = require('nedb');

const expressSwagger = require('express-swagger-generator');

var port = (process.env.PORT || 3000);
var BASE_API_PATH = "/api/v1";
var DB_FILE_NAME = __dirname + "/contacts.json";

let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        basePath: BASE_API_PATH,
        produces: [
            "application/json"
        ],
        schemes: ['http', 'https'],
		securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['*.js'] //Path to the API handle folder
};



console.log("Starting API server...")

var app = express();
app.use(bodyParser.json());

var db = new dataStore({
    filename: DB_FILE_NAME,
    autoload: true
})

app.get("/", (req, res) => {
    res.send ("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/contacts", (req, res) => {
    console.log(Date() + "- GET /contacts");
    db.find({}, (err,contacts) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.send(contacts.map((contact) => {
                delete contact._id;
                return contact;
            }));
        }
    })
});

app.post(BASE_API_PATH + "/contacts", (req, res) => {
    console.log(Date() + "- POST /contacts");
    var contact = req.body;
    db.insert(contact, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
    
});

expressSwagger(options).
app.listen(port);
console.log("Server ready!");
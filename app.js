// imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// inicializamos la conexion con firebase
// necesitamos json con las credenciales 
var admin = require('firebase-admin');
var serviceAccount = require('./dbfirebase.json');
admin.initializeApp({

    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://msgdam-3ee9f.firebaseio.com/'
});
//Aqui vamos a guardar en estas varibles la informacion del ultimo registro
var db = admin.database();
var ref = db.ref("/registro");
var id = null;
var resultado=null;
var tokenpropio =null;
ref.on( "child_changed", function(snapshot) {
    console.log("dentro de la funcion:" + snapshot.key);
    console.log("id:"+ snapshot.val().id)
    

    id = (snapshot.val().id);
    resultado=snapshot

       tokenpropio= snapshot.key

    
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

//especificamos el subdirectorio donde se encuentran las páginas estáticas
app.use(express.static(__dirname + '/html'));

//extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: false }));
//Creamos la accion que hara el boton, en cual enviara la notificacion los datos guardados antes.
app.post('/borrarTk',(req, res) => {
    let tokenMio= req.body.toke
    let nickd=req.body.nick
    let mens= req.body.msg
    let pagina = '<!doctype html><html><head></head><body>';
    
    var mensaje = {

 token:tokenMio,
 notification: {
     body:mens,
     title:"Ha sido dado de baja: "+nickd
 }
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(mensaje)
 .then((response) => {
   // Response is a message ID string.
   console.log('Successfully sent message:', response);
 })
 .catch((error) => {
   console.log('Error sending message:', error);
 });
 
 pagina += '</body></html>';
   res.send(pagina);
});


app.post('/enviar', (req, res) => {

   let pagina = '<!doctype html><html><head></head><body>';

var message = {

 token: tokenpropio,
 
 notification: {
     body:id+ " ya registrado",
     title:'Notificación Firebase'
 }
};

 
 
admin.messaging().send(message)
 .then((response) => {
   // Response is a message ID string.
   console.log('Successfully sent message:', response);
 })
 .catch((error) => {
   console.log('Error sending message:', error);
 });


   pagina += '</body></html>';
   res.send(pagina);
});



app.get('/mostrar', (req, res) => {
    let pagina = '<!doctype html><html><head></head><body>';
    pagina += 'Muestro<br>';
    pagina += '<div id="resultado">' + resultado + '</div>'
    pagina += '<p>...</p>';
    pagina += '</body></html>';
    res.send(pagina);
});


var server = app.listen(8080, () => {
    
    console.log('Servidor web iniciado');
    
});

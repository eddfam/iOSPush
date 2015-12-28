var db;

function indexedDBOk() {
	return "indexedDB" in window;
}

document.addEventListener("DOMContentLoaded", function() {

	//No support? Go in the corner and pout.
	if(!indexedDBOk) return;

	var openRequest = indexedDB.open("ios8b",1);

	openRequest.onupgradeneeded = function(e) {
		var thisDB = e.target.result;

		alert("running onupgradeneeded");

		if(!thisDB.objectStoreNames.contains("people")) {
			thisDB.createObjectStore("people", {keyPath:"id"});
		}

		if(!thisDB.objectStoreNames.contains("notes")) {
			thisDB.createObjectStore("notes", {keyPath:"uid"});
		}

	}

	openRequest.onsuccess = function(e) {
		alert("running onsuccess");

		db = e.target.result;

		alert("Current Object Stores");
		alert(db.objectStoreNames);

		//Listen for add clicks
		document.querySelector("#addButton").addEventListener("click", addPerson, false);
	}	

	openRequest.onerror = function(e) {
		//Do something for the error
	}


},false);


function addPerson(e) {
	alert("About to add person and note");

	var id = Number(document.querySelector("#key").value);
	
	//Get a transaction
	//default for OS list is all, default for type is read
	var transaction = db.transaction(["people"],"readwrite");
	//Ask for the objectStore
	var store = transaction.objectStore("people");

	//Define a person
	var person = {
		name:"Ray",
		created:new Date().toString(),
		id:id
	}

	//Perform the add
	var request = store.add(person);

	request.onerror = function(e) {
		alert("Error",e.target.error.name);
		//some type of error handler
	}

	request.onsuccess = function(e) {
		alert("Woot! Did it");
	}
	
	//Define a note
	var note = {
		note:"note",
		created:new Date().toString(),
		uid:id
	}

	var transaction2 = db.transaction(["notes"],"readwrite");
	//Ask for the objectStore
	var store2 = transaction2.objectStore("notes");

	//Perform the add
	var request2 = store2.add(note);

	request2.onerror = function(e) {
		alert("Error",e.target.error.name);
		//some type of error handler
	}

	request2.onsuccess = function(e) {
		alert("Woot! Did it");
	}
	
}
$(document).ready(function ( ) {
    
    $("#cargando").show();
    setTimeout(function() {
        $("#cargando").hide();
    },3000);
    setTimeout(function(){
        $("#views").show();
    },3000);
    
    
});
// Init App
var myApp = new Framework7({
    modalTitle: 'Framework7',
    // Enable Material theme
//    material: true,
    swipePanel: 'left',
});

// Expose Internal DOM library
var $$ = Dom7;


// Add main view
var mainView = myApp.addView('.view-main', {
});

var logueado = localStorage.getItem("logueado");


if(logueado == "si")
    {
        console.log(logueado);
         window.location =("home.html");
    }
   
else
    {
        console.log(logueado);
        window.location =("#");
    }
$("#login-button").click(function(event){
            event.preventDefault();
	        var email = $("#email").val();
            var password =$("#password").val();
            function validateEmail(email) { 
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
            
             if(email==''||email==undefined){
                 return alert('Ingrese su correo electronico');
             }else if (!validateEmail(email)) {
                 return alert('Correo electronico no valido');
             }else if(password==''||password==undefined){
                 return alert('Ingrese una contraseña valida');
             }else{
                 console.log(window.localStorage.getItem("regId"));
                 console.log(window.localStorage.getItem("nombreUsuario"));
                 $.ajax({
                     url:'http://desde9.esy.es/usuario.php',
                     type: 'GET',
                     data: {op:'login', email:email, password:password},
                     dataType : 'jsonp',
                     success: function(data) {
                         if(data.estatus == true){
                             window.localStorage.setItem("logueado", "si");
                             console.log(data.mensaje);
                             alert(data.mensaje);
                             
                             window.location =("home.html");
                         }else{
                             alert("Error : "+data.mensaje);
                             console.log(data.mensaje);
                         }
                     },error: function(e) {
                         console.log(JSON.stringify(e));
                         alert("ERROR TECNICO CON EL SERVICIO, INTENTE DE NUEVO MAS TARDE " +JSON.stringify(e));
                     }
                 });
             }
        });
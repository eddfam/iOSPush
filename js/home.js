$(document).ready(function () {
// Init App
var myApp = new Framework7({
    modalTitle: 'Framework7',
    // Enable Material theme
    //material: true,
    swipePanel: 'left',
});

// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main',{
    domCache: true //enable inline pages
});
// Pull to refresh content
var ptrNotificaciones = $$('.pull-to-refresh-content.notificaciones');
// Add 'refresh' listener on it
          var nc1 = window.localStorage.getItem('nControl');
          var nc2 = window.localStorage.getItem('nControl2');
ptrNotificaciones.on('refresh', function (e){
    setTimeout(function(){
        $.ajax({
            url:'http://desde9.esy.es/notificaciones.php',
            type:'GET',
            data:'type=padre2nc&nControl='+nc1+'&nControl2='+nc2,
            dataType:'json',
            error:function(jqXHR,text_status,strError){
                alert('no internet connection');
            },
            timeout:60000,
            success:function(data){
                $("#resultNot").html("");
                //clear();
                //add(data);
                for(var i in data){
                    $("#resultNot").append(
                       '<div class="card">'
                            //+'<div class="card-header">'+data[i].titulo+'</div>'
                            +'<div class="card-content">'
                            +'<div class="card-content-inner">'+data[i].contenido+'</div>'
                            +'</div>'
                            +'<div class="card-footer">'+data[i].fecha+'</div>'
                        +'</div>');
                }
            }
        });
        // When loading done, we need to "close" it
        myApp.pullToRefreshDone();
    }, 2000);
});

// Pull to refresh content
var ptrNoticias = $$('.pull-to-refresh-content.noticias');
 
// Add 'refresh' listener on it
ptrNoticias.on('refresh', function (e) {
    setTimeout(function () {
        $.ajax({
                url:'http://desde9.esy.es/noticias.php',
                type:'POST',
               
                dataType:'json',
                error:function(jqXHR,text_status,strError){
                    alert('no internet connection');
                }, 
                timeout:60000,
                success:function(data){
                    $("#result").html("");
                    //clear();
                    add(data);
//                    for(var i in data){
//                    $("#result").append(
//
//                       '<div class="card">'
//                            +'<div class="card-header">'+data[i].titulo+'</div>'
//                            +'<div class="card-content">'
//                            +'<div class="card-content-inner">'+data[i].descripcion+'</div>'
//                            +'</div>'
//                            +'<div class="card-footer">'+data[i].fecha+'</div>'
//                        +'</div>');
//                }
                }
            });
        
        
            // When loading done, we need to "close" it
            myApp.pullToRefreshDone();
        }, 2000);
});
var ptrPublicaciones = $$('.pull-to-refresh-content.publicaciones');
 
// Add 'refresh' listener on it
ptrPublicaciones.on('refresh', function (e) {
    setTimeout(function () {
        $.ajax({
                url:'http://desde9.esy.es/noticias.php',
                type:'POST',
               
                dataType:'json',
                error:function(jqXHR,text_status,strError){
                    alert('no internet connection');
                }, 
                timeout:60000,
                success:function(data){
                    $("#publicaciones").html("");
//                    clear();
//                    add(data);
                    for(var i in data){
                    $("#publicaciones").append(

                       '<div class="card">'
                            +'<div class="card-header">'+data[i].titulo+'</div>'
                            +'<div class="card-content">'
                            +'<div class="card-content-inner">'+data[i].descripcion+'</div>'
                            +'</div>'
                            +'<div class="card-footer">'+data[i].fecha+'</div>'
                        +'</div>'

                        /*"<li>"+JSON.stringify(data[i].descripcion)+"</li>"*/);
                }
                }
            });
        
        
            // When loading done, we need to "close" it
            myApp.pullToRefreshDone();
        }, 2000);
});
      });


if (window.openDatabase) {
    var mydb = openDatabase("gsm_ios_push", "0.1", "DB of gsmApp", 100 * 1024 * 1024);
    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS noticias (id INTEGER PRIMARY KEY AUTOINCREMENT,serverId INTEGER, titulo VARCHAR(90), descripcion VARCHAR(255), fecha VARCHAR(20))");
    });
}else{
    alert("Su dispositivo no soporta Base de Datos local");
}

function add(datos) {
    if (mydb){
        mydb.transaction(function (t){
            
            for(var i=0;i<datos.length;i++){
            t.executeSql("INSERT INTO noticias (serverId, titulo, descripcion, fecha) VALUES (?, ?, ?, ?)", [datos[i].id, datos[i].titulo, datos[i].descripcion, datos[i].fecha]);
            }
            mostrar();
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}
function mostrar(){
    if (mydb){
        mydb.transaction(function(t){
            t.executeSql("SELECT * FROM noticias ", [], llenar);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

function llenar(transaction, results){
    var listitems = "";
    var listholder = document.getElementById("result");
    listholder.innerHTML = "";
    var i;
    for(i=0;i<results.rows.length; i++){
        var row = results.rows.item(i);
        listholder.innerHTML +=
            '<div class="card">'
            +'<div class="card-header">'+row.titulo+'</div>'
            +'<div class="card-content">'
            +'<div class="card-content-inner">'+row.descripcion+'</div>'
            +'</div>'
            +'<div class="card-footer">'+row.fecha+'</div>'
            +'</div>';
    }

}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        var push = PushNotification.init({
            "android": {
                //"senderID": "400009158834"
            },
            "ios": {"alert": "true", "badge": "true", "sound": "true"}, 
            "windows": {} 
        });
        
        push.on('notification', function(data) {
        	console.log("notification event");
            console.log(JSON.stringify(data));
            
            if(data.title=='forms')
                {
                    mainView.router.load({pageName: 'forms'});
                }
            else if(data.title=='Noticias')
                {
                    mainView.router.load({pageName: 'noticias'});
                    //cargarIDB();
                }
            else if(data.title=='Notificacion')
                {
                    myApp.openPanel('right');
                    //cargarIDB();
                }
            
            push.finish(function () {
                console.log('finish successfully called');
            });
        });

        push.on('error', function(e) {
            console.log("push error");
            document.getElementById("regId").innerHTML = 'Error';
        });
    }
};
app.initialize();

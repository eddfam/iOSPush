$(document).ready(function(){
    var myApp = new Framework7({
        modalTitle: 'Framework7',
    });
    var $$ = Dom7;
    var mainView = myApp.addView('.view-main',{
        domCache: true //enable inline pages
    });
    var tapped=false;
    function fromServerNoticias(){
        $.ajax({
            url:'http://desde9.esy.es/noticias.php',
            data:'id=',
            type:'POST',
            dataType:'json',
            error:function(jqXHR,text_status,strError){
                alert('no internet connection');
            },
            timeout:60000,
            success:function(data){
                //$("#result").html("");
                borrar();
                add(data);
            }
        });
    }
    $("#btnNoticias").on("touchstart",function(e){
        if(!tapped){
            tapped=setTimeout(function(){
                mostrar()
                tapped=null
            },300); //wait 300ms
        }else{
            clearTimeout(tapped);
            tapped=null
            fromServerNoticias()
        }
        e.preventDefault()
    });
    function fromServerNotificaciones(){
        var tipoUsuario = window.localStorage.getItem('tipo');
        var cantidadNControl = window.localStorage.getItem('cantidadNControl');
        var nc1 = window.localStorage.getItem('nControl');
        var nc2 = window.localStorage.getItem('nControl2');
        var data;
        if(tipoUsuario=='alumno'){
            data= 'type=alumno&nControl='+nc1;
        }else if(tipoUsuario=='padre'&& cantidadNControl==1){
            data= 'type=padre1nc&nControl='+nc1;
        }else if(tipoUsuario=='padre'&& cantidadNControl==2){
            data= 'type=padre2nc&nControl='+nc1+'&nControl2='+nc2;
        }
        $.ajax({
            url:'http://desde9.esy.es/notificaciones.php',
            type:'GET',
            data:data,
            dataType:'json',
            error:function(jqXHR,text_status,strError){
                alert('no internet connection');
            },
            timeout:60000,
            success:function(data){
                var listholder = document.getElementById("resultNot");
                listholder.innerHTML = "";
                //clear();
                //add(data);
                for(var i in data){
                    listholder.innerHTML +=
                        '<div class="card">'
                        +'<div class="card-content">'
                        +'<div class="card-content-inner">'+data[i].contenido+'</div>'
                        +'</div>'
                        +'<div class="card-footer">'+data[i].fecha+'</div>'
                        +'</div>';
                }listholder.style.marginBottom='60px';
            }
        });
    }
    $("#btnNotificaciones").on("touchstart",function(e){
        if(!tapped){
            tapped=setTimeout(function(){
                //mostrar();
                tapped=null;
            },300); //wait 300ms
        }else{
            clearTimeout(tapped);
            tapped=null;
            fromServerNotificaciones();
        }
        e.preventDefault();
    });
});
if (window.openDatabase) {
    var mydb = openDatabase("gsm_ios_push", "0.1", "DB of gsmApp", 5 * 1024 * 1024);
    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS noticias (serverId INTEGER, titulo VARCHAR(90), descripcion VARCHAR(255), fecha VARCHAR(20))");
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
    //var listitems = "";
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
    listholder.style.marginBottom='60px';

}
function borrar() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            t.executeSql("DELETE FROM noticias", [], llenar);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

function fromServerNoticias(){
    $.ajax({
        url:'http://desde9.esy.es/noticias.php',
        data:'id=',
        type:'POST',
        dataType:'json',
        error:function(jqXHR,text_status,strError){
            alert('no internet connection');
        },
        timeout:60000,
        success:function(data){
            //$("#result").html("");
            borrar();
            add(data);
        }
    });
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
            "android": {},
            "ios": {"alert": "true", "badge": "true", "sound": "true"}, 
            "windows": {} 
        });
        push.on('notification', function(data){
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

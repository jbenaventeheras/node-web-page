const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path')
const PUERTO = 8080;
const LOCALIP = '192.168.1.37';
var express = require('express')


//-- Configurar el servidor
http.createServer((req, res) => {

  console.log("---------- PETICION RECIBIDA --------------")
  let q = url.parse(req.url, true);
  console.log("Recurso solicitado (URL): " + req.url)
  console.log("Host: " + q.host)
  console.log("pathname:" + q.pathname)

  //-- Leer las cookies
  const cookie = req.headers.cookie;
  console.log("Cookie: " + cookie);

  function getCookie(cookie){

  	if(cookie){
      cookie_array= cookie.split(';');
      for(var i = 0; i <cookie_array.length; i++) {
        //nombre de la cookie
        carrito = (cookie_array[i].split('=')[0])
        if (carrito == "carrito"){
          //valor de la cookie
          producto = (cookie_array[i].split('=')[1])
        }
      }
  	}
   return carrito
  }

  function getCookie_valor(cookie){

  	if(cookie){
      cookie_array= cookie.split(';');
      for(var i = 0; i <cookie_array.length; i++) {
        //nombre de la cookie
        carrito = (cookie_array[i].split('=')[0])
        if (carrito == "carrito"){
          //valor de la cookie
          producto = (cookie_array[i].split('=')[1])
        }
      }
      return producto
  	}

  }

  // Leemos el index para URL vacía
    var filename = ""
    var carrito= ""
    if (q.pathname == "/"){
      filename += "./index.html";
      //para url de compras añadidimos cookie y volvemos a index
    }else if(q.pathname == "/comprardestroyer"){
      filename += "./index.html";
      console.log("comprado destroyer")
      if (getCookie(cookie)=="carrito"){
        producto+= ",destroyer"
      }else{
        producto="destroyer"
      }
      res.setHeader('Set-Cookie', 'carrito='+producto)
    }else if(q.pathname == "/compraralax"){
      filename += "./index.html";
      if (getCookie(cookie)=="carrito"){
        producto+= ",AlaX"
      }else{
        producto="AlaX"
      }
      res.setHeader('Set-Cookie', 'carrito='+producto)
    }else if(q.pathname == "/comprarhalcon"){
      filename += "./index.html";
      if (getCookie(cookie)=="carrito"){
        producto+= ",Halcon"
      }else{
        producto="Halcon"
      }
      res.setHeader('Set-Cookie', 'carrito='+producto)
    }else if(q.pathname == "/comprartie"){
      filename += "./index.html";
      if (getCookie(cookie)=="carrito"){
        producto+= ",Tie"
      }else{
        producto="Tie"
      }
      res.setHeader('Set-Cookie', 'carrito='+producto)
    }else if(q.pathname == "/mycarrito"){
      if (req.method === 'POST') {
          // Handle post info...
          var valor_cookie = getCookie_valor(cookie)
          if (cookie){
          valor_cookie_array= cookie.split(',');
          for(var i = 0; i <valor_cookie_array.length; i++) {


            }
          }
          console.log(valor_cookie)
          var content = `
          <!DOCTYPE html>
          <html lang="es">
            <head>
              <meta charset="utf-8">
              <title>FORM 1</title>
              <link rel="stylesheet" href="index.css">
            </head>
            <div align=center>
            <body>------carrito-----</p>
              <p>Recibido: `
              if (cookie){
                content+=valor_cookie.toString();
              }else{
                content+='Carrito vacío';
              }
          req.on('data', chunk => {
              //-- Leer los datos (convertir el buffer a cadena)
              data = chunk.toString();

              //-- Añadir los datos a la respuesta

              //-- Fin del mensaje. Enlace al formulario
              content += `
                  </p>hola
                  <a href="/">[Formulario]</a>
                </body>
              </html>
              `
              res.statusCode = 200;
           });

           req.on('end', ()=> {
             //-- Generar el mensaje de respuesta
             res.setHeader('Content-Type', 'text/html')
             res.write(content);
             res.end();
           })
           return
        }

      //para el resto de paginas que no sean index ni de compra
    } else {
      filename = q.pathname;
      filename = "." + filename
    }

    type = filename.split(".")[2]

    console.log("Filename: " + filename);
    console.log("Type: " + type);

    var mime = "text/html"
    fs.readFile(filename, (err, data) => {

    if (err) {
        res.writeHead(404, {'Content-Type': mime});
        return res.end("404 Not Found " + q.pathname );
    }
    var mime = "text/html"

    if (type == "html"){
        console.log("Cargar HTML")
        mime = "text/html";
        res.writeHead(200, {'Content-Type': mime});

    }else if(['png', 'jpg', 'jpeg', 'ico'].includes(type)){
      console.log("Cargar Imagen")
      mime = "image/" + type;
      res.writeHead(200, {'Content-Type': mime});

    }else if (type == "css"  ||  type== 'stylesheet'){
      console.log("Cargar CSS")
      mime = "text/css";
      res.writeHead(200, {'Content-Type': mime});

    }

    res.write(data);
    res.end();
    console.log('---------PETICION TERMINADA----------\n');

    //gestion errores

  });

}).listen(PUERTO);

console.log("Servidor corriendo...")
console.log("Puerto: " + PUERTO)

const express = require("express");
//retorna una aplicacion de express
const app = express();

//la barra inclinada en la ruta del archivo se pone cuando es un archivo que hemos creado y no un modulo de node
const { infoCursos } = require("./datos/cursos.js");

//routing = direccionamiento o enrutamiento
//routers - esto evita la repeticion de un path
//guardar la ruta en una variable
const routerProgramacion = require("./routers/programacion.js");
//le indica a la app que camino se va a tomar asi se este llamando en otro archivo aca se define la ruta- el primer argumento es el camino que se quiere seguir, y en el segundo argumento se le indica que router va a tomar ese camino
app.use("/api/cursos/programacion", routerProgramacion);

//routing matematicas
const routerMatematicas = require("./routers/matematicas.js");
app.use("/api/cursos/matematicas", routerMatematicas);

//metodo get recibe como primer argumento el path, y como segunto argumento la funcion que va a manejar lo que va a pasar cuando se llama al metodo en ese path, en este caso "/" es el camino home
app.get("/", (req, res) => {
  res.send("mi primer servidor con express");
});

//en la ruta se pone api para indicar que es una api
app.get("/api/cursos", (req, res) => {
  res.send(JSON.stringify(infoCursos));
});

//curso de matematicas

//process.env.port es el puerto que se asigna cuando uno ya desplego la app en un hosting
const PUERTO = process.env.PORT || 3600;

app.listen(PUERTO, () => {
  console.log(`el servidor esta escuchando en el puerto ${PUERTO}...`);
});

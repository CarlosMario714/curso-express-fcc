const express = require("express");

//en la vida real estas consultas se harian a una base de datos
const { programacion } = require("../datos/cursos.js").infoCursos;

//router programacion
const routerProgramacion = express.Router();

//middleware
//middleware: las funciones del middleware se sejecutan despues de recibir una solicitud y antes de enviar una respuesta - tienen acceso a objeto de la solicitud, al objeto de la respuesta y a next(), una funcion que se llama para ejecutar el proximo middleware
//procesar el body de la solicitud en fotmato json y poder tabajar con el
routerProgramacion.use(express.json());

routerProgramacion.get("/", (req, res) => {
  //el metodo send retorna el objeto o arreglo(si es que se retorna uno)en formato json automaticamente por lo que no es necesario usar el metodo stringify
  res.send(JSON.stringify(programacion));
  //convierte el argumento a formato json, sirve para validar que es este enviando el objeto en el formato que se quiere sirve como remplazo de la funcion send()
  //res.json(programacion)
});

//cursos de programacion

//sin usar el routing quedaria asi el primer argumetno /api/cursos/programacion/:lenguaje
//:lenguaje es un parametro url
routerProgramacion.get("/:lenguaje", (req, res) => {
  //lenguaje que se especifico en la ruta va a estar disponible en los parametros del objeto req y se lo asignamos a una variable para trabajar con ese valor
  const lenguaje = req.params.lenguaje;
  //resultados retornara un areglo con el curso del objeto infocursos si es igual al parametro url, retorna todo el objeto del curso porque ese objeto esta en el indice del arreglo
  const resultados = programacion.filter(
    (curso) => curso.lenguaje === lenguaje
  );

  if (resultados.length === 0) {
    //en todos los metodos conviene retornar el estado de la respuesta sea el caso que sea
    return res.status(404).send(`no se encontraron cursos de ${lenguaje}`);
  }

  //parametros query
  if (req.query.ordenar === "vistas") {
    //el metodo sort permite ordenar una lista en base a un criterio
    return res.send(
      //ordena el curso dependiendo del numero de vistas
      JSON.stringify(resultados.sort((a, b) => b.vistas - a.vistas))
    );
  }

  res.send(JSON.stringify(resultados));
});

//filtrar por lenguaje de programacion y nivel del curso

routerProgramacion.get("/:lenguaje/:nivel", (req, res) => {
  const lenguaje = req.params.lenguaje;
  const nivel = req.params.nivel;

  const resultados = programacion.filter(
    (curso) => curso.lenguaje === lenguaje && curso.nivel === nivel
  );

  if (resultados.length === 0) {
    // return res
    //   .status(404)
    //   .send(`no se encontraron cursos de ${lenguaje} de nivel ${nivel}`);
    //en vez de enviar una respuesta personalizada cuando no se encuentra el archivo, se puede mandar una respuesta vacia y el navegador se encargara de mostar el error
    return res.status(404).end();
  }

  res.send(JSON.stringify(resultados));
});

//metodo post
routerProgramacion.post("/", (req, res) => {
  //en una app real hay que validar que el archivo del body sea un json
  //agregar un nuevo curso a archivo cursos
  let cursoNuevo = req.body;
  programacion.push(cursoNuevo);
  res.send(JSON.stringify(programacion));
});

//metodo put - permite actualizar una entidad de la base de datos - entidad es una idea como un objeto- hay que enviar toda la entidad completa para poderlo actualizar
routerProgramacion.put("/:id", (req, res) => {
  //se trae todo el objeto para reempazarlo y actualizarlo
  const cursoActualizado = req.body;
  const id = req.params.id;

  //la comparacion se hace con == por que el json es un string y en js es un numero
  //finindex retorna el undice del elemento, si no lo encuentra retorna -1
  const indice = programacion.findIndex((curso) => curso.id == id);

  if (indice >= 0) {
    programacion[indice] = cursoActualizado;
  } else {
    res.status(404);
  }

  res.send(JSON.stringify(programacion));
});

//metodo patch - es igual que put pero permite solo actualizar los pares clave valor que uno le pase, no es necesario actualizar todo el objeto
routerProgramacion.patch("/:id", (req, res) => {
  const infoActualizada = req.body;
  const id = req.params.id;

  const indice = programacion.findIndex((curso) => curso.id == id);

  if (indice >= 0) {
    const cursoAModificar = programacion[indice];
    //assign actualiza un objeto solo con las propiedades actualizadas que tenga otro objeto
    Object.assign(cursoAModificar, infoActualizada);
  }
  res.send(JSON.stringify(programacion));
});

//metodo delete
//tener en cuenta que al enviar la solicitud mas de 2 veces no se borre mas info, solo la que se quiere
routerProgramacion.delete("/:id", (req, res) => {
  //como delete no necesita un body entonces no se trabaja con este
  const id = req.params.id;
  const indice = programacion.findIndex((curso) => curso.id == id);

  if (indice >= 0) {
    //eliminar un elemento del arreglo
    programacion.splice(indice, 1);
  }
  res.send(JSON.stringify(programacion));
});

module.exports = routerProgramacion;

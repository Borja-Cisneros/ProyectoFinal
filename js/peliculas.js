/* CARGAR PELICULAS */

// Configuración de encabezados para la solicitud API
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZjE0ZDc2NTUzZTI1NWYxYTY2YTQ2M2E5YWVlZjkzMCIsInN1YiI6IjY1M2Y3NThlY2M5NjgzMDBjOWU1MDEwZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FqH5iyYw7QDd-7ZydOPSYQ2UH_hA4OcEeF6JUK-Iz3M");

// Opciones para la solicitud API
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

// Lista personal de películas
let listaPersonal = [];

// Variables para el género actual y la página actual
let generoActual;
let paginaActual = 1;

// Botón para cargar más películas
let botonCargarMas;

// Mapa de géneros y mapa de iconos asociados a cada género
let mapaGeneros = new Map();
llenarMapaGeneros()
paginaPrincipal()


// CREACION MAPA ICONOS
let miMapa = new Map();
miMapa.set("Acción", "fa-jet-fighter-up");
miMapa.set("Aventura", "fa-dungeon");
miMapa.set("Animación", "fa-dragon");
miMapa.set("Comedia", "fa-microphone");
miMapa.set("Crimen", "fa-gun");
miMapa.set("Documental", "fa-book");
miMapa.set("Drama", "fa-masks-theater");
miMapa.set("Familia", "fa-people-roof");
miMapa.set("Fantasía", "fa-wand-sparkles");
miMapa.set("Historia", "fa-landmark");
miMapa.set("Terror", "fa-ghost");
miMapa.set("Música", "fa-music");
miMapa.set("Misterio", "fa-question");
miMapa.set("Romance", "fa-heart");
miMapa.set("Ciencia ficción", "fa-atom");
miMapa.set("Película de TV", "fa-tv");
miMapa.set("Suspense", "fa-video");
miMapa.set("Bélica", "fa-explosion");
miMapa.set("Western", "fa-jedi");

// INICIO FUNCIONES

// Manejador para el clic en el botón "Cargar Más"
function cargarMasClickHandler() {
  obtenerPeliculasPorGenero(generoActual, paginaActual);
}

// Obtener películas por género y página
function obtenerPeliculasPorGenero(genero, paginaActual) {
  if (generoActual !== genero) {
    console.log("asdf");
    generoActual = genero;
    paginaActual = 1; 
   }

  fetch(`https://api.themoviedb.org/3//discover/movie?language=es&with_genres=${genero}&page=${paginaActual}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      cargarPaginaPeliculas(result);
      paginaActual = paginaActual + 1; // Incrementar aquí después de cargar los resultados

      // Actualizar el evento click del botón para que use la última paginaActual
      botonCargarMas.removeEventListener("click", cargarMasClickHandler);
      botonCargarMas.addEventListener("click", () => obtenerPeliculasPorGenero(generoActual, paginaActual));
    })
    .catch(error => console.log('error', error));
}


// CARGA LA PAGINA DE UN DETERMINADO GENERO
function cargarPaginaPeliculas(result) {
  console.log(paginaActual);
    let container = document.getElementById("container");


    if (result.page == 1) {
      container.innerHTML="";
    }

    let filaCards = document.createElement("div");
    filaCards.classList.add("peliculas", "row", "row-cols-1", "row-cols-sm-3", "row-cols-lg-4");

    container.appendChild(filaCards);

    filaCards.innerHTML = `<div class="modal fade modal-lg" id="staticBackdrop-video" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" title="Cerrar" alt="Cerrar modal"></button>
        </div>
        <div class="modal-cuerpo modal-body">
          <video id="modalVideo" src="./video/video.mp4" controls autoplay muted></video>
        </div>
      </div>
    </div>
    </div>`

    result.results.forEach(resultado => {        

        let generos = obtenerNombreGeneros(resultado.genre_ids);
        let url_base = "https://image.tmdb.org/t/p/w500";
        let continuacionURL = (resultado.backdrop_path != null)? resultado.backdrop_path : resultado.poster_path;
        let cadena = `<div id="${resultado.id}" class="card m-3" style="width: 18rem;" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${resultado.id}">
                        <div class="contenedor-imagen">
                          <img src="${url_base}${continuacionURL}" class="card-img-top" alt="${resultado.title}" title="${resultado.title}" width="262" heigth="147.23">
                        </div>
                        <div class="card-body">
                          <h5 class="card-title">${resultado.title}</h5>
                           <p class="card-text">${generos.join(" · ")}</p> 
                        </div>
                      </div>`;

        let modal = `<!-- Modal -->
        <div class="modal fade modal-lg" id="staticBackdrop-${resultado.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" title="Cerrar" alt="Cerrar modal"></button>
              </div>
              <div class="modal-cuerpo modal-body">
                <div class="modal-contenedor-imagen">
                  <img src="${url_base}${continuacionURL}" title="${resultado.title}" alt="${resultado.title}"></img>
                </div>
                <hr>
                  <button type="button" class="btn btn-success" title="Ver" alt="Ver Pelicula" data-bs-toggle="modal" data-bs-target="#staticBackdrop-video">Play</button>
                  <button id="lista" type="button" class="btn btn-primary" onclick="engadirALista(${resultado.id})" title="Añadir a lista" alt="Añadir a lista">Añadir a Mi Lista</button>
                <hr>
                    <h1>${resultado.title}</h1>
                    <p>${resultado.overview}</p>
                
                    <p>Titulo: ${resultado.title}</p>
                    <p>Titulo original: ${resultado.original_title}</p>
                    <p>Fecha de estreno: ${resultado.release_date}</p>
                    <p>Valoracion media: ${resultado.vote_average}</p>
  
                      <h5>Generos</h5>
                      <p>${generos.join(" · ")}</p>
                  
                </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>`;
           filaCards.innerHTML= filaCards.innerHTML + cadena + modal;
          });
          // Modificar la llamada inicial al hacer clic en el botón "Cargar Más"
          
          if (result.page > 1) {
            botonCargarMas.remove();
          }
          botonCargarMas = document.createElement("button");
          botonCargarMas.classList.add("btn", "btn-warning", "btn-lg", "m-2", "col-4", "mx-auto");
          botonCargarMas.textContent= "Cargar Más";
          botonCargarMas.addEventListener("click", cargarMasClickHandler);
           container.appendChild(botonCargarMas);
  }

  // OBTIENE UN JSON DE LOS GENEROS
function obtenerGeneros() {
  fetch("https://api.themoviedb.org/3//genre/movie/list?language=es", requestOptions)
  .then(response => response.json())
  .then(result => generarBotones(result))
  .catch(error => console.log('error', error));
}

// GENERA LA pagina de categorias
function generarBotones(result) {
  let filaBotones = document.createElement("div");
  filaBotones.classList.add("peliculas", "row", "row-cols-sm-1", "row-cols-md-2", "row-cols-lg-3", "row-cols-xxl-4","pagina-botones");
  
  let contenedorPrincipal = document.getElementById("container");
  document.body.classList.add("pag-principal");
  document.body.classList.remove("pag-peliculas");
  contenedorPrincipal.innerHTML="";
  contenedorPrincipal.appendChild(filaBotones);
  
  // FOR EACH
  result.genres.forEach(resultado => {

    let divBoton = document.createElement("div");
    divBoton.classList.add("botones", "col", "d-grid");

    
    let boton = document.createElement("button");
    boton.classList.add("btn", "btn-primary", "btn-lg", "m-2");
    
    
    let icono = document.createElement("i");
    if (miMapa.has(resultado.name)) {
      icono.classList.add(miMapa.get(resultado.name),"fa-solid", "fa-2xl")
    }
    boton.appendChild(icono);

    boton.appendChild(document.createElement("br"));
    boton.addEventListener("click", function() {
      obtenerPeliculasPorGenero(resultado.id);
    });

    let titulo = document.createElement("h1");
    titulo.textContent = resultado.name;
    boton.appendChild(titulo);
    boton.setAttribute("title",titulo.textContent);
    
    divBoton.appendChild(boton);
    filaBotones.appendChild(divBoton);
  });
}

// Obtener películas por género
async function obtenerPeliculasPorGeneroPaginaPrincipal(genero,p) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3//discover/movie?language=es&with_genres=${genero}&page=${p}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log('error', error);
    throw error; // Lanza el error para que pueda ser manejado desde donde se llame esta función
  }
}
// Generar pagina primcipal
async function paginaPrincipal() {
  console.log(paginaActual);
  let container = document.getElementById("container");
  container.innerHTML = "";

  // Crear y agregar el video principal
  let video = document.createElement("div");
  video.innerHTML = `
    <section class="netflix-home-video">
  <div class="top"></div>
  <div class="bottom"></div>
  <video src="./video/video.mp4" autoplay muted loop></video>
  <div class="contentv">
    <section class="left">
      <img src="./img/image2.webp" alt="after we collided">
      <div class="d-flex mt-2">
        <button class="btn btn-light m-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop-video">
          <i class="bi bi-play-fill" style="color: black; padding: 0%;"></i> Play Now
        </button>
      </div>
    </section>
  </div>
</section>

<div class="modal fade modal-lg" id="staticBackdrop-video" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" title="Cerrar" alt="Cerrar modal"></button>
                </div>
                <div class="modal-cuerpo modal-body">
                  <video id="modalVideo" src="./video/video.mp4" controls autoplay muted></video>
                </div>
              </div>
            </div>
          </div>`;
  container.appendChild(video);

  // Definir categorías
  let categorias = ["Podrian Gustarte", "Tendencia ahora", "Lo mejor en España", "No te Pierdas"];

  // Iterar sobre categorías
  var pag = 1
  for (let categoria of categorias) {
      let seccion = document.createElement("div");
      let titulo = document.createElement("h1");
      titulo.innerText = categoria;
      seccion.appendChild(titulo);

      let fila = document.createElement("div");
      fila.classList.add("principal", "row", "row-cols-1", "row-cols-sm-3", "row-cols-lg-6"); // Añadir una clase para estilos

      // Obtener películas y crear tarjetas
      const peliculas = await obtenerPeliculasPorGeneroPaginaPrincipal(16,pag); // Suponiendo que 16 es el ID de género
      pag++;
      let count = 0;

      peliculas.results.forEach(resultado => {
          if (count < 6) {
              let generos = obtenerNombreGeneros(resultado.genre_ids);
              let url_base = "https://image.tmdb.org/t/p/w500";
              let continuacionURL = (resultado.backdrop_path != null)? resultado.backdrop_path : resultado.poster_path;

              let carro = `
                <div id="${resultado.id}" class="card m-3" style="width: 18rem;" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${resultado.id}">
                  <div class="contenedor-imagen">
                    <img src="${url_base}${resultado.poster_path}" class="card-img-top" alt="${resultado.title}" title="${resultado.title}" width="262" height="147.23">
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">${resultado.title}</h5>
                    <p class="card-text">${generos.join(" · ")}</p>
                  </div>
                </div>`;
                let modal = `<!-- Modal -->
          <div class="modal fade modal-lg" id="staticBackdrop-${resultado.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" title="Cerrar" alt="Cerrar modal"></button>
                </div>
                <div class="modal-cuerpo modal-body">
                  <div class="modal-contenedor-imagen">
                    <img src="${url_base}${continuacionURL}" title="${resultado.title}" alt="${resultado.title}"></img>
                  </div>
                  <hr>
                    <button type="button" class="btn btn-success" title="Ver" alt="Ver Pelicula" data-bs-toggle="modal" data-bs-target="#staticBackdrop-video">Play</button>
                    <button id="lista" type="button" class="btn btn-primary" onclick="engadirALista(${resultado.id})" title="Añadir a lista" alt="Añadir a lista">Añadir a Mi Lista</button>
                  <hr>
                    <h1>${resultado.title}</h1>
                    <p>${resultado.overview}</p>
                
                    <p>Titulo: ${resultado.title}</p>
                    <p>Titulo original: ${resultado.original_title}</p>
                    <p>Fecha de estreno: ${resultado.release_date}</p>
                    <p>Valoracion media: ${resultado.vote_average}</p>
  
                      <h5>Generos</h5>
                      <p>${generos.join(" · ")}</p>
                  
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>`;
             fila.innerHTML = fila.innerHTML + carro + modal;
              count++;
          }});

      seccion.appendChild(fila);
      container.appendChild(seccion);
  }
}



// CAMBIA EL ID DE LOS GENEROS QUE SE LE PASAN POR EL NOMBRE, QUE RETORNA
function obtenerNombreGeneros(idArray) {
  let nombresGeneros = [];

  idArray.forEach(id => {
    if (mapaGeneros.has(id)) {
      nombresGeneros.push(mapaGeneros.get(id) + " ");
    } else {
      nombresGeneros.push(`genre ${id}`);
    }
  });

  return nombresGeneros;
}

// MI LISTA
function miLista() {
  let container = document.getElementById("container");
  container.innerHTML=`<div class="modal fade modal-lg" id="staticBackdrop-video" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" title="Cerrar" alt="Cerrar modal"></button>
        </div>
        <div class="modal-cuerpo modal-body">
          <video id="modalVideo" src="./video/video.mp4" controls autoplay muted></video>
        </div>
      </div>
    </div>
    </div>`;

  let filaCards = document.createElement("div");
  filaCards.classList.add("mls", "row", "row-cols-1", "row-cols-sm-3", "row-cols-lg-6");

  container.appendChild(filaCards);
  if (listaPersonal.length > 0) {
    listaPersonal.forEach ( resultado => {
      filaCards.appendChild(resultado);
    });
  } else {
    filaCards.innerHTML = "<h1 id='aviso'> Vaya, parece que no tienes favoritos </h1>"
  }
}

// AÑADIR ELEMENTO A PAGINA -MI LISTA-
function engadirALista(id) {
  
  elementoDiv = document.getElementById(id);

  if (!listaPersonal.includes(elementoDiv)) {
    listaPersonal.push(elementoDiv);

    elementoModal = document.getElementById(`staticBackdrop-${id}`);
    let botonLista = elementoModal.querySelector('#lista');
    // Cambia el contenido del botón
    botonLista.innerHTML = 'Eliminar de Mi Lista';
    botonLista.setAttribute('onclick', `eliminarDeLista(${id})`);

    listaPersonal.push(elementoModal);

    console.log(elementoDiv);
  }
}

// ELIMINAR ELEMENTO A PAGINA -MI LISTA-
function eliminarDeLista(id) {
  let elementoAEliminar = document.getElementById(id);
  console.log(elementoAEliminar);
  let indice = listaPersonal.indexOf(elementoAEliminar);
  
  listaPersonal.splice(indice, 1);

  console.log(elementoAEliminar);

  elementoAEliminar = document.getElementById(`staticBackdrop-${id}`);
  indice = listaPersonal.indexOf(elementoAEliminar);
  listaPersonal.splice(indice, 1);
}

// LLena el mapa de generos en lazando el id del genero con su nombre, para asi mostrar en los cards

function llenarMapaGeneros() {
  fetch("https://api.themoviedb.org/3//genre/movie/list?language=es", requestOptions)
  .then(response => response.json())
  .then(result => llenarMapaG(result))
  .catch(error => console.log('error', error));
}

function llenarMapaG(result) {
  result.genres.forEach(resultado => {
    mapaGeneros.set(resultado.id,resultado.name);
  })
}
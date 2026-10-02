/* =====================================================
   🚕 CARABAYA TAXI
   SISTEMA COMPLETO
===================================================== */


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const LATITUD_MACUSANI = -14.06848;

const LONGITUD_MACUSANI = -70.43136;


/*
   TARIFA

   S/ 0.0046 por metro

   Equivale a:

   1000 metros × 0.0046
   = S/ 4.60 por km
*/

const PRECIO_POR_METRO = 0.0046;


/* =====================================================
   VARIABLES
===================================================== */

let mapa;

let marcadorUsuario = null;

let marcadorOrigen = null;

let marcadorDestino = null;

let ruta = null;

let ubicacionUsuario = null;

let ubicacionOrigen = null;

let ubicacionDestino = null;

let viaje = null;

let choferRegistrado = null;


/* =====================================================
   CREAR MAPA
===================================================== */

mapa = L.map("mapa").setView(

    [
        LATITUD_MACUSANI,
        LONGITUD_MACUSANI
    ],

    15

);


L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        attribution:
            "&copy; OpenStreetMap contributors"

    }

).addTo(mapa);


/* =====================================================
   MARCADOR MACUSANI
===================================================== */

L.marker(

    [
        LATITUD_MACUSANI,
        LONGITUD_MACUSANI
    ]

)

.addTo(mapa)

.bindPopup(

    "<b>🚕 CARABAYA TAXI</b><br>" +
    "Macusani, Carabaya"

);


/* =====================================================
   MENÚ DE TRES PUNTOS
===================================================== */

function abrirMenu() {

    const menu =
        document.getElementById(
            "menuPrincipal"
        );


    if (
        menu.style.display === "block"
    ) {

        menu.style.display = "none";

    }

    else {

        menu.style.display = "block";

    }

}


/* =====================================================
   REGISTRO DE CHOFER
===================================================== */

function abrirRegistroChofer() {

    document
        .getElementById(
            "menuPrincipal"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "modalRegistroChofer"
        )
        .style.display =
        "flex";

}


/* =====================================================
   CERRAR REGISTRO
===================================================== */

function cerrarRegistroChofer() {

    document
        .getElementById(
            "modalRegistroChofer"
        )
        .style.display =
        "none";

}


/* =====================================================
   REGISTRAR CHOFER
===================================================== */

function registrarChofer() {

    const nombres =

        document
            .getElementById(
                "choferNombres"
            )
            .value
            .trim();


    const apellidos =

        document
            .getElementById(
                "choferApellidos"
            )
            .value
            .trim();


    const dni =

        document
            .getElementById(
                "choferDni"
            )
            .value
            .trim();


    const telefono =

        document
            .getElementById(
                "choferTelefono"
            )
            .value
            .trim();


    const marca =

        document
            .getElementById(
                "vehiculoMarca"
            )
            .value
            .trim();


    const modelo =

        document
            .getElementById(
                "vehiculoModelo"
            )
            .value
            .trim();


    const anio =

        document
            .getElementById(
                "vehiculoAnio"
            )
            .value
            .trim();


    const placa =

        document
            .getElementById(
                "vehiculoPlaca"
            )
            .value
            .trim();


    const color =

        document
            .getElementById(
                "vehiculoColor"
            )
            .value
            .trim();


    /*
       VERIFICAR CAMPOS
    */

    if (

        !nombres ||

        !apellidos ||

        !dni ||

        !telefono ||

        !marca ||

        !modelo ||

        !anio ||

        !placa ||

        !color

    ) {

        document
            .getElementById(
                "mensajeRegistro"
            )
            .innerHTML =

            "⚠️ Completa todos los datos.";

        return;

    }


    /*
       GUARDAR REGISTRO
    */

    choferRegistrado = {

        nombres,

        apellidos,

        dni,

        telefono,

        vehiculo: {

            marca,

            modelo,

            anio,

            placa,

            color

        },

        estado:
            "PENDIENTE"

    };


    /*
       GUARDAR TEMPORALMENTE
       EN EL NAVEGADOR
    */

    localStorage.setItem(

        "choferCarabayaTaxi",

        JSON.stringify(
            choferRegistrado
        )

    );


    document
        .getElementById(
            "mensajeRegistro"
        )
        .innerHTML =

        `
        ⏳ <b>REGISTRO ENVIADO</b>

        <br><br>

        Tu solicitud fue recibida.

        <br>

        🔐 Estado:
        <b>PENDIENTE DE APROBACIÓN</b>

        <br><br>

        El sistema debe revisar
        tus datos antes de habilitar
        tu cuenta de chofer.
        `;


}


/* =====================================================
   CARGAR CHOFER GUARDADO
===================================================== */

const choferGuardado =

    localStorage.getItem(
        "choferCarabayaTaxi"
    );


if (choferGuardado) {

    try {

        choferRegistrado =
            JSON.parse(
                choferGuardado
            );

    }

    catch {

        choferRegistrado = null;

    }

}


/* =====================================================
   GPS
===================================================== */

function usarMiUbicacion() {

    const boton =
        document.getElementById(
            "btnUbicacion"
        );


    if (!navigator.geolocation) {

        alert(
            "Tu dispositivo no permite obtener ubicación."
        );

        return;

    }


    boton.disabled = true;

    boton.innerHTML =
        "📍 BUSCANDO UBICACIÓN...";


    navigator.geolocation.getCurrentPosition(

        function(posicion) {

            const lat =
                posicion.coords.latitude;


            const lon =
                posicion.coords.longitude;


            ubicacionUsuario = {

                lat,

                lon

            };


            ubicacionOrigen = {

                lat,

                lon

            };


            if (marcadorUsuario) {

                mapa.removeLayer(
                    marcadorUsuario
                );

            }


            marcadorUsuario =

                L.marker(
                    [lat, lon]
                )
                .addTo(mapa);


            mapa.setView(

                [lat, lon],

                17

            );


            obtenerDireccion(

                lat,

                lon,

                function(nombre) {

                    document
                        .getElementById(
                            "origen"
                        )
                        .value =
                        nombre;


                    marcadorUsuario
                        .bindPopup(

                            "<b>📍 ORIGEN</b><br>" +
                            nombre

                        )
                        .openPopup();


                    boton.disabled = false;


                    boton.innerHTML =
                        "✅ UBICACIÓN ENCONTRADA";


                    if (
                        ubicacionDestino
                    ) {

                        calcularRuta();

                    }

                }

            );

        },


        function() {

            boton.disabled = false;

            boton.innerHTML =
                "📍 USAR MI UBICACIÓN";


            alert(
                "No se pudo obtener tu ubicación."
            );

        },


        {

            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 0

        }

    );

}


/* =====================================================
   DIRECCIÓN
===================================================== */

function obtenerDireccion(

    lat,

    lon,

    callback

) {

    fetch(

        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=es`

    )

    .then(

        response =>
            response.json()

    )

    .then(

        data => {

            const direccion =
                data.address || {};


            const calle =

                direccion.road ||

                direccion.pedestrian ||

                direccion.footway ||

                direccion.neighbourhood ||

                "Ubicación seleccionada";


            const numero =

                direccion.house_number

                    ? " " +
                      direccion.house_number

                    : "";


            callback(

                calle + numero

            );

        }

    )

    .catch(

        function() {

            callback(
                "Ubicación seleccionada"
            );

        }

    );

}


/* =====================================================
   MAPA - ORIGEN Y DESTINO
===================================================== */

mapa.on(

    "click",

    function(e) {

        const lat =
            e.latlng.lat;


        const lon =
            e.latlng.lng;


        /*
           PRIMER TOQUE = ORIGEN
        */

        if (!ubicacionOrigen) {

            ubicacionOrigen = {

                lat,

                lon

            };


            if (marcadorOrigen) {

                mapa.removeLayer(
                    marcadorOrigen
                );

            }


            marcadorOrigen =

                L.marker(
                    [lat, lon]
                )
                .addTo(mapa);


            obtenerDireccion(

                lat,

                lon,

                function(nombre) {

                    document
                        .getElementById(
                            "origen"
                        )
                        .value =
                        nombre;


                    marcadorOrigen
                        .bindPopup(

                            "<b>📍 ORIGEN</b><br>" +
                            nombre

                        )
                        .openPopup();

                }

            );


            return;

        }


        /*
           SEGUNDO TOQUE = DESTINO
        */

        ubicacionDestino = {

            lat,

            lon

        };


        if (marcadorDestino) {

            mapa.removeLayer(
                marcadorDestino
            );

        }


        marcadorDestino =

            L.marker(
                [lat, lon]
            )
            .addTo(mapa);


        obtenerDireccion(

            lat,

            lon,

            function(nombre) {

                document
                    .getElementById(
                        "destino"
                    )
                    .value =
                    nombre;


                marcadorDestino
                    .bindPopup(

                        "<b>🏁 DESTINO</b><br>" +
                        nombre

                    )
                    .openPopup();


                calcularRuta();

            }

        );

    }

);


/* =====================================================
   BUSCAR DIRECCIÓN
===================================================== */

function buscarDireccion(

    texto,

    tipo

) {

    if (!texto.trim()) {

        return;

    }


    fetch(

        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(texto + ", Macusani, Carabaya, Peru")}&limit=1&accept-language=es`

    )

    .then(

        response =>
            response.json()

    )

    .then(

        data => {

            if (

                !data ||

                data.length === 0

            ) {

                alert(
                    "No encontramos esa dirección."
                );

                return;

            }


            const lat =

                parseFloat(
                    data[0].lat
                );


            const lon =

                parseFloat(
                    data[0].lon
                );


            if (tipo === "origen") {

                ubicacionOrigen = {

                    lat,

                    lon

                };


                if (marcadorOrigen) {

                    mapa.removeLayer(
                        marcadorOrigen
                    );

                }


                marcadorOrigen =

                    L.marker(
                        [lat, lon]
                    )
                    .addTo(mapa)

                    .bindPopup(

                        "<b>📍 ORIGEN</b><br>" +
                        texto

                    )

                    .openPopup();

            }


            if (tipo === "destino") {

                ubicacionDestino = {

                    lat,

                    lon

                };


                if (marcadorDestino) {

                    mapa.removeLayer(
                        marcadorDestino
                    );

                }


                marcadorDestino =

                    L.marker(
                        [lat, lon]
                    )
                    .addTo(mapa)

                    .bindPopup(

                        "<b>🏁 DESTINO</b><br>" +
                        texto

                    )

                    .openPopup();

            }


            mapa.setView(

                [lat, lon],

                17

            );


            if (

                ubicacionOrigen &&

                ubicacionDestino

            ) {

                calcularRuta();

            }

        }

    )

    .catch(

        function() {

            alert(
                "Error buscando la dirección."
            );

        }

    );

}


/* =====================================================
   INPUT ORIGEN
===================================================== */

document
    .getElementById(
        "origen"
    )
    .addEventListener(

        "change",

        function() {

            buscarDireccion(

                this.value,

                "origen"

            );

        }

    );


/* =====================================================
   INPUT DESTINO
===================================================== */

document
    .getElementById(
        "destino"
    )
    .addEventListener(

        "change",

        function() {

            buscarDireccion(

                this.value,

                "destino"

            );

        }

    );


/* =====================================================
   CALCULAR RUTA
===================================================== */

function calcularRuta() {

    if (

        !ubicacionOrigen ||

        !ubicacionDestino

    ) {

        return;

    }


    const origen =

        `${ubicacionOrigen.lon},${ubicacionOrigen.lat}`;


    const destino =

        `${ubicacionDestino.lon},${ubicacionDestino.lat}`;


    const url =

        `https://router.project-osrm.org/route/v1/driving/${origen};${destino}?overview=full&geometries=geojson`;


    document
        .getElementById(
            "mensaje"
        )
        .innerHTML =
        "🗺️ Calculando ruta...";


    fetch(url)

    .then(

        response =>
            response.json()

    )

    .then(

        data => {

            if (

                !data.routes ||

                data.routes.length === 0

            ) {

                throw new Error();

            }


            const datos =
                data.routes[0];


            const distanciaKm =

                datos.distance / 1000;


            const distanciaMetros =

                datos.distance;


            const tiempoMin =

                Math.ceil(

                    datos.duration / 60

                );


            document
                .getElementById(
                    "distancia"
                )
                .innerHTML =

                distanciaKm.toFixed(2) +
                " km";


            document
                .getElementById(
                    "tiempo"
                )
                .innerHTML =

                tiempoMin +
                " min";


            if (ruta) {

                mapa.removeLayer(
                    ruta
                );

            }


            ruta =

                L.geoJSON(
                    datos.geometry
                )
                .addTo(mapa);


            mapa.fitBounds(

                ruta.getBounds(),

                {

                    padding:
                        [30, 30]

                }

            );


            /*
               NUEVO PRECIO

               S/ 0.0046 × METROS
            */

            calcularPrecio(

                distanciaMetros

            );


            document
                .getElementById(
                    "btnTaxi"
                )
                .disabled = false;


            document
                .getElementById(
                    "mensaje"
                )
                .innerHTML =

                "✅ Ruta lista para solicitar taxi.";

        }

    )

    .catch(

        function() {

            document
                .getElementById(
                    "mensaje"
                )
                .innerHTML =

                "❌ No se pudo calcular la ruta.";

        }

    );

}


/* =====================================================
   PRECIO
===================================================== */

function calcularPrecio(

    distanciaMetros

) {

    let precio =

        distanciaMetros *
        PRECIO_POR_METRO;


    /*
       REDONDEAMOS A DOS DECIMALES
    */

    precio =

        Math.round(
            precio * 100
        ) / 100;


    document
        .getElementById(
            "precio"
        )
        .innerHTML =

        "S/ " +
        precio.toFixed(2);

}


/* =====================================================
   SOLICITAR TAXI
===================================================== */

function solicitarTaxi() {

    const nombreCliente =

        document
            .getElementById(
                "nombreCliente"
            )
            .value
            .trim();


    /*
       VERIFICAR NOMBRE
    */

    if (!nombreCliente) {

        alert(

            "👤 Primero coloca tu nombre y apellido."

        );

        document
            .getElementById(
                "nombreCliente"
            )
            .focus();

        return;

    }


    if (!ubicacionOrigen) {

        alert(
            "📍 Selecciona un origen."
        );

        return;

    }


    if (!ubicacionDestino) {

        alert(
            "🏁 Selecciona un destino."
        );

        return;

    }


    /*
       LLENAR CONFIRMACIÓN
    */

    document
        .getElementById(
            "confirmarCliente"
        )
        .innerHTML =
        nombreCliente;


    document
        .getElementById(
            "confirmarOrigen"
        )
        .innerHTML =

        document
            .getElementById(
                "origen"
            )
            .value;


    document
        .getElementById(
            "confirmarDestino"
        )
        .innerHTML =

        document
            .getElementById(
                "destino"
            )
            .value;


    document
        .getElementById(
            "confirmarDistancia"
        )
        .innerHTML =

        document
            .getElementById(
                "distancia"
            )
            .innerHTML;


    document
        .getElementById(
            "confirmarTiempo"
        )
        .innerHTML =

        document
            .getElementById(
                "tiempo"
            )
            .innerHTML;


    document
        .getElementById(
            "confirmarPrecio"
        )
        .innerHTML =

        document
            .getElementById(
                "precio"
            )
            .innerHTML;


    document
        .getElementById(
            "modalConfirmacion"
        )
        .style.display =
        "flex";

}


/* =====================================================
   CANCELAR
===================================================== */

function cancelarConfirmacion() {

    document
        .getElementById(
            "modalConfirmacion"
        )
        .style.display =
        "none";

}


/* =====================================================
   CONFIRMAR VIAJE
===================================================== */

function confirmarSolicitud() {

    document
        .getElementById(
            "modalConfirmacion"
        )
        .style.display =
        "none";


    viaje = {

        id:

            "CBT-" +
            Date.now(),


        cliente:

            document
                .getElementById(
                    "nombreCliente"
                )
                .value,


        origen:

            document
                .getElementById(
                    "origen"
                )
                .value,


        destino:

            document
                .getElementById(
                    "destino"
                )
                .value,


        distancia:

            document
                .getElementById(
                    "distancia"
                )
                .innerHTML,


        tiempo:

            document
                .getElementById(
                    "tiempo"
                )
                .innerHTML,


        precio:

            document
                .getElementById(
                    "precio"
                )
                .innerHTML,


        estado:
            "BUSCANDO_CHOFER"


    };


    mostrarEstadoCliente();

}


/* =====================================================
   CLIENTE BUSCANDO
===================================================== */

function mostrarEstadoCliente() {

    const boton =

        document
            .getElementById(
                "btnTaxi"
            );


    boton.disabled = true;


    boton.innerHTML =
        "🔎 BUSCANDO CHOFER...";


    document
        .getElementById(
            "mensaje"
        )
        .innerHTML =

        `
        <div class="estado-viaje">

            <h3>
                🔎 BUSCANDO CHOFER
            </h3>

            <p>
                Hola,
                <b>${viaje.cliente}</b>
            </p>

            <p>
                Tu solicitud fue enviada.
            </p>

            <p>
                🚕 Esperando un chofer disponible...
            </p>

        </div>
        `;


    setTimeout(

        mostrarPanelChofer,

        2000

    );

}


/* =====================================================
   PANEL CHOFER
===================================================== */

function mostrarPanelChofer() {

    document
        .querySelector(
            ".app"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "panelChofer"
        )
        .style.display =
        "block";


    /*
       SI NO HAY CHOFER REGISTRADO
    */

    if (!choferRegistrado) {

        document
            .getElementById(
                "solicitudChofer"
            )
            .innerHTML =

            `
            <div class="sin-solicitudes">

                <div class="icono-grande">
                    🔐
                </div>

                <h3>
                    Chofer no registrado
                </h3>

                <p>
                    Debes registrarte y esperar
                    la aprobación del sistema.
                </p>

            </div>
            `;

        return;

    }


    /*
       VERIFICAR APROBACIÓN
    */

    if (
        choferRegistrado.estado !==
        "APROBADO"
    ) {

        document
            .getElementById(
                "solicitudChofer"
            )
            .innerHTML =

            `
            <div class="sin-solicitudes">

                <div class="icono-grande">
                    ⏳
                </div>

                <h3>
                    Registro pendiente
                </h3>

                <p>
                    Tu cuenta todavía no ha sido
                    aprobada por el sistema.
                </p>

                <p>
                    🔐 Estado:
                    <b>${choferRegistrado.estado}</b>
                </p>

            </div>
            `;

        return;

    }


    /*
       MOSTRAR DATOS
    */

    document
        .getElementById(
            "nombreChoferPanel"
        )
        .innerHTML =

        choferRegistrado.nombres +
        " " +
        choferRegistrado.apellidos;


    document
        .getElementById(
            "vehiculoChoferPanel"
        )
        .innerHTML =

        choferRegistrado.vehiculo.marca +
        " " +
        choferRegistrado.vehiculo.modelo +
        " • Placa: " +
        choferRegistrado.vehiculo.placa;


    mostrarSolicitudChofer();

}


/* =====================================================
   SOLICITUD CHOFER
===================================================== */

function mostrarSolicitudChofer() {

    const contenedor =

        document
            .getElementById(
                "solicitudChofer"
            );


    contenedor.innerHTML =

        `
        <div class="tarjeta-solicitud">


            <div class="nueva-solicitud">

                🚨 NUEVA SOLICITUD

            </div>


            <div class="dato-solicitud">

                👤 <b>PASAJERO</b>

                <br>

                ${viaje.cliente}

            </div>


            <div class="dato-solicitud">

                📍 <b>ORIGEN</b>

                <br>

                ${viaje.origen}

            </div>


            <div class="dato-solicitud">

                🏁 <b>DESTINO</b>

                <br>

                ${viaje.destino}

            </div>


            <div class="dato-solicitud">

                📏 <b>DISTANCIA</b>

                <br>

                ${viaje.distancia}

            </div>


            <div class="dato-solicitud">

                ⏱️ <b>TIEMPO</b>

                <br>

                ${viaje.tiempo}

            </div>


            <div class="precio-chofer">

                💰 PRECIO DEL VIAJE

                <strong>

                    ${viaje.precio}

                </strong>

            </div>


            <button
                class="btn-aceptar"
                onclick="aceptarViaje()">

                🚕 ACEPTAR VIAJE

            </button>


            <button
                class="btn-rechazar"
                onclick="rechazarViaje()">

                ❌ RECHAZAR

            </button>


        </div>
        `;

}


/* =====================================================
   ACEPTAR
===================================================== */

function aceptarViaje() {

    viaje.estado =
        "CHOFER_ACEPTO";


    mostrarViajeAceptado();


    setTimeout(

        choferEnCamino,

        3000

    );

}


/* =====================================================
   ACEPTADO
===================================================== */

function mostrarViajeAceptado() {

    document
        .getElementById(
            "solicitudChofer"
        )
        .innerHTML =

        `
        <div class="tarjeta-solicitud">

            <div class="nueva-solicitud">

                ✅ VIAJE ACEPTADO

            </div>


            <div class="dato-solicitud">

                👤 <b>PASAJERO</b>

                <br>

                ${viaje.cliente}

            </div>


            <div class="dato-solicitud">

                📍 <b>RECOGER EN</b>

                <br>

                ${viaje.origen}

            </div>


            <div class="dato-solicitud">

                🏁 <b>DESTINO</b>

                <br>

                ${viaje.destino}

            </div>


            <div class="precio-chofer">

                🚕 VIAJE CONFIRMADO

                <strong>

                    ${viaje.precio}

                </strong>

            </div>

        </div>
        `;

}


/* =====================================================
   EN CAMINO
===================================================== */

function choferEnCamino() {

    viaje.estado =
        "CHOFER_EN_CAMINO";


    document
        .getElementById(
            "solicitudChofer"
        )
        .innerHTML =

        `
        <div class="tarjeta-solicitud">


            <div class="nueva-solicitud">

                🚕 CHOFER EN CAMINO

            </div>


            <div class="dato-solicitud">

                👤 <b>PASAJERO</b>

                <br>

                ${viaje.cliente}

            </div>


            <div class="dato-solicitud">

                📍 <b>RECOGER EN</b>

                <br>

                ${viaje.origen}

            </div>


            <div class="dato-solicitud">

                🏁 <b>DESTINO</b>

                <br>

                ${viaje.destino}

            </div>


            <button
                class="btn-aceptar"
                onclick="pasajeroRecogido()">

                👤 PASAJERO RECOGIDO

            </button>


        </div>
        `;

}


/* =====================================================
   PASAJERO RECOGIDO
===================================================== */

function pasajeroRecogido() {

    viaje.estado =
        "EN_VIAJE";


    document
        .getElementById(
            "solicitudChofer"
        )
        .innerHTML =

        `
        <div class="tarjeta-solicitud">


            <div class="nueva-solicitud">

                🚕 VIAJE EN CURSO

            </div>


            <div class="dato-solicitud">

                👤 <b>PASAJERO A BORDO</b>

                <br>

                ${viaje.cliente}

            </div>


            <div class="dato-solicitud">

                🏁 <b>DESTINO</b>

                <br>

                ${viaje.destino}

            </div>


            <div class="precio-chofer">

                💰 TOTAL

                <strong>

                    ${viaje.precio}

                </strong>

            </div>


            <button
                class="btn-aceptar"
                onclick="terminarViaje()">

                ✅ TERMINAR VIAJE

            </button>


        </div>
        `;

}


/* =====================================================
   TERMINAR VIAJE
===================================================== */

function terminarViaje() {

    viaje.estado =
        "FINALIZADO";


    document
        .getElementById(
            "solicitudChofer"
        )
        .innerHTML =

        `
        <div class="tarjeta-solicitud">


            <div class="nueva-solicitud">

                ✅ VIAJE FINALIZADO

            </div>


            <div class="dato-solicitud">

                👤 <b>PASAJERO</b>

                <br>

                ${viaje.cliente}

            </div>


            <div class="dato-solicitud">

                📍 <b>ORIGEN</b>

                <br>

                ${viaje.origen}

            </div>


            <div class="dato-solicitud">

                🏁 <b>DESTINO</b>

                <br>

                ${viaje.destino}

            </div>


            <div class="precio-chofer">

                💰 TOTAL DEL VIAJE

                <strong>

                    ${viaje.precio}

                </strong>

            </div>


            <p style="text-align:center;">

                Gracias por usar

                <b>
                    CARABAYA TAXI
                </b>

                🚕

            </p>


        </div>
        `;

}


/* =====================================================
   RECHAZAR
===================================================== */

function rechazarViaje() {

    viaje.estado =
        "RECHAZADO";


    document
        .getElementById(
            "solicitudChofer"
        )
        .innerHTML =

        `
        <div class="sin-solicitudes">

            <div class="icono-grande">
                ❌
            </div>


            <h3>
                Solicitud rechazada
            </h3>


            <p>
                Esperando otra solicitud...
            </p>

        </div>
        `;

}
// Inicializar la API de Mercado Pago
Mercadopago.setPublishableKey('PUBLIC_KEY');

// Configuración de la integración con la API de Mercado Pago
const checkoutData = {
  "items": [
    {
      "title": "Donación",
      "quantity": 1,
      "currency_id": "ARS",
      "unit_price": 0
    }
  ],
  "payer": {
    "email": "email@example.com",
    "name": "Nombre",
    "surname": "Apellido",
    "identification": {
      "type": "DNI",
      "number": "12345678"
    },
    "address": {
      "street_name": "Calle",
      "street_number": "123",
      "zip_code": "1234"
    }
  },
  "back_urls": {
    "success": "https://www.example.com/success",
    "failure": "https://www.example.com/failure",
    "pending": "https://www.example.com/pending"
  },
  "auto_return": "approved",
  "payment_methods": {
    "excluded_payment_methods": [
      {
        "id": "amex"
      }
    ],
    "excluded_payment_types": [
      {
        "id": "atm"
      }
    ]
  }
};

// Función para actualizar el monto total de donaciones en la página
function updateTotal(total) {
  const totalElement = document.getElementById("total");
  totalElement.innerText = total;
}

// Función para mostrar el formulario de participación
function showForm() {
  const formElement = document.querySelector(".form");
  formElement.style.display = "block";
}

// Función para enviar los datos del formulario a la API de Mercado Pago
function submitForm(event) {
  event.preventDefault();

  // Obtener los datos del formulario
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const dni = document.getElementById("dni").value;
  const calle = document.getElementById("calle").value;
  const departamento = document.getElementById("departamento").value;
  const monto = document.getElementById("monto").value;

  // Actualizar el monto total de donaciones en la página
  const total = parseInt(document.getElementById("total").innerText) + parseInt(monto);
  updateTotal(total);

  // Actualizar la información del checkout con el nuevo monto
  checkoutData.items[0].unit_price = parseInt(monto);

  // Actualizar la información del pagador con los datos del formulario
  checkoutData.payer.name = nombre;
  checkoutData.payer.surname = apellido;
  checkoutData.payer.identification.number = dni;
  checkoutData.payer.address.street_name = calle;
  checkoutData.payer.address.street_number = departamento;

  // Crear un token de pago utilizando la API de Mercado Pago
  Mercadopago.createToken(checkoutData, function(response, status) {
    if (status === 200 || status === 201) {
      // Enviar el token de pago y los datos del formulario al servidor para procesar la donación
      const token = response.id;
      const formData = new FormData();
      formData.append("token", token);
      formData.append("nombre", nombre);
      formData.append("apellido", apellido);
      formData.append("dni", dni);
      formData.append("calle", calle);
      formData.append("departamento", departamento);
      formData.append("monto", monto);
      fetch("/procesar-donacion", {
        method:// Continuando el código

        formData,
        headers: {
        "Content-Type": "application/x-www-form-urlencoded"
        }
        }).then(response => {
        // Mostrar un mensaje de éxito o error en función de la respuesta del servidor
        if (response.ok) {
        alert("¡Gracias por tu donación!");
        } else {
        alert("Hubo un error al procesar la donación. Por favor, inténtalo de nuevo más tarde.");
        }
        }).catch(error => {
        console.error(error);
        alert("Hubo un error al procesar la donación. Por favor, inténtalo de nuevo más tarde.");
        });
        } else {
        // Mostrar un mensaje de error si la creación del token de pago falló
        console.error(response);
        alert("Hubo un error al procesar la donación. Por favor, inténtalo de nuevo más tarde.");
        }
        });
        }
        
        // Inicializar el formulario y los eventos de la página
        window.onload = function() {
        // Ocultar el formulario de participación al cargar la página
        const formElement = document.querySelector(".form");
        formElement.style.display = "none";
        
        // Actualizar el monto total de donaciones en la página
        updateTotal(0);
        
        // Agregar un evento al botón de participar para mostrar el formulario
        const participarButton = document.getElementById("participar");
        participarButton.addEventListener("click", showForm);
        
        // Agregar un evento al formulario para procesar la donación
        const form = document.getElementById("form");
        form.addEventListener("submit", submitForm);
        };

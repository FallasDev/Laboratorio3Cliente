const HOST = "https://laboratorio3-zphz.onrender.com/api/";

const PATH = "/Aulas/view/";

document.addEventListener("DOMContentLoaded", async () => {

  if (location.pathname === `${PATH}index.html`) {
    const aulaTableBody = document.getElementById("aula-table-body");
    const btnAulasWithAire = document.getElementById("btn-showAulasWithAire");

    btnAulasWithAire.addEventListener("click", () => {
      location.href = `${PATH}aulasWithAire.html`;
    })

    const aulas = await getAulas();
    aulas.forEach((aula) => {
      const row = document.createElement("tr");
   
      row.innerHTML = `
                <td>${aula.nombre}</td>
                <td>${aula.capacidad}</td>
                <td>${aula.tieneAireAcondicionado ? "Sí" : "No"}</td>
                <td>
                    <a class="btn btn-primary" href=${PATH}showAula.html?id=${
        aula.id
      }>Ver</a>
                    <a href="${PATH}formularioEditarAula.html?id=${
        aula.id
      }" class="btn btn-warning">Actualizar</a>
                    <button class="btn btn-danger" onclick="eliminarAula(${
                      aula.id
                    })">Eliminar</button>
                </td>
            `;
      aulaTableBody.appendChild(row);
    });
  }

  if (location.pathname === `${PATH}formularioCrearAulas.html`) {
    const form = document.getElementById("crear-aula-form");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const aula = {
        Nombre: formData.get("nombre"),
        Capacidad: formData.get("capacidad"),
        TieneAireAcondicionado: formData.get("tieneAire") === "on",
      };

      try {
        await crearAula(aula);
        alert("Aula creada exitosamente");
        goToIndex();
      } catch (error) {
        console.error(error);
        alert("Error al crear el aula");
      }
    });
  }

  if (location.pathname === `${PATH}formularioEditarAula.html`) {
    const form = document.getElementById("editar-aula-form");
    const cursoSelect = document.getElementById("curso-select");

    const urlParams = new URLSearchParams(window.location.search);
    const aulaId = urlParams.get("id");
    const aula = await getAula(aulaId);
    form.nombre.value = aula.nombre;
    form.capacidad.value = aula.capacidad;
    form.tieneAire.checked = aula.tieneAireAcondicionado == "0" ? false : true;


    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const valorCheckbox = formData.has("tieneAire") ? true : false;

      const aulaActualizada = {
        Id: 1,
        Nombre: formData.get("nombre"),
        Capacidad: formData.get("capacidad"),
        TieneAireAcondicionado: valorCheckbox,
      };

      try {

        await actualizarAula(aulaId, aulaActualizada);
      } catch (error) {
        console.error(error);
        alert("Error al actualizar el aula");
      }
    });
  }

  if (location.pathname === `${PATH}aulasWithAire.html`) {

    const aulaTableBody = document.getElementById("aula-table-body");
    const btnIndex = document.getElementById("btn-index");

    const aulas = await getAulasWithAire();

    btnIndex.addEventListener("click", () => {
      goToIndex();
    })

    aulas.forEach((aula) => {
      const row = document.createElement("tr");
   
      row.innerHTML = `
                <td>${aula.nombre}</td>
                <td>${aula.capacidad}</td>
                <td>${aula.tieneAireAcondicionado ? "Sí" : "No"}</td>
                <td>
                    <a class="btn btn-primary" href=${PATH}showAula.html?id=${
        aula.id
      }>Ver</a>
                    <a href="${PATH}formularioEditarAula.html?id=${
        aula.id
      }" class="btn btn-warning">Actualizar</a>
                    <button class="btn btn-danger" onclick="eliminarAula(${
                      aula.id
                    })">Eliminar</button>
                </td>
            `;
      aulaTableBody.appendChild(row);
    });
  }
});

const getAulas = async () => {
  try {
    const response = await fetch(`${HOST}Classrooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las aulas");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    // alert("Error al cargar las aulas");
    return [];
  }
};

const crearAula = async (aula) => {
  console.log(aula);
  if (!aula.Nombre || !aula.Capacidad) {
    alert("El nombre y la capacidad del aula son obligatorios.");
    return;
  }

  try {
    const response = await fetch(`${HOST}Classrooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(aula),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error del servidor:", errorData);
      alert(
        "Error al crear el aula: " + (errorData.message || "Datos inválidos")
      );
    } else {
      alert("Aula creada exitosamente");
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Error al conectar con el servidor");
  }
};

const eliminarAula = async (id) => {
  const confirmacion = confirm(
    "¿Estás seguro de que deseas eliminar esta aula?"
  );
  if (confirmacion) {
    try {
      const response = await fetch(`${HOST}Classrooms/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 400){
        const errorData = await response.json();
        alert(errorData.message || "Error al eliminar el aula");
        return;
      }

      if (!response.ok) {
        alert("Error al eliminar el aula");
      } else {
        alert("Aula eliminada exitosamente");
        location.reload();
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el aula");
    }
  }
};

const getAula = async (id) => {

  const response = await fetch(`${HOST}Classrooms/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return data;
};

const actualizarAula = async (id, aula) => {
  console.log(aula);
  const response = await fetch(`${HOST}Classrooms/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(aula),
  });

  console.log(response);

  if (response.ok) {
    alert("Aula actualizada correctamente");
    goToIndex();
  } else {
    alert("Hubo un error al actualizar el aula.");
  }
};

// const generarReporte = async (aulaId) => {

//   const aula = await getAula(aulaId);
//   const curso = await getCursoByAula(aulaId);


//   const nombre = aula.nombre;
//   const capacidad = aula.capacidad;
//   const aire = aula.tieneAireAcondicionado ? true : false;
//   const nombreCurso = curso ? curso[0].nombre : "No asignado";
//   const profesor = curso ? curso[0].profesor : "No asignado";

//   const response = await fetch(
//     `${HOST}pdf?nombre=${nombre}&capacidad=${capacidad}&aire=${aire}&nombreCurso=${nombreCurso}&profesor=${profesor}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   const data = await response.blob();
//   const url = window.URL.createObjectURL(data);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "reporte.pdf";
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
// };

const getCurso = async (id) => {
  const response = await fetch(`${HOST}Classrooms/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });



  if (!response.ok) {
    throw new Error("Error al obtener el curso");
  }

  const data = await response.json();
  return data;
};

const getCursoByAula = async (aulaId) => {

  const response = await fetch(`${HOST}Courses/Classrooms/${aulaId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
  });

   if(response.status === 404) {
    return null;
   }

  if (!response.ok) {
    throw new Error("Error al obtener el curso por aula");
  }

  const data = await response.json();
  return data;
}

const getAulasWithAire = async () => {

  const response = await fetch(`${HOST}Classrooms/getByHasAireAcondicionado`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  console.log(response);

  if (!response.ok) {
    throw new Error("Error al obtener las aulas con aire acondicionado");
  }

  const aulas = await response.json();
  return aulas;
}

const goToIndex = () => {
  location.href = `${PATH}index.html`;
};

const goToLogin = () => {
  window.location.href = `/labCliente/Auth/views/index.html`;
};

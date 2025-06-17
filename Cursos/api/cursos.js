const HOST = "https://laboratorio3-zphz.onrender.com/api/";

console.log(`Host: ${HOST}`); // Log the host to verify it's correct

const PATH = "/labCliente/Cursos/view/";



document.addEventListener('DOMContentLoaded', async () => {
    
    if (location.pathname === `${PATH}index.html`) {

        const cursoTable = document.getElementById('curso-table');
        const cursoTableBody = document.getElementById('curso-table-body');
        const cursos = await getCursos();

        for (const curso of cursos) {
            const row = document.createElement('tr');
            
            // Usa await para obtener el aula asociada al curso
            const aula = await getAula(curso.aulaId);

            console.log(aula);
    
            row.innerHTML = `
                <td>${curso.nombre}</td>
                <td>${curso.descripcion}</td>
                <td>${curso.siglas}</td>
                <td>${curso.profesor}</td>
                <td>${curso.estudiantesMatriculados}</td>
                <td>${aula ? aula.nombre : 'No asignada'}</td>
                <td>
                    <a class="btn btn-primary" href=${PATH}showCurso.html?id=${curso.id}>Ver</a>
                    <a href="${PATH}formularioEditarCurso.html?id=${curso.id}" class="btn btn-warning">Actualizar</a>
                    <button class="btn btn-danger" onclick="eliminarCurso(${curso.id})">Eliminar</button>
                </td>
            `;
            cursoTableBody.appendChild(row);
        }

    }

    if (location.pathname === `${PATH}formularioCrearCurso.html`) {
        const form = document.getElementById('crear-curso-form');
        const aulaSelect = document.getElementById('aula-select');

        const aulas = await getAulas();

        for (const aula of aulas) {
            const option = document.createElement('option');
            option.value = aula.id;
            option.text = aula.nombre;
            aulaSelect.appendChild(option);
        }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const aula = getAula(aulaSelect.value);
            const formData = new FormData(event.target);
            const curso = {
                Nombre: formData.get('nombre'),
                Descripcion: formData.get('descripcion'),
                Siglas: formData.get('siglas'),
                Profesor: formData.get('profesor'),
                AulaId: parseInt(aulaSelect.value),
                EstudiantesMatriculados: parseInt(formData.get('matriculados')),
          
            };

            console.log(`Curso a crear: ${JSON.stringify(curso)}`); // Log the course data to verify it's correct

            try {

                await crearCurso(curso);
                alert('Curso creado exitosamente');
                goToIndex();
            } catch (error) {
                const errorResponse = JSON.parse(error.message)
                
                alert(errorResponse.message);
                alert('Error al crear el curso');
            }
        });
        
    }

    if (location.pathname === `${PATH}formularioEditarCurso.html`) {
        const form = document.getElementById('editar-curso-form');
        const aulaSelect = document.getElementById('aula-select');

        const urlParams = new URLSearchParams(window.location.search);
        const cursoId = urlParams.get('id');
  
        const curso = await getCurso(cursoId);
        const aulas = await getAulas();
        console.log(curso);
        form.nombre.value = curso.nombre;
        form.descripcion.value = curso.descripcion;
        form.siglas.value = curso.siglas;
        form.profesor.value = curso.profesor;

        for (const aula of aulas) {
            const option = document.createElement('option');
            option.value = aula.id;
            option.text = aula.nombre;
            if (aula.id === curso.aulaId) {
                option.selected = true; // Selecciona el aula actual del curso
            }
            aulaSelect.appendChild(option);
        }
        

    
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const cursoActualizado = {
                id: cursoId,
                Nombre: formData.get('nombre'),
                Descripcion: formData.get('descripcion'),
                Siglas: formData.get('siglas'),
                Profesor: formData.get('profesor'),
                AulaId: parseInt(aulaSelect.value),
            };
            try {
               
                await actualizarCurso(cursoActualizado);
                alert('Curso actualizado exitosamente');
                goToIndex();
            } catch (error) {
                console.error(error);
                alert('Error al actualizar el curso');
            }
        });
    }
})


const getCursos = async () => {
    const response = await fetch(`${HOST}Courses`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Error al obtener los cursos');
    }

    const data = await response.json();
    console.log(data);
    return data;
}

const crearCurso = async (curso) => {    
    console.log(`Curso a crear: ${JSON.stringify(curso)}`); // Log the course data to verify it's correct
    const response = await fetch(`${HOST}Courses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(curso)
    });

    console.log(response);

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const data = await response.json();
    return data;
}

const getCurso = async (id) => {
    const response = await fetch(`${HOST}Courses/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Error al obtener el curso');
    }

    const data = await response.json();
    return data;
}

const actualizarCurso = async (curso) => {
    console.log(curso);
    const response = await fetch(`${HOST}Courses/${curso.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(curso)
    });

    if (response.ok){
        alert('Curso actualizado exitosamente');
    }
    else {
        throw new Error(await response.text());
    }
}

const eliminarCurso = async (id) => {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este curso?');

    if (!confirmation) {
        return;
    }

    const response = await fetch(`${HOST}Courses/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Error al eliminar el curso');
    }

    alert('Curso eliminado exitosamente');
    goToIndex();
}


const getAulas = async () => {
    try {
      const response = await fetch(`${HOST}Courses/unassigned`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log(`Response status: ${response.status}`); // Log the response status
   

      if (response.status === 404) {
        alert("No hay aulas disponibles");
        return [];
      }

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

  const getAula = async (id) => {
    console.log(`Obteniendo aula con ID: ${id}`); // Log the ID being fetched
    const response = await fetch(`${HOST}Classrooms/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Error al obtener el aula");
    }
    return await response.json();
}
  

const goToIndex = () => {
    window.location.href = `${PATH}index.html`;
}

const goToLogin = () => {
    window.location.href = `/labCliente/Auth/views/index.html`;
}
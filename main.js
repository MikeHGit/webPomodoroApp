/*
    tasks:
    time:
    timeBreak:
    current:
*/
const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;



/*
    <div id="form">
        <form action="" id="form">
            <input type="text" id="itTask">
            <input type="submit" value="Agregar Tarea" id="btnAdd">
        </form>
    </div>
*/
const form = document.querySelector('#form');
const btnAdd = document.querySelector('#btnAdd');
const itTask = document.querySelector('#itTask');


//<div id="taskName"></div>
const taskName = document.querySelector('#time #taskName');

renderTime();
renderTasks();



/*Evento submit del formulario.

    *prevenir el evento por defecto del submit.
    *si el valor del input texto no está vacio...
        *ejecuta la funcion createTask(itTask.value).Por parámetro envia el valor del input texto.
        *cuando vuelve de la funcion createTask().
        *limpia la caja de texto.
        *ejecuta la funcion renderTask().

*/
form.addEventListener('submit', e => {
    e.preventDefault();
    if (itTask.value != '') {
        createTask(itTask.value);
        itTask.value = '';
        renderTasks();
    } else {
        // alert('Debe ingresar una tarea');
    }
});



/*funcion createTask(value) -- Crear Tarea.

    parámetro: value -- texto del input texto.
    Se crea un objeto newTask con...
        *id: (número aleatorio decimal * 100, string36, devuelve la cadena desde la pos 3).
        *title: texto del input texto.
        *completed: valor booleano en false.

    Se ingresa al arreglo tasks[] el objeto newTask{}.

*/
function createTask(value) {
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completed: false
    };

    tasks.unshift(newTask);
}



/*funcion renderTask() -- Renderizar Tarea.
    

    Se recorre el arreglo de objetos tasks[] con map().    
    Por cada objeto en el arreglo, map retorna una cadena...
        *un <div> padre con 2 <div> hijos:
            *1. <div> class completed...
                *si task.completed es true retorna un span 'Done'.
                *si task.completed es false retorna un botón Start con un atributo
                 de dato personalizado donde se almacena task.id.

            *2. <div> class title..
                *task.title(texto en input).

    La cadena retornada se almacena en la variable 'html'y esta cadena de etiquetas <div class="task">
    se renderiza dentro de la etiqueta padre <div class="tasks">(con join('') cada cadena agregada se separa con '').

*//*Recorriendo Botones renderizados.

    En startButtons guardamos una coleccion NodeList de los botones renderizados del <div> task.

    A cada botón en el foreach se le agrega el evento click.
    al dispara el evento click...
        *si timer es false, ingresa al if, dentro del if...
            *se guarda en id el atributo data-id del botón.
            *se invoca la función startButtonHandler(id) y se pasa id por parámetro.
            *una vez termina la función el botón dice 'In progress'.

*/
function renderTasks() {
    const html = tasks.map(task => {
        return `
            <div class="task">
                <div class="completed">${task.completed ? 
                    `<span class="done">Done</span>` : 
                    `<button class="start-button" data-id="${task.id}">Start</button>`}
                </div>
                <div class="title">${task.title}</div>
            </div>        
        `;
    });

    const taskContainer = document.querySelector('#tasks');
    taskContainer.innerHTML = html.join('');

    const startButtons = document.querySelectorAll('.task .start-button');
    startButtons.forEach(button => {
        button.addEventListener('click', e => {
            if (!timer) {
                const id = button.getAttribute('data-id');
                startButtonHandler(id);
                button.textContent = 'In progress';
            }
        });
    });
}



/*Función startButtonHandler(id).

    parámetro: id del botón.
    Se agrega a time: 25m * 60s = 1500s.
    Se agrega a current: id que llega (atributo del botón 'data.id').
    Se agrega a taskIndex:
        *tasks es un arreglo de objetos.
        *en la fx findIndex (task) es cada uno de los objetos.
        *en la fx findIndex (task.id) es cada id de cada objeto.
        *busca id del objeto que sea igual al id que llega por parám.
        *retorna su pos y se almacena en taskIndex.

    taskName: <div id="taskName"></div>
    se agrega el titulo del objeto en la posicion del arreglo tasks.

    Se agrega a timer: el retorno de setInterval, el id para parar el
    intervalo.
    cada 1000ms(1s) se ejecuta:
        *la funcion timeHandler(id)

*/
function startButtonHandler(id) {
    // time = 25 * 60;
    time = 5;
    current = id;
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].title;

    renderTime();
    timer = setInterval(() => {
        timeHandler(id);
    }, 1000);
}


/*Función timeHandler(id).

    parámetro: id del botón.
    la variable time = 1500s decrementa en 1s.
    se invoca la función renderTime().

    Cuando vuelve de la función renderTime() se evalúa
    si time === 0. Si ya llegó a 0, se ejecutan las funciones:
        *clearInterval(timer): Detiene el setInterval
        *markCompleted(id): Cambia la propiedad 'completed' del objeto a true.
        *renderTasks();
        *startBreak();

*/
function timeHandler(id) {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timer);
        markCompleted(id);
        // timer = null;
        renderTasks();
        startBreak(id);        
    }
}


/*Función renderTime().

    con la division se obtienen los minutos.
    con el residuo se obtienen los segundos.

    minutes: 1500 / 60 = 25m, se convierte a número entero.
        *1500 / 60 = 25m.
        *1499 / 60 = 24m.
        *1498 / 60 = 23m.
        *etc.
    seconds: 1500 % 60 = 0s, se convierte a número entero.
        *1499 / 60 = 59s.
        *1498 / 60 = 58s.
        *1497 / 60 = 57s.
        *etc.

    En la etiqueta timeDiv = <div id="value"></div>
    se agrega la hora 00:00
*/
function renderTime() {
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes} :
                           ${seconds < 10 ? "0" : ""}${seconds}`;
}


/*Función markCompleted(id).

    parámetro: id del botón.
    task: el indice devuelto de comparar:
        *el (id) que llega por parámetro con...
        *el id del objeto task del arreglo tasks[].
    Cuando encuentra el objeto con este id, cambia la propiedad
    completed = true.

*/
function markCompleted(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = true;
}


/*Función startBreak().

    task: el indice devuelto de comparar:
        *el (id) que llega por parámetro con...
        *el id del objeto task del arreglo tasks[].
    Cuando encuentra el objeto con este id, cambia la propiedad
    completed = true.

*/
function startBreak(id){
    // time = 5 * 60;
    time = 3;
    taskName.textContent = 'Break';

    renderTime();
    timerBreak = setInterval(() => {
        timeBreakHandler(id);
    }, 1000);
}

function timeBreakHandler(id){
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timerBreak);
        current = null;
        timer = null;
        timerBreak = null;        
        taskName.textContent = `finished`;
        renderTasks();
    }
}


/*Error en el video

    Si reseteamos el timer en la function timeHandler():
        cuando termina la cuenta regresiva de 25min y comienza la del break,
        si tenemos otras tareas y las iniciamos, el programa se daña, el cronometro
        da números negativos.

    Si reseteamos el timer y el timerBreak en la function timeBreakHandler():
        se reinician solo hasta que el break de la primera cuenta regresiva termine.
*/


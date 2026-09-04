// Capturando os elementos HTML
const taskCont = document.getElementById("tasks-container");
const newTaskCont = document.getElementById("new-task-container");
const addTaskBtn = document.getElementById("add-task");
const deleteTaskBtn = document.getElementById("delete-task");
const discardBtn = document.getElementById("discard-task");
const saveTaskBtn = document.getElementById("save-task");
const modalEl = document.getElementById("discard-modal");
const confirmDiscardBtn = document.getElementById("yes");
const declineDiscardBtn = document.getElementById("no");
const inputTaskEl = document.getElementById("task-name");
const deadlineEl = document.getElementById("task-deadline");
const priorityEl = document.getElementById("task-priority");
const counterEl = document.getElementById("counter");
const counterParagEl = document.getElementById("counter-paragraph");

// Criando array de tasks
let savedTasks;

// Criando id global
let globalId;

// Funcao criada para controlar a visibilidade dos containers de task e de nova task
function handleVisibility() {
  taskCont.style.display = taskCont.style.display === "none" ? "flex" : "none";
  newTaskCont.style.display =
    newTaskCont.style.display === "flex" ? "none" : "flex";
  counterParagEl.style.display =
    counterParagEl.style.display === "none" ? "block" : "none";
  addTaskBtn.hidden = newTaskCont.style.display === "flex";
  deleteTaskBtn.hidden = newTaskCont.style.display === "flex";
}

/* Funcao criada para atualizar o container das tasks sempre que ha
uma mudanca nele*/
function updateTaskContainer() {
  savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskCont.innerHTML = savedTasks
    .map((task) => {
      const completedClass = task.isChecked ? "completed" : "";
      return `
      <div id="task-${task.id}" class="single-task-cont ${completedClass}" role="listitem">
        <input type="checkbox" aria-label="Select task: ${task.task}" class="complete-task" ${task.isChecked ? "checked" : ""}/>
        <p><strong>Task:</strong> ${task.task}</p>
        <p><strong>Deadline:</strong> ${formatDateBR(task.deadline)}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <label class="trash-checkbox">
          <input type="checkbox" class="delete-trigger" aria-label="Delete task: ${task.task}"/>
          <svg class="trash-icon" xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </label>
        <button type="button" class="edit-trigger" aria-label="Editar tarefa: ${task.task}">✎</button>
      </div>
    `;
    })
    .join("");
}

// Funcao criada para limpar os inputs para a adicao de uma nova task
function clearInput() {
  inputTaskEl.value = "";
  deadlineEl.value = "";
  priorityEl.value = "";
}

// Funcao criada para gerenciar o modal no caso de descarte da nova task
function handleModal(e) {
  if (e.target === confirmDiscardBtn) {
    handleVisibility();
  }
  modalEl.close();
}

// Funcao criada para salvar/atualizar a nova task no array
function saveTask(id = "") {
  if (id === "") {
    const newTask = {
      id: crypto.randomUUID(),
      task: inputTaskEl.value,
      deadline: deadlineEl.value,
      priority: priorityEl.value,
      isChecked: false,
    };
    savedTasks.push(newTask);
  } else {
    const currentTask = savedTasks.find((task) => task.id === id);
    if (currentTask) {
      currentTask.task = inputTaskEl.value;
      currentTask.deadline = deadlineEl.value;
      currentTask.priority = priorityEl.value;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

// Funcao criada para deletar a task do array
function deleteTask() {
  const tasksToDelete = [];
  const currentDivsTasks = taskCont.querySelectorAll(".single-task-cont");
  currentDivsTasks.forEach((task) => {
    const checkbox = task.querySelector(
      '.trash-checkbox input[type="checkbox"]',
    );
    if (checkbox.checked) tasksToDelete.push(task.id);
  });
  savedTasks = savedTasks.filter(
    (task) => !tasksToDelete.includes(`task-${task.id}`),
  );
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

// Funcao criada para alterar o formato da data para data local do Brasil
function formatDateBR(isoDate) {
  if (!isoDate) return "-";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

// Funcao criada para gerenciar a finalizacao de uma task
function handleCompletion(task) {
  // Styling
  const inputChecked = task.querySelector(".complete-task");
  task.classList.toggle("completed", inputChecked.checked);
  // Updating checked status in localStorage
  const taskId = task.id.replace("task-", "");
  const currentTask = savedTasks.find((task) => task.id === taskId);
  if (currentTask) {
    currentTask.isChecked = inputChecked.checked;
  }
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

// Funcao criada para atualizar o contador de tasks, caso uma seja concluida ou adicionada
function updateTaskCounter() {
  if (!savedTasks || !savedTasks.length) {
    counterEl.innerText = "";
    return;
  }
  const completedTasks = savedTasks.filter((task) => task.isChecked);
  counterEl.innerText = `${completedTasks.length}/${savedTasks.length}`;
}

// Funcao criada para abrir a edicao de tasks salvas com os dados atuais
function updateCurrentTask(e) {
  if (e.target.tagName === "DIV") {
    globalId = e.target.id.replace("task-", "");
  } else {
    globalId = e.target.parentElement.id.replace("task-", "");
  }
  const task = savedTasks.find((task) => task.id === globalId);
  handleVisibility();
  inputTaskEl.value = task.task;
  deadlineEl.value = task.deadline;
  priorityEl.value = task.priority;
  saveTaskBtn.innerText = "Update Task";
}

// Evento para adicionar task nova
addTaskBtn.addEventListener("click", () => {
  saveTaskBtn.innerText = "Save Task";
  globalId = "";
  clearInput();
  handleVisibility();
});

// Evento para discartar ou nao a nova task sendo adicionada
discardBtn.addEventListener("click", () => {
  if (
    inputTaskEl.value === "" &&
    deadlineEl.value === "" &&
    priorityEl.value === ""
  ) {
    handleVisibility();
  } else {
    modalEl.showModal();
  }
});

// Eventos para gerenciar o modal
confirmDiscardBtn.addEventListener("click", handleModal);
declineDiscardBtn.addEventListener("click", handleModal);

// Evento para salvar/atualizar a task no array e atualizar o container de tasks
saveTaskBtn.addEventListener("click", () => {
  saveTask(globalId);
  updateTaskContainer();
  updateTaskCounter();
  handleVisibility();
});

// Evento para deletar uma ou mais tasks selecionadas do array e atualizar o cont. de tasks
deleteTaskBtn.addEventListener("click", () => {
  deleteTask();
  updateTaskContainer();
  updateTaskCounter();
});

// Evento para carregar as tasks salvas no localStora assim que a pagina carrega
document.addEventListener("DOMContentLoaded", () => {
  updateTaskContainer();
  updateTaskCounter();
});

// Evento para marcar/desmarcar uma task como concluida e atualizar o contador
taskCont.addEventListener("change", (e) => {
  if (e.target.classList.contains("complete-task")) {
    handleCompletion(e.target.parentElement);
    updateTaskCounter();
  }
});

// Evento para atualizar uma task ja criada via botao
taskCont.addEventListener("click", (e) => {
  if (e.target.closest(".edit-trigger")) {
    updateCurrentTask(e);
  }
});

/*
 * Ordenacao por nome/deadline/prioridade/concluidas
 * Alerta visual de deadline proximo/vencido
 * Filtros de todas/pendentes/concluidas
 */

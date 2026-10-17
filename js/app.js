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
const filterEl = document.getElementById("filter");
const tasksContFootEl = document.getElementById("tasks-container-footer");

// Criando array de tasks
let savedTasks = [];

// Criando id global
let globalId = "";

// Criando Ordem de prioridade
const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};

// Criando Mapa de rotulos
const priorityLabels = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

// Constante para warning da deadline
const DEADLINE_WARNING_DAYS = 3;

// Constante para trabalhar com o localStorage de modo seguro
const STORAGE_KEY = "todo-list:tasks";

// Funcao criada para controlar a visibilidade dos containers de task e de nova task
function handleVisibility() {
  taskCont.style.display = taskCont.style.display === "none" ? "flex" : "none";
  newTaskCont.style.display =
    newTaskCont.style.display === "flex" ? "none" : "flex";
  tasksContFootEl.style.display =
    tasksContFootEl.style.display === "none" ? "flex" : "none";
  addTaskBtn.hidden = newTaskCont.style.display === "flex";
  deleteTaskBtn.hidden = newTaskCont.style.display === "flex";
}

/* Funcao criada para atualizar o container das tasks sempre que ha
uma mudanca nele*/
function updateTaskContainer() {
  savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  taskCont.innerHTML = getVisibleTasks()
    .map((task) => {
      const completedClass = task.isChecked ? "completed" : "";
      const deadlineClass = getDeadlineStatus(task);
      const safeTask = escapeHTML(task.task);
      const safePriority = escapeHTML(priorityLabels[task.priority] ?? "-");
      return `
      <div id="task-${task.id}" class="single-task-cont ${completedClass} ${deadlineClass}" role="listitem">
        <input type="checkbox" aria-label="Select task: ${safeTask}" class="complete-task" ${task.isChecked ? "checked" : ""}/>
        <p><strong>Task:</strong> ${safeTask}</p>
        <p><strong>Deadline:</strong> ${formatDateBR(task.deadline)}</p>
        <p><strong>Priority:</strong> ${safePriority}</p>
        <label class="trash-checkbox">
          <input type="checkbox" class="delete-trigger" aria-label="Delete task: ${safeTask}"/>
          <svg class="trash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </label>
        <button type="button" class="edit-trigger" aria-label="Edit task: ${safeTask}">✎</button>
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
      task: inputTaskEl.value.trim(),
      deadline: deadlineEl.value,
      priority: priorityEl.value,
      isChecked: false,
    };
    savedTasks.push(newTask);
  } else {
    const currentTask = savedTasks.find((task) => task.id === id);
    if (currentTask) {
      currentTask.task = inputTaskEl.value.trim();
      currentTask.deadline = deadlineEl.value;
      currentTask.priority = priorityEl.value;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTasks));
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTasks));
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

  task.classList.remove("behind-schedule", "tight-deadline");
  const status = currentTask ? getDeadlineStatus(currentTask) : "";
  if (status) task.classList.add(status);

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
  globalId = e.target.closest(".single-task-cont").id.replace("task-", "");
  const task = savedTasks.find((task) => task.id === globalId);
  handleVisibility();
  inputTaskEl.value = task.task;
  deadlineEl.value = task.deadline;
  priorityEl.value = task.priority;
  saveTaskBtn.innerText = "Update Task";
}

// Funcao para ordenar por prioridade
function priorityRank(priority) {
  return priorityOrder[priority] ?? 99;
}

// Funcao criada para exibir as tasks, dependendo do valor no option do select
function getVisibleTasks() {
  let tasks = [...savedTasks];

  switch (filterEl.value) {
    case "task":
      tasks.sort((a, b) => a.task.localeCompare(b.task));
      break;
    case "deadline":
      tasks.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      });
      break;
    case "priority":
      tasks.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
      break;
    case "finished":
      tasks = tasks.filter((task) => task.isChecked);
      break;
    case "not-finished":
      tasks = tasks.filter((task) => !task.isChecked);
      break;
  }
  return tasks;
}

// Funcao para dar escape em determinados inputs
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Funcao para formatar as datas para ISO, para facilitar
// o alerta de deadline proximo
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Retorna a classe de alerta da task ou "", se nao houver
function getDeadlineStatus(task) {
  if (task.isChecked || !task.deadline) return "";
  const now = new Date();
  const today = toISODate(now);
  const limit = toISODate(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + DEADLINE_WARNING_DAYS,
    ),
  );
  if (task.deadline < today) return "behind-schedule";
  if (task.deadline < limit) return "tight-deadline";
  return "";
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
  if (inputTaskEl.value.trim() === "") {
    inputTaskEl.focus();
    return;
  }
  if (globalId === "") filterEl.value = "reset";
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
    if (filterEl.value === "finished" || filterEl.value === "not-finished") {
      updateTaskContainer();
    }
  }
});

// Evento para atualizar uma task ja criada via botao
taskCont.addEventListener("click", (e) => {
  if (e.target.closest(".edit-trigger")) {
    updateCurrentTask(e);
  }
});

// Evento para aplicar os filtros de classificacao
filterEl.addEventListener("change", () => {
  updateTaskContainer();
});

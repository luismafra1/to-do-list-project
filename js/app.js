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

let savedTasks;

function handleVisibility() {
  taskCont.style.display = taskCont.style.display === "none" ? "flex" : "none";
  newTaskCont.style.display =
    newTaskCont.style.display === "flex" ? "none" : "flex";
  addTaskBtn.hidden = newTaskCont.style.display === "flex";
  deleteTaskBtn.hidden = newTaskCont.style.display === "flex";
}

function updateTaskContainer() {
  savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskCont.innerHTML = "";
  savedTasks.forEach((task) => {
    taskCont.innerHTML += `
      <div id="${task.id}" class="single-task-cont">
        <input type="checkbox" />
        <p><strong>Task:</strong> ${task.task}</p>
        <p><strong>Deadline:</strong> ${task.deadline}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
      </div>
    `;
  });
}

function clearInput() {
  inputTaskEl.value = "";
  deadlineEl.value = "";
  priorityEl.value = "";
}

function handleModal(e) {
  if (e.target === confirmDiscardBtn) {
    handleVisibility();
  }
  modalEl.close();
}

function saveTask() {
  const newTaskIndex = savedTasks.length;
  const newTask = {
    id: newTaskIndex,
    task: inputTaskEl.value,
    deadline: deadlineEl.value,
    priority: priorityEl.value,
  };
  savedTasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

function deleteTask() {
  const tasksToDelete = [];
  const currentDivsTasks = taskCont.querySelectorAll("div");
  currentDivsTasks.forEach((task) => {
    const checkbox = task.querySelector('input[type="checkbox"]');
    if (checkbox.checked) tasksToDelete.push(Number(task.id));
  });
  savedTasks = savedTasks.filter((task) => !tasksToDelete.includes(task.id));
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

addTaskBtn.addEventListener("click", () => {
  clearInput();
  handleVisibility();
});

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

confirmDiscardBtn.addEventListener("click", handleModal);
declineDiscardBtn.addEventListener("click", handleModal);

saveTaskBtn.addEventListener("click", () => {
  saveTask();
  updateTaskContainer();
  handleVisibility();
});

deleteTaskBtn.addEventListener("click", () => {
  deleteTask();
  updateTaskContainer();
});

document.addEventListener("DOMContentLoaded", updateTaskContainer);

/*
 * Pedir para o Claude verificar a logica dos arquivos;
 * Pedir para ele adicionar ARIA-Attributes, para acessibilidade;
 * Pedir para ele corrigir o redimensionamento da tela;
 * Pedir para ele verificar se alguma funcionalidade precisa/pode ser adicionada;
 * Pedir para ele corrigir o formato da data para DD/MM/YYYY.
 * Implementar edicao de task
 */

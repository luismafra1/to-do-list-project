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
  taskCont.innerHTML = savedTasks
    .map(
      (task) =>
        `
      <div id="task-${task.id}" class="single-task-cont" role="listitem">
        <input type="checkbox" aria-label="Selecionar tarefa: ${task.task}" />
        <p><strong>Task:</strong> ${task.task}</p>
        <p><strong>Deadline:</strong> ${formatDateBR(task.deadline)}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
      </div>
    `,
    )
    .join("");
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
  const newTask = {
    id: crypto.randomUUID(),
    task: inputTaskEl.value,
    deadline: deadlineEl.value,
    priority: priorityEl.value,
  };
  savedTasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

function deleteTask() {
  const tasksToDelete = [];
  const currentDivsTasks = taskCont.querySelectorAll(".single-task-cont");
  currentDivsTasks.forEach((task) => {
    const checkbox = task.querySelector('input[type="checkbox"]');
    if (checkbox.checked) tasksToDelete.push(task.id);
  });
  savedTasks = savedTasks.filter((task) => !tasksToDelete.includes(task.id));
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

function formatDateBR(isoDate) {
  if (!isoDate) return "-";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
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
  if (inputTaskEl.value.trim() === "") {
    inputTaskEl.focus();
    return;
  }
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
 * Implementar edicao de task
 * Implementar marcar como concluida sem deletar
 * (botao de lixeira separado para melhor visualizacao)
 * Implementar contador de tarefas pendentes/concluidas
 * Ordenacao por deadline/prioridade
 * Cor por prioidade
 * Alerta visual de deadline proximo/vencido
 * Filtros de todas/pendentes/concluidas
 */

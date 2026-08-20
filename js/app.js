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
        <input type="checkbox" aria-label="Select task: ${task.task}" class="complete-task" />
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

function formatDateBR(isoDate) {
  if (!isoDate) return "-";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function handleCompletion(task) {
  const inputChecked = task.querySelector(".complete-task");
  task.style.textDecoration = inputChecked.checked ? "line-through" : "none";
  task.style.fontStyle = inputChecked.checked ? "italic" : "normal";
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

taskCont.addEventListener("change", (e) => {
  if (e.target.classList.contains("complete-task"))
    handleCompletion(e.target.parentElement);
});

/*
 * Implementar edicao de task
 * Implementar contador de tarefas pendentes/concluidas
 * Ordenacao por deadline/prioridade
 * Cor por prioidade
 * Alerta visual de deadline proximo/vencido
 * Filtros de todas/pendentes/concluidas
 */

const taskCont = document.getElementById("tasks-container");
const newTaskCont = document.getElementById("new-task-container"); //used
const addTaskBtn = document.getElementById("add-task"); //used
const deleteTaskBtn = document.getElementById("delete-task");
const discardBtn = document.getElementById("discard-task"); //used
const saveTaskBtn = document.getElementById("save-task"); //used
const modalEl = document.getElementById("discard-modal"); //used
const confirmDiscardBtn = document.getElementById("yes"); //used
const declineDiscardBtn = document.getElementById("no"); //used
const inputTaskEl = document.getElementById("task-name");
const deadlineEl = document.getElementById("task-deadline");
const priorityEl = document.getElementById("task-priority");

const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

function handleVisibility() {
  taskCont.style.display = taskCont.style.display === "none" ? "flex" : "none";
  newTaskCont.style.display =
    newTaskCont.style.display === "flex" ? "none" : "flex";
}

function updateTaskContainer() {
  taskCont.innerHTML = `<h2>Tasks</h2>`;
  savedTasks.forEach((task) => {
    taskCont.innerHTML += `
      <div id="${task.id}" class="single-task-cont">
        <input type="checkbox" />
        <p>Task: ${task.task}</p>
        <p>Deadline: ${task.deadline}</p>
        <p>Priority: ${task.priority}</p>
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

document.addEventListener("DOMContentLoaded", updateTaskContainer);

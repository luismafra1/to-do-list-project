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

function clearInput() {
  inputTaskEl.value = "";
  deadlineEl.value = "";
  priorityEl.value = "";
}

function handleModal(e) {
  if (e.target === confirmDiscardBtn) {
    newTaskCont.style.display = "none";
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
  savedTasks.push(JSON.stringify(newTask));
  localStorage.setItem("tasks", savedTasks);
}

function updateTaskContainer() {
  //Implementar
}

addTaskBtn.addEventListener("click", () => {
  clearInput();
  newTaskCont.style.display = "flex";
});

discardBtn.addEventListener("click", () => {
  if (
    inputTaskEl.value === "" &&
    deadlineEl.value === "" &&
    priorityEl.value === ""
  ) {
    newTaskCont.style.display = "none";
  } else {
    modalEl.showModal();
  }
});

confirmDiscardBtn.addEventListener("click", handleModal);
declineDiscardBtn.addEventListener("click", handleModal);
saveTaskBtn.addEventListener("click", () => {
  saveTask();
  newTaskCont.style.display = "none";
});

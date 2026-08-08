const taskCont = document.getElementById("tasks-container");
const newTaskCont = document.getElementById("new-task-container");
const addTaskBtn = document.getElementById("add-task");
const deleteTaskBtn = document.getElementById("delete-task");
const discardBtn = document.getElementById("discard-task");
const saveTaskBtn = document.getElementById("save-task");

addTaskBtn.addEventListener(
  "click",
  () => (newTaskCont.style.display = "flex"),
);

//Implementar para verificar se os campos estao vazios e dar um pop para confirmar o discard
discardBtn.addEventListener(
  "click",
  () => (newTaskCont.style.display = "none"),
);

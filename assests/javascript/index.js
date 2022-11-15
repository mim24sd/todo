const baseUrl = "http://127.0.0.1:3030";

const newTask = document.getElementById("task-input");
const addTaskIcon = document.getElementById("add-task-icon");
const taskBox = document.getElementById("task-box");
const newTaskErrorMassage = document.getElementById("title-error");
const networkErrorMassage = document.getElementById("network-error");
const taskList = document.getElementById("task-list");
const filterTasksView = document.getElementById("filter-tasks");

newTask.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      handleNewTask(newTask.value);
      newTask.value = "";
    }
  },
  false
);

addTaskIcon.addEventListener("click", () => {
  setNewTask(newTask.value);
  newTask.value = "";
});

showAllTasks();
filterTasks();

async function handleNewTask(newTask) {
  removeErrors();
  await setNewTask(newTask);
  showAllTasks();
}

async function setNewTask(task) {
  try {
    const body = JSON.stringify({ text: task });
    const headers = { "Content-Type": "application/json" };

    const response = await fetch(`${baseUrl}/todos`, {
      method: "POST",
      body,
      headers,
    });

    const { result: { error }, } = { result: await response.json() };

    if (response.status === 400) {
      showInputErrorMassage(error);
    }
  } catch {
    showConnecionErrorMassage();
  }
}

async function getAllTasks() {
  try {
    const response = await fetch(`${baseUrl}/todos`);
    const { result: { data }, } = { result: await response.json() };

    return sortTasks(data);
  } catch {
    showConnecionErrorMassage();
  }
}

async function showAllTasks() {
  const tasks = await getAllTasks();

  taskList.innerHTML = tasks.map((task) => {
    return `<li class="task-box" id=${task.id}>
              <input type="checkbox" class="task-check-box" ${isChecked(task.isDone)}></input>
              <p class="task-title">${task.text}</p>
              <i class="fa-solid fa-pen-to-square edit-task-icon"></i>
              <i class="fa-solid fa-xmark delete-task-icon"></i>
            </li>`;}).join("");
}

async function filterTasks() {
  const tasks = await getAllTasks();
  console.log(tasks);

  const completedTasks = getCompletedTasks(tasks);
  const uncompletedTasks = getUncompletedTasks(tasks);

  filterTasksView.innerHTML = 
    `<li><a>All Tasks ${tasks.length}</a></li>
    <li><a>Completed ${completedTasks.length}</a></li>
    <li><a>Uncompleted ${uncompletedTasks.length}</a></li>`
}

function getCompletedTasks(tasks) {
  return tasks.filter((task) => {return task.isDone === true;});
}

function getUncompletedTasks(tasks) {
  return tasks.filter((task) => {return task.isDone === false;});
}

function sortTasks(tasks) {
  return tasks.sort((task1, task2) => new Date(task2.createdAt).getTime() - new Date(task1.createdAt).getTime());
}

function isChecked(isDone) {
  return isDone === true;
}

function showConnecionErrorMassage() {
  networkErrorMassage.style.visibility = "visible";
}

function showInputErrorMassage(errorText) {
  newTaskErrorMassage.innerHTML = `<p class="title-error">${errorText}</p>`;

  taskBox.classList.add("error-border");
}

function removeErrors() {
  removeInputError();
  removeNetworkError();
}

function removeInputError() {
  newTaskErrorMassage.innerHTML = "";
  taskBox.classList.remove("error-border");
}

function removeNetworkError() {
  networkErrorMassage.style.visibility = "hidden";
}

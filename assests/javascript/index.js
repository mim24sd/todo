const baseUrl = "http://127.0.0.1:3030";

const addTaskInput = document.getElementById("task-input");
const addTaskIcon = document.getElementById("add-task-icon");
const addTaskBox = document.getElementById("add-task-box");
const addTaskInputErrorMassage = document.getElementById("title-error");
const networkErrorMassage = document.getElementById("network-error");
const taskList = document.getElementById("task-list");
const filterTasksView = document.getElementById("filter-tasks");

addTaskInput.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      handleNewTask(addTaskInput.value);
    }
  }
);

addTaskIcon.addEventListener("click", () => {
  handleNewTask(addTaskInput.value);
});

showAllTasks();
filterTasks();

async function handleNewTask(newTask) {
  hideErrors();
  await addTask(newTask);
  showAllTasks();
}

async function addTask(task) {
  try {
    const body = JSON.stringify({ text: task });
    const headers = { "Content-Type": "application/json" };

    const response = await fetch(`${baseUrl}/todos`, {
      method: "POST",
      body,
      headers,
    });
    const {error} = await response.json();

    if (response.status === 400) {
      showInputError(error);
    }
  } catch {
    showNetworkError();
  }
}

async function getAllTasks() {
  try {
    const response = await fetch(`${baseUrl}/todos`);
    const {data} = await response.json();

    return sortTasks(data);
  } catch {
    showConnecionErrorMassage();
  }
}

async function showAllTasks() {
  const tasks = await getAllTasks();

  taskList.innerHTML = tasks.map((task) => {
    return `<li class="task-box tooltip" id=${task.id}>
              <input type="checkbox" class="task-check-box" ${isChecked(task.isDone)}></input>
              <p class="task-title">${task.text}</p>
              <i class="fa-solid fa-pen-to-square edit-task-icon"></i>
              <i class="fa-solid fa-xmark delete-task-icon"></i>

              <p class="tooltiptext">${convertTime(task.createdAt)}</p>
            </li>`;}).join("");
}

function convertTime(time) {
  const dateTime = new Date(time);
  
  const year = dateTime.toLocaleDateString("en-US", { year: "numeric" });
  const month = dateTime.toLocaleDateString("en-US", { month: "short" });
  const date = dateTime.toLocaleDateString("en-US", { day: "numeric" });

  return `${date} ${month} ${year}`;
}

async function filterTasks() {
  const tasks = await getAllTasks();

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

function showNetworkError() {
  networkErrorMassage.classList.add("visible");
}

function hideNetworkError() {
  networkErrorMassage.classList.remove("visible");
}

function showInputError(errorText) {
  addTaskInputErrorMassage.innerText = errorText;
  addTaskBox.classList.add("error");
}

function hideInputError() {
  addTaskInputErrorMassage.innerText = "";
  addTaskBox.classList.remove("error");
}

function hideErrors() {
  hideInputError();
  hideNetworkError();
}
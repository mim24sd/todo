const baseUrl = "http://127.0.0.1:3030";

const addTaskInput = document.getElementById("task-input");
const addTaskIcon = document.getElementById("add-task-icon");
const addTaskBox = document.getElementById("add-task-box");
const addTaskInputErrorMassage = document.getElementById("title-error");
const networkErrorMassage = document.getElementById("network-error");
const taskList = document.getElementById("task-list");
const allTasksCount = document.getElementById("all-tasks-count");
const completedTasksCount = document.getElementById("completed-tasks-count");
const uncompletedTasksCount = document.getElementById("uncompleted-tasks-count");

addTaskInput.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      handleNewTask(addTaskInput.value);
      clearNewTaskInput()
    }
  }
);

addTaskIcon.addEventListener("click", () => {
  handleNewTask(addTaskInput.value);
  clearNewTaskInput()
});

showAllTasks();

async function handleNewTask(newTask) {
  hideErrors();
  await addTask(newTask);
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
    const { error } = await response.json();

    if (response.status === 400) {
      showInputError(error);
    } else {
      showAllTasks();
    }
  } catch {
    showNetworkError();
  }
}

async function getAllTasks() {
  try {
    const response = await fetch(`${baseUrl}/todos`);
    const { data } = await response.json();

    return data;
  } catch {
    showConnecionErrorMassage();
  }
}

async function showAllTasks() {
  const tasks = sortTasks(await getAllTasks());

  taskList.innerHTML = tasks.map(({ id, text, isDone, createdAt }) => {
    return `<li class="task-box tooltip" id="${id}">
              <input type="checkbox" class="task-check-box" ${isChecked(isDone)}></input>
              <p class="task-title">${text}</p>
              <i class="fa-solid fa-pen-to-square edit-task-icon"></i>
              <i class="fa-solid fa-xmark delete-task-icon"></i>

              <p class="tooltiptext">${formatDate(createdAt)}</p>
            </li>`;
  }).join("");

  handleTaskEvents();
  classifyTasks(tasks);
}

function handleTaskEvents() {
  handleDeleteIcon();
  handleStatus();
}

function handleDeleteIcon() {
  const deleteTaskIcons = Array.from(document.getElementsByClassName("delete-task-icon"));

  deleteTaskIcons.forEach((deleteTaskIcon) => {
    deleteTaskIcon.addEventListener("click", (event) => {
      deleteTask(event.target.parentNode.id);
    })
  })
}

async function deleteTask(id) {
  try {
    await fetch(`${baseUrl}/todos/${id}`, {
      method: "DELETE"
    });

    showAllTasks();
  } catch {
    showNetworkError();
  }
}

function handleStatus() {
  const checkboxes = Array.from(document.querySelectorAll('input[type=checkbox]'));

  checkboxes.forEach((checkBox) => {
    checkBox.addEventListener("change", function (event) {
      updateTaskStatus(event.target.parentNode.id, this.checked);
    })
  })
}

async function updateTaskStatus(id, isDone) {
  try {
    const body = JSON.stringify({ isDone });
    const headers = { "Content-Type": "application/json" };

    await fetch(`${baseUrl}/todos/${id}`, {
      method: "PATCH",
      body,
      headers,
    });

    showAllTasks();
  } catch {
    showNetworkError();
  }
}

function isChecked(isDone) {
  return isDone ? "checked" : "";
}

function formatDate(time) {
  const dateTime = new Date(time);
  const year = dateTime.toLocaleDateString("en-US", { year: "numeric" });
  const month = dateTime.toLocaleDateString("en-US", { month: "short" });
  const day = dateTime.toLocaleDateString("en-US", { day: "numeric" });

  return `${day} ${month} ${year}`;
}

async function classifyTasks(tasks) {
  const completedTasks = getCompletedTasks(tasks);
  const uncompletedTasks = getUncompletedTasks(tasks);

  allTasksCount.innerText = tasks.length;
  completedTasksCount.innerText = completedTasks.length;
  uncompletedTasksCount.innerText = uncompletedTasks.length;
}

function getCompletedTasks(tasks) {
  return tasks.filter((task) => task.isDone);
}

function getUncompletedTasks(tasks) {
  return tasks.filter((task) => !task.isDone);
}

function sortTasks(tasks) {
  return sortTasksByIsDone(sortTasksByTime(tasks));
}

function sortTasksByTime(tasks) {
  return tasks.sort((task1, task2) => new Date(task2.createdAt).getTime() - new Date(task1.createdAt).getTime());
}

function sortTasksByIsDone(tasks) {
  return tasks.sort((task1, task2) => +task1.isDone - +task2.isDone);
}

function clearNewTaskInput() {
  addTaskInput.value = "";
}

function hideErrors() {
  hideInputError();
  hideNetworkError();
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

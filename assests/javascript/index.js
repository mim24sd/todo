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
const headers = { "Content-Type": "application/json" };

addTaskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleNewTask(addTaskInput.value);
    clearNewTaskInput();
  }
});

addTaskIcon.addEventListener("click", () => {
  handleNewTask(addTaskInput.value);
  clearNewTaskInput();
});

showAllTasks();

async function handleNewTask(newTask) {
  hideErrors();
  await addTask(newTask);
}

async function addTask(task) {
  try {
    const body = JSON.stringify({ text: task });

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

  taskList.innerHTML = tasks.map(({ id, text, isDone, createdAt, updatedAt }) => {
      return `<li class="task-box tooltip" id="${id}">
              <input type="checkbox" class="task-check-box" ${isChecked(isDone)}></input>
              <div id="title-box-${id}" class="title-box">
                <p class="task-title">${text}</p>
              </div>
              <i class="fa-solid fa-check-circle hidden" id="submit-task-icon-${id}"></i>
              <i class="fa-solid fa-pen-to-square edit-task-icon" id="edit-task-icon-${id}"></i>
              <i class="fa-solid fa-xmark delete-task-icon"></i>

              <div class="tooltip-text" id="tooltip-${id}">${getTooltipText(createdAt, updatedAt)}</div>
            </li>`;
    }).join("");

  handleTaskEvents();
  classifyTasks(tasks);
}

function getTooltipText(createdAt, updatedAt) {
  let tooltip = `<p>Created at : ${formatDate(createdAt)}</p>`;

  if (createdAt !== updatedAt) {
    tooltip += `<p>Updated at : ${formatDate(updatedAt)}</p>`;
  }

  return tooltip;
}

function handleTaskEvents() {
  handleDeleteIcon();
  handleStatus();
  handleTitle();
}

function handleDeleteIcon() {
  const deleteTaskIcons = Array.from(document.getElementsByClassName("delete-task-icon"));

  deleteTaskIcons.forEach((deleteTaskIcon) => {
    deleteTaskIcon.addEventListener("click", (event) => {
      deleteTask(event.target.parentNode.id);
    });
  });
}

async function deleteTask(id) {
  try {
    await fetch(`${baseUrl}/todos/${id}`, {
      method: "DELETE",
    });

    showAllTasks();
  } catch {
    showNetworkError();
  }
}

function handleStatus() {
  const checkboxes = Array.from(document.getElementsByClassName("task-check-box"));

  checkboxes.forEach((checkBox) => {
    checkBox.addEventListener("change", function (event) {
      updateTaskStatus(event.target.parentNode.id, this.checked);
    });
  });
}

async function updateTaskStatus(id, isDone) {
  try {
    const body = JSON.stringify({ isDone });

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

function handleTitle() {
  const editTaskIcons = Array.from(document.getElementsByClassName("edit-task-icon"));

  editTaskIcons.forEach((editTaskIcon) => {
    editTaskIcon.addEventListener("click", (event) => {
      const id = event.target.parentNode.id;
      const titleBox = document.getElementById(`title-box-${id}`);
      const taskTitle = titleBox.innerText;

      convertEditIconToSubmitIcon(id);
      convertTaskTitleToInput(id, taskTitle);
      editTaskTitle(id, taskTitle);
    });
  });
}

function convertEditIconToSubmitIcon(id) {
  hideEditIcon(id);
  showSubmitIcon(id);
}

function hideEditIcon(id) {
  const editIcon = document.getElementById(`edit-task-icon-${id}`);

  editIcon.classList.remove("edit-task-icon");
  editIcon.classList.add("hidden");
}

function showSubmitIcon(id) {
  const submitIcon = document.getElementById(`submit-task-icon-${id}`);

  submitIcon.classList.remove("hidden");
  submitIcon.classList.add("submit-task-icon");
}

function convertTaskTitleToInput(id, taskTitle) {
  const titleBox = document.getElementById(`title-box-${id}`);
  titleBox.innerHTML = `<input class="edit-task-title" id="edit-title-${id}" type="text" value="${taskTitle}"/>
                        <p id="edit-error-${id}" class="edit-title-error"></p>`;
}

function editTaskTitle(id, taskTitle) {
  const submitIcon = document.getElementById(`submit-task-icon-${id}`);

  submitIcon.addEventListener("click", function () {
    const newTaskTitle = document.querySelector("input[type=text]").value.trim();

    if (!newTaskTitle) {showEditEmptyInputError(id);}
    
    if (taskTitle !== newTaskTitle) {updateTitle(id, newTaskTitle);}
  });
}

async function showEditEmptyInputError(id) {
  const editTaskInput = document.getElementById(`edit-title-${id}`);
  const editTitleError = document.getElementById(`edit-error-${id}`);

  editTaskInput.classList.add("error");

  editTitleError.innerText = "Add title!";
}

async function updateTitle(id, text) {
  try {
    const body = JSON.stringify({ text });

    const response = await fetch(`${baseUrl}/todos/${id}`, {
      method: "PATCH",
      body,
      headers,
    });

    const { data } = await response.json();
    updateTaskBox(data);
  } catch {
    showNetworkError();
  }
}

async function updateTaskBox(editedTask) {
  convertSubmitIconToEditIcon(editedTask);
  convertInputToTaskTitle(editedTask);
  addUpdatedAtOnTooltip(editedTask);
}

function convertInputToTaskTitle({ id, text }) {
  const titleBox = document.getElementById(`title-box-${id}`);
  titleBox.innerHTML = `<p class="task-title">${text}</p>`;
}

function convertSubmitIconToEditIcon({ id }) {
  hideSubmitIcon(id);
  showEditIcon(id);
}

function addUpdatedAtOnTooltip({ id, createdAt, updatedAt }) {
  const tooltip = document.getElementById(`tooltip-${id}`);
  tooltip.innerHTML = `<p>Created at : ${formatDate(createdAt)}</p>
                       <p>Updated at : ${formatDate(updatedAt)}</p>`;
}

function showEditIcon(id) {
  const editIcon = document.getElementById(`edit-task-icon-${id}`);

  editIcon.classList.add("edit-task-icon");
  editIcon.classList.remove("hidden");
}

function hideSubmitIcon(id) {
  const submitIcon = document.getElementById(`submit-task-icon-${id}`);

  submitIcon.classList.add("hidden");
  submitIcon.classList.remove("submit-task-icon");
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

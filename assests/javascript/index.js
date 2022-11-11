const baseUrl = "http://127.0.0.1:3030/";

const newTask = document.getElementById("task-input");
const addTaskIcon = document.getElementById("add-task-icon");
const taskBox = document.getElementById("task-box");
const newTaskErrorMassage = document.getElementById("title-error");
const connectionErrorMassage = document.getElementById("connection-error");

newTask.addEventListener(
  "keypress",
  (event) => {
    if (event.key === "Enter") {
      setNewTask(newTask.value);
      newTask.value = "";
    }
  },
  false
);

addTaskIcon.addEventListener("click", () => {
  setNewTask(newTask.value);
  newTask.value = "";
});

async function setNewTask(task) {
  removeErrors();

  try {
    const body = JSON.stringify({ text: task });
    const headers = { "Content-Type": "application/json" };

    const response = await fetch(`${baseUrl}todos`, {
      method: "POST",
      body,
      headers,
    });

    const result = await response.json();

    if (response.status === 400) {
      showInputErrorMassage(result.error);
    }
  } catch {
    showConnecionErrorMassage();
  }
}

function showConnecionErrorMassage() {
  connectionErrorMassage.innerHTML = `
  <p class="connection-error">Something went wrong.</p>
  <p class="connection-error">Check your connection or try again later.</p>`;

  connectionErrorMassage.classList.remove("connection-error-empty-box");
  connectionErrorMassage.classList.add("connection-error-full-box");
}

function showInputErrorMassage(errorText) {
  newTaskErrorMassage.innerHTML = `<p class="title-error">${errorText}</p>`;

  taskBox.classList.remove("add-task-box");
  taskBox.classList.add("add-task-box-error");

  newTaskErrorMassage.classList.remove("title-error-empty-box");
  newTaskErrorMassage.classList.add("title-error-full-box");
}

function removeErrors() {
  newTaskErrorMassage.innerHTML = "";

  taskBox.classList.add("add-task-box");
  taskBox.classList.remove("add-task-box-error");

  newTaskErrorMassage.classList.add("title-error-empty-box");
  newTaskErrorMassage.classList.remove("title-error-full-box");

  connectionErrorMassage.innerHTML = "";

  connectionErrorMassage.classList.add("connection-error-empty-box");
  connectionErrorMassage.classList.remove("connection-error-full-box");
}

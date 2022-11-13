const baseUrl = "http://127.0.0.1:3030";

const newTask = document.getElementById("task-input");
const addTaskIcon = document.getElementById("add-task-icon");
const taskBox = document.getElementById("task-box");
const newTaskErrorMassage = document.getElementById("title-error");
const networkErrorMassage = document.getElementById("network-error");

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

async function handleNewTask(task) {
  removeErrors();
  setNewTask(task);
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

    const {result: { error }} = { result: await response.json() };

    if (response.status === 400) {
      showInputErrorMassage(error);
    }
  } catch {
    showConnecionErrorMassage();
  }
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

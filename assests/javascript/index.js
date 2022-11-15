const baseUrl = "http://127.0.0.1:3030";

const newTask = document.getElementById("task-input");
const addTaskIcon = document.getElementById("add-task-icon");
const addTaskBox = document.getElementById("add-task-box");
const newTaskErrorMassage = document.getElementById("title-error");
const networkErrorMassage = document.getElementById("network-error");

newTask.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Enter") {
      handleNewTask(newTask.value);
    }
  }
);

addTaskIcon.addEventListener("click", () => {
  handleNewTask(newTask.value);
});

async function handleNewTask(task) {
  removeErrors();
  addTask(task);
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

    const {result: { error }} = { result: await response.json() };

    if (response.status === 400) {
      showInputErrorMassage(error);
    }
  } catch {
    showConnecionErrorMassage();
  }
}

function showConnecionErrorMassage() {
  networkErrorMassage.classList.add("visible");
}

function showInputErrorMassage(errorText) {
  newTaskErrorMassage.innerHTML = `<p class="title-error">${errorText}</p>`;

  addTaskBox.classList.add("error");
}

function removeErrors() {
  removeInputError();
  removeNetworkError();
}

function removeInputError() {
  newTaskErrorMassage.innerHTML = "";
  addTaskBox.classList.remove("error");
}

function removeNetworkError() {
    networkErrorMassage.classList.remove("visible");
}

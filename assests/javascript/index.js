const baseUrl = "http://127.0.0.1:3030";

const addTaskInput = document.getElementById("task-input");
const addTaskIcon = document.getElementById("add-task-icon");
const addTaskBox = document.getElementById("add-task-box");
const addTaskInputErrorMassage = document.getElementById("title-error");
const networkErrorMassage = document.getElementById("network-error");

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

async function handleNewTask(task) {
  hideErrors();
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
    const {error} = await response.json();

    if (response.status === 400) {
      showInputError(error);
    }
  } catch {
    showNetworkError();
  }
}

function showNetworkError() {
  networkErrorMassage.classList.add("visible");
}

function hideNetworkError() {
  networkErrorMassage.classList.remove("visible");
}

function showInputError(errorText) {
  addTaskInputErrorMassage.innerHTML = `${errorText}`;
  addTaskBox.classList.add("error");
}

function hideInputError() {
  addTaskInputErrorMassage.innerHTML = "";
  addTaskBox.classList.remove("error");
}

function hideErrors() {
  hideInputError();
  hideNetworkError();
}
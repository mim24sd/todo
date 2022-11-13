const baseUrl = "http://127.0.0.1:3030";

const newTask = document.getElementById("task-input");
const addTaskIcon = document.getElementById("add-task-icon");
const taskBox = document.getElementById("task-box");
const newTaskErrorMassage = document.getElementById("title-error");
const networkErrorMassage = document.getElementById("network-error");

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
  newTaskErrorMassage.innerHTML = "";
  taskBox.classList.remove("error");

  networkErrorMassage.style.visibility = "hidden";
}

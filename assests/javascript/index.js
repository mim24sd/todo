const taskBox = document.getElementById("task1");

function showHoveredTaskBox() {
  taskBox.innerHTML = `
    <ul class="task-box">
      <li><input class="edit-task-input"></input></li>
      <li><i class="fa-solid fa-pen-to-square edit-task-icon"></i></li>
      <li> <i class="fa-solid fa-xmark delete-task-icon"></i></li>
    </ul>`;
}

function showTaskBox() {
  taskBox.innerHTML = `
    <ul class="task-box">
      <li><p class="task-title">enjoy life!</p></li>
    </ul>`;
}

taskBox.addEventListener("mousemove", () => {showHoveredTaskBox()});

taskBox.addEventListener("mouseout", () => {showTaskBox()});

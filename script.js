console.log("JavaScript Connected");

// Get Elements

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");

const addTaskButton = document.getElementById("addTask");
const taskContainer = document.getElementById("taskContainer");

// Variables

const tasks = [];
let editIndex = -1;

// Add / Update Task

addTaskButton.addEventListener("click", function () {
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const priority = priorityInput.value;
  const dueDate = dueDateInput.value;

  if (title === "") {
    alert("Please enter a task title.");
    return;
  }

  const task = {
    title,
    description,
    priority,
    dueDate,
    completed: false,
  };

  // Update Existing Task
  if (editIndex !== -1) {
    task.completed = tasks[editIndex].completed;

    tasks[editIndex] = task;

    editIndex = -1;

    addTaskButton.textContent = "Add Task";
  }
  // Add New Task
  else {
    tasks.push(task);
  }
  saveTasks();
  clearForm();
  displayTasks();
});

// Display Tasks

function displayTasks() {
  taskContainer.innerHTML = "";

  if (tasks.length === 0) {
    taskContainer.innerHTML = `
            <div class="empty-state">
                <h2> No Tasks Yet</h2>
                <p>Create your first task.</p>
            </div>
        `;

    return;
  }

  tasks.forEach((task, index) => {
    const taskCard = document.createElement("div");

    taskCard.className = "task";

    if (task.completed) {
      taskCard.classList.add("completed");
    }

    taskCard.innerHTML = `

        <div class="task-row1">

            <h3 class="task-title">
                📘 ${task.title}
            </h3>

            <div class="task-meta">

                <span class="priority ${task.priority}">
                    ${task.priority.toUpperCase()}
                </span>

                <span class="task-date">
                    📅 ${task.dueDate || "No Date"}
                </span>

            </div>

        </div>

        <div class="task-row2">

            <p class="task-description">
                ${task.description || "No Description"}
            </p>

            <div class="task-buttons">

                <button class="action-btn edit-btn" data-index="${index}">
                    ✏
                </button>

                <button class="action-btn delete-btn" data-index="${index}">
                    🗑
                </button>

                <button class="action-btn complete-btn" data-index="${index}">
                    ${task.completed ? "↩" : "✓"}
                </button>

            </div>

        </div>

        `;

    taskContainer.appendChild(taskCard);
  });

  addEventListeners();
}

// Event Listeners

function addEventListeners() {
  // DELETE

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.dataset.index;

      tasks.splice(index, 1);
      saveTasks();
      displayTasks();
    });
  });

  // COMPLETE

  document.querySelectorAll(".complete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.dataset.index;

      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      displayTasks();
    });
  });

  // EDIT

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.dataset.index;

      titleInput.value = tasks[index].title;

      descriptionInput.value = tasks[index].description;

      priorityInput.value = tasks[index].priority;

      dueDateInput.value = tasks[index].dueDate;

      editIndex = index;

      addTaskButton.textContent = "Update Task";
    });
  });
}

// Clear Form

function clearForm() {
  titleInput.value = "";

  descriptionInput.value = "";

  priorityInput.value = "medium";

  dueDateInput.value = "";
}
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    tasks.push(...JSON.parse(savedTasks));
  }
}
// Initial Load
loadTasks();
displayTasks();

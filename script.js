console.log("JavaScript Connected");

// Get Elements

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
const searchInput = document.getElementById("searchInput");
const addTaskButton = document.getElementById("addTask");
const taskContainer = document.getElementById("taskContainer");
const sortTasks = document.getElementById("sortTasks");
const titleError = document.getElementById("titleError");

// Variables

const tasks = [];
let editIndex = -1;
let currentFilter = "all";


// Add / Update Task

addTaskButton.addEventListener("click", function () {
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const priority = priorityInput.value;
  const dueDate = dueDateInput.value;

  if (title === "") {

    titleError.textContent = "⚠ Task title is required.";

    titleInput.focus();

    return;

}
titleError.textContent = "";

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
    tasks.unshift(task);
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
  //filter
  let filteredTasks = [...tasks];
  const searchText = searchInput.value.toLowerCase();

filteredTasks = filteredTasks.filter(task =>

    task.title.toLowerCase().includes(searchText) ||

    task.description.toLowerCase().includes(searchText)

);


if(currentFilter === "completed"){

    filteredTasks = filteredTasks.filter(task => task.completed);

}

if(currentFilter === "pending"){

    filteredTasks = filteredTasks.filter(task => !task.completed);

}

 if (sortTasks.value === "oldest") {

        filteredTasks.reverse();

    }

    else if (sortTasks.value === "priority") {

        const priorityOrder = {
            high: 1,
            medium: 2,
            low: 3
        };

        filteredTasks.sort((a, b) => {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

    }

    else if (sortTasks.value === "date") {

        filteredTasks.sort((a, b) => {

            const dateA = a.dueDate || "9999-12-31";
            const dateB = b.dueDate || "9999-12-31";

            return new Date(dateA) - new Date(dateB);

        });

    }


  filteredTasks.forEach((task) => {

    const originalIndex = tasks.indexOf(task);
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

                <button class="action-btn edit-btn" data-index="${originalIndex}">
                    ✏
                </button>

                <button class="action-btn delete-btn" data-index="${originalIndex}">
                    🗑
                </button>

                <button class="action-btn complete-btn" data-index="${originalIndex}">
                    ${task.completed ? "↩" : "✓"}
                </button>

            </div>

        </div>

        `;

    taskContainer.appendChild(taskCard);
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

searchInput.addEventListener("input", function(){

    displayTasks();

});
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function(button){

    button.addEventListener("click", function(){

        // Remove active class
        filterButtons.forEach(function(btn){

            btn.classList.remove("active");

        });

        // Highlight clicked button
        this.classList.add("active");

        // Save selected filter
        currentFilter = this.dataset.filter;

        // Refresh task list
        displayTasks();

    });

});
// Event Listeners


taskContainer.addEventListener("click", function (event) {

    const button = event.target;

    if (!button.dataset.index) return;

    const index = Number(button.dataset.index);

    // Delete
    if (button.classList.contains("delete-btn")) {

        tasks.splice(index, 1);

        saveTasks();

        displayTasks();

    }

    // Complete
    else if (button.classList.contains("complete-btn")) {

        tasks[index].completed = !tasks[index].completed;

        saveTasks();

        displayTasks();

    }

    // Edit
    else if (button.classList.contains("edit-btn")) {

        titleInput.value = tasks[index].title;

        descriptionInput.value = tasks[index].description;

        priorityInput.value = tasks[index].priority;

        dueDateInput.value = tasks[index].dueDate;

        editIndex = index;

        addTaskButton.textContent = "Update Task";

    }

});

sortTasks.addEventListener("change", function(){

    displayTasks();

});
// Initial Load
loadTasks();
displayTasks();

const filterButtons = document.querySelectorAll(".filter-button");
const panels = document.querySelectorAll(".content-panel");
const subtitle = document.getElementById("subtitle");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskButton");
const allTasksContainer = document.getElementById("all");
const contentContainer = document.getElementById("content-container");
const popup = document.getElementById("error-popup");
const closeBtn = document.getElementById("close-btn");

let tasks = [];

/* ---------------- FILTER BUTTONS ---------------- */

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");

    const filterValue = button.dataset.filter;
    const targetPanel = document.getElementById(filterValue);

    if (targetPanel) targetPanel.classList.add("active");
  });
});

/* ---------------- LOAD PAGE ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();
  fetchAdvice();
});

/* ---------------- ADVICE API ---------------- */

async function fetchAdvice() {
  try {
    const response = await fetch("https://api.adviceslip.com/advice");
    const data = await response.json();
    subtitle.textContent = `"${data.slip.advice}"`;
  } catch (error) {
    console.error("Advice fetch error:", error);
    subtitle.textContent = "Could not fetch advice.";
  }
}

/* ---------------- ADD TASK ---------------- */

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const value = taskInput.value.trim();

  if (!value) {
    showErrorPopup();
    return;
  }

  const newTask = {
    id: Date.now(),
    taskName: value,
    completed: false,
  };

  tasks.push(newTask);

  taskInput.value = "";

  saveTasks();
  renderTasks();
}

/* ---------------- STORAGE ---------------- */

function saveTasks() {
  localStorage.setItem("usersTask", JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem("usersTask"));

    if (Array.isArray(saved)) {
      tasks = saved;
    }
  } catch (err) {
    console.error("Storage error:", err);
    localStorage.removeItem("usersTask");
  }
}

/* ---------------- RENDER ---------------- */

function renderTasks() {
  allTasksContainer.innerHTML = "";

  if (tasks.length === 0) {
    renderEmptyState();
    return;
  }

  tasks.forEach((task) => {
    const taskHTML = `
    <div class="checkbox-container ${task.completed ? "completed" : ""}" data-id="${
      task.id
    }">
      
      <div class="check-item">
        <input 
          type="checkbox" 
          class="checkbox"
          ${task.completed ? "checked" : ""}
        />

        <span class="text">${task.taskName}</span>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        class="bi bi-trash3-fill"
        viewBox="0 0 16 16"
        id="delete"
      >
        <path
          d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 
          2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 
          3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 
          1 6.5 0h3A1.5 1.5 0 0 1 11 1.5"
        />
      </svg>

    </div>
    `;

    allTasksContainer.insertAdjacentHTML("beforeend", taskHTML);
  });
}

/* ---------------- EMPTY STATE ---------------- */

function renderEmptyState() {
  const emptyHTML = `
  <div class="empty-task">
    <div class="empty-icon-container">
      <img src="./assets/icon.svg" height="35" width="35"/>
    </div>
    <p class="empty-heading">No task yet.</p>
    <p class="empty-text">
      Your task list is empty. Add a task to begin 😁
    </p>
  </div>
  `;

  allTasksContainer.insertAdjacentHTML("beforeend", emptyHTML);
}

/* ---------------- DELETE TASK ---------------- */

contentContainer.addEventListener("click", (e) => {
  if (e.target.id === "delete") {
    const taskElement = e.target.closest(".checkbox-container");
    const id = Number(taskElement.dataset.id);

    tasks = tasks.filter((task) => task.id !== id);

    saveTasks();
    renderTasks();
  }
});

/* ---------------- TOGGLE COMPLETE ---------------- */

contentContainer.addEventListener("change", (e) => {
  if (e.target.classList.contains("checkbox")) {
    const taskElement = e.target.closest(".checkbox-container");
    const id = Number(taskElement.dataset.id);

    const task = tasks.find((t) => t.id === id);

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
  }
});

/* ---------------- ERROR POPUP ---------------- */

function showErrorPopup() {
  popup.classList.remove("manual-close");

  void popup.offsetWidth;

  popup.classList.add("animate-popup");
}

closeBtn.addEventListener("click", () => {
  popup.classList.add("manual-close");

  setTimeout(() => {
    popup.classList.remove("animate-popup", "manual-close");
  }, 500);
});

popup.addEventListener("animationend", (e) => {
  if (e.animationName === "dropBounceWait") {
    popup.classList.remove("animate-popup");
  }
});

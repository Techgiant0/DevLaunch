const filterButtons = document.querySelectorAll(".filter-button");
const panels = document.querySelectorAll(".content-panel");
const subtitle = document.getElementById("subtitle");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskButton");
const allTasks = document.querySelector("#all");
const activeTasks = document.getElementById("active");
const completedTasks = document.getElementById("completed");
const popup = document.getElementById("error-popup");
const closeBtn = document.getElementById("close-btn");
const contentContainer = document.getElementById("content-container");
const emptyTask = document.getElementsByClassName("empty-task");
const deleteBtn = document.getElementById('delete')
const tasks = [];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // 1. Reset all buttons and panels
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));

    // 2. Activate the clicked button
    button.classList.add("active");

    // 3. Activate the matching panel
    const filterValue = button.getAttribute("data-filter");
    const targetPanel = document.getElementById(filterValue);
    if (targetPanel) {
      targetPanel.classList.add("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const getAdvice = async () => {
    try {
      const response = await fetch("https://api.adviceslip.com/advice");
      const data = await response.json();
      subtitle.textContent = `"${data.slip.advice}"`;
    } catch (error) {
      console.error("Error fetching advice:", error);
      subtitle.textContent = "Could not fetch advice at this time.";
    }
  };

  getAdvice();
});

addTaskBtn.addEventListener("click", Addtasks);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    Addtasks();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const savedTasks = localStorage.getItem("usersTask");
  if (savedTasks) {
    allTasks.innerHTML = "";
    const parsedTasks = JSON.parse(savedTasks);
    tasks.push(...parsedTasks);
    renderTasks();
  }
});

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

function Addtasks() {
  if (!taskInput.value.trim()) {
    popup.classList.remove("manual-close");
    void popup.offsetWidth;
    popup.classList.add("animate-popup");
  } else {
    createTasks();
    saveTasks();
    renderTasks();
  }
}

function createTasks() {
  allTasks.innerHTML = "";
  const taskInputVal = {
    taskName: taskInput.value,
  };
  const taskObj = { ...taskInputVal, id: tasks.length + 1 };
  tasks.push(taskObj);
  taskInput.value = "";
}

function saveTasks() {
  localStorage.setItem("usersTask", JSON.stringify(tasks));
}

function renderTasks() {
  const savedTasks = localStorage.getItem("usersTask");
  const parsedTask = JSON.parse(savedTasks);
  parsedTask.forEach((currentTask) => {
    const eachTaskContainer = ` <div class="checkbox-container">
              <div class="check-item">
                <input type="checkbox" />
                <span>${currentTask.taskName}</span>
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
                  d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                />
              </svg>
            </div>b`;
    allTasks.insertAdjacentHTML("beforeend", eachTaskContainer);
  });
}

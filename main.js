const filterButtons = document.querySelectorAll(".filter-button");
const panels = document.querySelectorAll(".content-panel");
const subtitle = document.getElementById("subtitle");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskButton");
const allTasks = document.querySelector("#all .empty-task");
const activeTasks = document.getElementById("active");
const completedTasks = document.getElementById("completed");
const popup = document.getElementById("error-popup");
const closeBtn = document.getElementById("close-btn");
const contentContainer = document.getElementById("content-container");
const emptyTask = document.getElementsByClassName("empty-task");

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

/* Add Task
remove no task banner
get task from input
store as object with id in an array in localstorage
retrieve it
then display */

const tasks = [];

function Addtasks() {
  if (!taskInput.value.trim()) {
    popup.classList.remove("manual-close");
    void popup.offsetWidth;
    popup.classList.add("animate-popup");
  } else {
    allTasks.remove();
    const taskInputVal = {
      taskName: taskInput.value,
    };
    const taskObj = { ...taskInputVal, id: tasks.length + 1 };
    tasks.push(taskObj);
    taskInput.value = "";
    localStorage.setItem("usersTask", JSON.stringify(tasks));
    const savedTasks = localStorage.getItem("usersTask");
    const parsedTask = JSON.parse(savedTasks);
    console.log(parsedTask);

    parsedTask.forEach(()=>{
      allTasks.insertAdjacentHTML("beforeend", );
    })
  }
}

addTaskBtn.addEventListener("click", Addtasks);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    Addtasks();
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

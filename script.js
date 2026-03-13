const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const taskList = document.getElementById("task");
const emptyState = document.getElementById("empty-state");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");

const STORAGE_KEY = "tasks";

let tasks = loadTasks();
let currentFilter = "all";

renderTasks();

function loadTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

addButton.addEventListener("click", addTask);

function addTask() {
  const text = inputField.value.trim();
  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(newTask);

  inputField.value = "";

  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((t) => !t.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");

  li.className =
    "flex items-center justify-between bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:shadow-md transition duration-200";


    li.innerHTML = `
       <div class="flex items-center gap-3 flex-1">

    <input 
      type="checkbox"
      class="w-5 h-5 accent-green-500 cursor-pointer"
      ${task.completed ? "checked" : ""}
    >

    <span class="flex-1 ${
      task.completed ? "line-through text-gray-400" : "text-gray-800"
    }">
      ${task.text}
    </span>

  </div>

  <button 
    class="delete-btn flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-100 transition"
  >
    <i class="fa-solid fa-trash-can" style="color: #3949AB;"></i>
  </button>
    `;

    li.querySelector("input").addEventListener("change", () => {
      task.completed = !task.completed;

      saveTasks();
      renderTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);

      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  updateFooter();
}

function updateFooter() {
  const activeTasks = tasks.filter((t) => !t.completed).length;

  itemsLeft.textContent = `${activeTasks} items left`;

  if (tasks.length === 0) {
    emptyState.style.display = "flex";
  } else {
    emptyState.style.display = "none";
  }
}

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);

  saveTasks();
  renderTasks();
});

document.getElementById("filter-all").onclick = () => {
  currentFilter = "all";
  renderTasks();
};

document.getElementById("filter-active").onclick = () => {
  currentFilter = "active";
  renderTasks();
};

document.getElementById("filter-completed").onclick = () => {
  currentFilter = "completed";
  renderTasks();
};

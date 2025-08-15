// ===== Theme Toggle =====
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

// ===== Weather Widget =====
const weatherData = document.getElementById("weatherData");
const API_KEY = "YOUR_OPENWEATHER_API_KEY"; // Replace with your real API key

function fetchWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            if (data.cod === 200) {
                weatherData.textContent = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
            } else {
                weatherData.textContent = "Weather data unavailable";
            }
        })
        .catch(() => {
            weatherData.textContent = "Unable to load weather";
        });
}

// Try to get location
navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
    () => {
        // Fallback: Default to London if denied
        fetchWeather(51.5074, -0.1278);
    }
);

// ===== Quote Widget =====
const quoteText = document.getElementById("quoteText");
function loadQuote() {
    fetch("https://api.quotable.io/random")
        .then(res => res.json())
        .then(data => {
            quoteText.textContent = `"${data.content}" — ${data.author}`;
        })
        .catch(() => {
            // Fallback quote if API fails
            quoteText.textContent = `"Stay positive, work hard, make it happen." — Unknown`;
        });
}
loadQuote();

// ===== Task Manager =====
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.completed) li.classList.add("completed");

        const actions = document.createElement("div");

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "✔";
        toggleBtn.onclick = () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.onclick = () => {
            tasks.splice(index, 1);
            saveTasks();
        };

        actions.appendChild(toggleBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

addTaskBtn.addEventListener("click", () => {
    if (taskInput.value.trim() !== "") {
        tasks.push({ text: taskInput.value, completed: false });
        taskInput.value = "";
        saveTasks();
    }
});

renderTasks();


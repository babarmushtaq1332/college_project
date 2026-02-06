// Smooth scroll for navigation
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// Active ngrok URL
const API_URL = "https://arnita-piscicultural-daisey.ngrok-free.dev/students";

// Load all students
function loadStudents() {
  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      const table = document.getElementById("studentTable");
      table.innerHTML = "";
      document.getElementById("totalStudents").innerText = data.length;

      data.forEach(s => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${s.id}</td>
          <td>${s.name}</td>
          <td>${s.course}</td>
        `;
        table.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Error fetching students:", err);
      alert("Failed to load students. Check your backend or ngrok URL.");
    });
}

// Add a new student
function addStudent() {
  const name = document.getElementById("name").value.trim();
  const course = document.getElementById("course").value.trim();

  if (!name || !course) {
    alert("Please fill all fields");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, course })
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to add student");
      return res.json();
    })
    .then(() => {
      document.getElementById("name").value = "";
      document.getElementById("course").value = "";
      loadStudents();
    })
    .catch(err => {
      console.error("Error adding student:", err);
      alert("Failed to add student. Check your backend or ngrok URL.");
    });
}

// Fake dashboard animation
setInterval(() => {
  const status = document.querySelector(".stat p");
  if (status) {
    status.style.color = status.style.color === "green" ? "black" : "green";
  }
}, 1000);

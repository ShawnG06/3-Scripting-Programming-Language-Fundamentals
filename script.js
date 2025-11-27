let courses = [];
let filteredCourses = [];

class Course {
  constructor(obj){
    this.id =obj.id;
    this.title = obj.title;
    this.department = obj.department;
    this.level=obj.level;
    this.credits =obj.credits;
    this.instructor = obj.instructor;
    this.description =obj.description;
    this.semester = obj.semester;
  }
getDetailsHTML() {
    return `
      <strong>${this.id} — ${this.title}</strong><br>
      <p><strong>Instructor:</strong> ${this.instructor}</p>
      <p><strong>Level:</strong> ${this.level}</p>
      <p><strong>Credits:</strong> ${this.credits}</p>
      <p><strong>Semester:</strong> ${this.semester}</p>
      <p>${this.description}</p>
    `;
  }
}

document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const json = JSON.parse(e.target.result);

      courses = json.map(obj => new Course(obj));
      filteredCourses = courses;

      generateDropdowns();
      displayCourses(filteredCourses);

      document.getElementById("error").textContent = "";
    } catch {
      document.getElementById("error").textContent =
        "Error: Invalid JSON format.";
    }
  };

  reader.readAsText(file);
});

function generateDropdowns() {
  const levelSet = new Set();
  const creditsSet = new Set();
  const instructorSet = new Set();

  for (let c of courses) {
    levelSet.add(c.level);
    creditsSet.add(c.credits);
    instructorSet.add(c.instructor);
  }

  fillSelect("levelFilter", levelSet);
  fillSelect("creditsFilter", creditsSet);
  fillSelect("instructorFilter", instructorSet);
}

function fillSelect(id, values) {
  const sel = document.getElementById(id);
  sel.innerHTML = `<option value="">All</option>`;
  values.forEach(v => {
    sel.innerHTML += `<option value="${v}">${v}</option>`;
  });
}

document.querySelectorAll("#filtesRow select").forEach(sel => {
  sel.addEventListener("change", applyFilters);
});

function applyFilters() {
  const level = document.getElementById("levelFilter").value;
  const credits = document.getElementById("creditsFilter").value;
  const instructor = document.getElementById("instructorFilter").value;

  filteredCourses = courses.filter(c => {
    return (level === "" || c.level == level) &&
           (credits === "" || c.credits == credits) &&
           (instructor === "" || c.instructor === instructor);
  });

  applySort();
  displayCourses(filteredCourses);
}

document.getElementById("sortSelect").addEventListener("change", applySort);

function applySort() {
  const sort = document.getElementById("sortSelect").value;

  if (sort === "title-asc") {
    filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
  }
  else if (sort === "title-desc") {
    filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
  }
  else if (sort === "id") {
    filteredCourses.sort((a, b) => a.id.localeCompare(b.id));
  }
  else if (sort === "semester") {
    filteredCourses.sort((a, b) =>
      semesterToNumber(a.semester) - semesterToNumber(b.semester)
    );
  }

  displayCourses(filteredCourses);
}

function semesterToNumber(str) {
  const [season, year] = str.split(" ");
  const map = { Winter: 1, Spring: 2, Summer: 3, Fall: 4 };
  return parseInt(year) * 10 + map[season];
}


function displayCourses(list) {
  const ul = document.getElementById("courseUl");
  ul.innerHTML = "";

  list.forEach(course => {
    const li = document.createElement("li");
    li.textContent = `${course.id} — ${course.title}`;
    li.addEventListener("click", () => {
      showDetails(course);
    });
    ul.appendChild(li);
  });

  if (list.length === 0) {
    ul.innerHTML = "<li>No courses found.</li>";
  }
}

function showDetails(course) {
  document.getElementById("courseDetails").innerHTML =
    course.getDetailsHTML();
}

// FORCE UPDATE - 26 May 2026 - Student Google Sheets Login Active

const currentPage = window.location.pathname.split("/").pop();

// GOOGLE APPS SCRIPT URL
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzX8XThJwoEGNuVL-NKN7K41hYv_3QbLNdWyhwosoolLERe6C2EmXuu6yp8L6MJh49kYw/exec";

// DEFAULT JOBS
if (!localStorage.getItem("topgrade_jobs")) {
  const sampleJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      category: "Jobs",
      type: "Full Time",
      location: "Hyderabad",
      salary: "12 LPA",
      description: "React Developer Opportunity",
      applyLink: "https://careers.google.com",
      date: new Date().toISOString()
    },
    {
      id: 2,
      title: "AI Internship",
      company: "Microsoft",
      category: "Internships",
      type: "Internship",
      location: "Remote",
      salary: "30,000 / Month",
      description: "AI Internship Program",
      applyLink: "https://careers.microsoft.com",
      date: new Date().toISOString()
    },
    {
      id: 3,
      title: "National Hackathon",
      company: "Topgrade",
      category: "Hackathons",
      type: "Competition",
      location: "Online",
      salary: "Prize Pool 1 Lakh",
      description: "24 Hours National Hackathon",
      applyLink: "https://topgradeinnovation.com",
      date: new Date().toISOString()
    }
  ];
  localStorage.setItem("topgrade_jobs", JSON.stringify(sampleJobs));
}

// ====================== LOGIN PAGE ======================
if (currentPage === "index.html" || currentPage === "") {
  const adminTab = document.getElementById("adminTab");
  const studentTab = document.getElementById("studentTab");
  const adminForm = document.getElementById("adminLoginForm");
  const studentForm = document.getElementById("studentLoginForm");

  if (adminTab && studentTab) {
    adminTab.onclick = () => {
      adminTab.classList.add("active");
      studentTab.classList.remove("active");
      adminForm.classList.remove("hidden");
      studentForm.classList.add("hidden");
    };

    studentTab.onclick = () => {
      studentTab.classList.add("active");
      adminTab.classList.remove("active");
      studentForm.classList.remove("hidden");
      adminForm.classList.add("hidden");
    };
  }

  if (adminForm) {
    adminForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("adminEmail").value;
      const password = document.getElementById("adminPassword").value;

      if (email === "admin@topgrade.com" && password === "admin123") {
        localStorage.setItem("role", "admin");
        window.location.href = "admin.html";
      } else {
        alert("Invalid Admin Credentials");
      }
    });
  }

  if (studentForm) {
    studentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const studentName = document.getElementById("studentName").value.trim();
      const studentEmail = document.getElementById("studentEmail").value.trim();
      const studentId = document.getElementById("studentId").value.trim().toUpperCase();

      if (!studentName || !studentEmail || !studentId) {
        alert("Please fill all fields");
        return;
      }

      const submitBtn = studentForm.querySelector("button");
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = "Verifying...";
      submitBtn.disabled = true;

      try {
        const response = await fetch(WEB_APP_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "verifyStudent",
            name: studentName,
            email: studentEmail,
            code: studentId
          })
        });

        const result = await response.json();

        if (result.success) {
          localStorage.setItem("role", "student");
          localStorage.setItem("student_id", studentId);
          localStorage.setItem("student_name", studentName);
          alert("✅ Login Successful!");
          window.location.href = "student.html";
        } else {
          alert(result.message || "❌ Invalid Credentials");
        }
      } catch (error) {
        alert("Connection Error");
      } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
}

// ====================== ADMIN PAGE ======================
if (currentPage === "admin.html") {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    window.location.href = "index.html";
  }

  const addJobForm = document.getElementById("addJobForm");
  const jobsList = document.getElementById("adminJobsList");

  function updateStats() {
    const jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
    document.getElementById("jobsCount").textContent = jobs.length;
    document.getElementById("internshipCount").textContent = jobs.filter(j => j.category === "Internships").length;
    document.getElementById("hackathonCount").textContent = jobs.filter(j => j.category === "Hackathons").length;
    document.getElementById("competitionCount").textContent = jobs.filter(j => j.category === "Competitions").length;
  }

  function loadAdminJobs() {
    const jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
    jobsList.innerHTML = "";
    jobs.forEach(job => {
      jobsList.innerHTML += `
      <div class="job-card">
        <span class="tag">${job.category}</span>
        <h3>${job.title}</h3>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p>${job.description}</p>
        <div class="card-buttons">
          <button onclick="editJob(${job.id})" class="edit-btn">Edit</button>
          <button onclick="deleteJob(${job.id})" class="delete-btn">Delete</button>
        </div>
      </div>`;
    });
    updateStats();
  }

  if (addJobForm) {
    addJobForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
      const newJob = {
        id: Date.now(),
        title: document.getElementById("jobTitle").value,
        company: document.getElementById("companyName").value,
        category: document.getElementById("category").value,
        type: document.getElementById("jobType").value,
        location: document.getElementById("location").value,
        salary: document.getElementById("salary").value,
        description: document.getElementById("description").value,
        applyLink: document.getElementById("applyLink").value,
        date: new Date().toISOString()
      };
      jobs.push(newJob);
      localStorage.setItem("topgrade_jobs", JSON.stringify(jobs));
      alert("Posted Successfully");
      addJobForm.reset();
      loadAdminJobs();
    });
  }

  window.deleteJob = function(id) {
    if(confirm("Delete this opportunity?")) {
      let jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
      jobs = jobs.filter(job => job.id !== id);
      localStorage.setItem("topgrade_jobs", JSON.stringify(jobs));
      loadAdminJobs();
    }
  };

  window.editJob = function(id) {
    const jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    document.getElementById("jobTitle").value = job.title;
    document.getElementById("companyName").value = job.company;
    document.getElementById("category").value = job.category;
    document.getElementById("jobType").value = job.type;
    document.getElementById("location").value = job.location;
    document.getElementById("salary").value = job.salary;
    document.getElementById("description").value = job.description;
    document.getElementById("applyLink").value = job.applyLink;

    deleteJob(id);
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  // Logout Fixed
  document.getElementById("adminLogoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  loadAdminJobs();
}

// ====================== STUDENT PAGE ======================
if (currentPage === "student.html") {
  const role = localStorage.getItem("role");
  if (role !== "student") {
    window.location.href = "index.html";
  }

  // Fixed - Show Student Name (No Emoji)
  const studentName = localStorage.getItem("student_name") || localStorage.getItem("student_id") || "Student";
  document.getElementById("studentWelcome").textContent = `Welcome, ${studentName}`;

  let jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
  let currentCategory = "All Jobs";
  let currentType = "All";
  let currentSort = "new";

  const jobsContainer = document.getElementById("jobsContainer");
  const searchInput = document.getElementById("searchInput");

  function renderJobs(jobList = jobs) {
    jobsContainer.innerHTML = "";
    if (jobList.length === 0) {
      jobsContainer.innerHTML = `<div class="empty-message">No Current Openings Available</div>`;
      return;
    }

    jobList.forEach(job => {
      jobsContainer.innerHTML += `
      <div class="job-card">
        <span class="tag">${job.category}</span>
        <h3>${job.title}</h3>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p>${job.description}</p>
        <div class="card-buttons">
          <button onclick="viewJob(${job.id})" class="view-btn">View Details</button>
          <a href="${job.applyLink}" target="_blank" class="apply-btn">Apply</a>
        </div>
      </div>`;
    });
  }

  function applyFilters() {
    let filteredJobs = [...jobs];

    if (currentCategory !== "All Jobs") {
      filteredJobs = filteredJobs.filter(job => job.category === currentCategory);
    } else if (currentType !== "All") {
      filteredJobs = filteredJobs.filter(job => job.type === currentType);
    }

    const searchValue = searchInput.value.toLowerCase();
    if (searchValue) {
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchValue) ||
        job.company.toLowerCase().includes(searchValue) ||
        job.type.toLowerCase().includes(searchValue)
      );
    }

    if (currentSort === "new") {
      filteredJobs.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      filteredJobs.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    renderJobs(filteredJobs);
  }

  // Tab Listeners
  document.querySelectorAll(".main-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".main-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      applyFilters();
    });
  });

  document.querySelectorAll(".sub-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sub-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentType = btn.dataset.type;
      applyFilters();
    });
  });

  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      applyFilters();
    });
  });

  searchInput.addEventListener("input", applyFilters);

  window.viewJob = function(id) {
    localStorage.setItem("selected_job", id);
    window.location.href = "job-details.html";
  };

  // Logout Fixed
  document.getElementById("studentLogoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  applyFilters();
}

// ====================== JOB DETAILS ======================
if (currentPage === "job-details.html") {
  const jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
  const selectedJob = parseInt(localStorage.getItem("selected_job"));
  const job = jobs.find(j => j.id === selectedJob);
  const container = document.getElementById("jobDetailsContainer");

  if (job && container) {
    container.innerHTML = `
    <div class="job-card">
      <span class="tag">${job.category}</span>
      <h1>${job.title}</h1>
      <h2>${job.company}</h2>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Salary:</strong> ${job.salary}</p>
      <p><strong>Type:</strong> ${job.type}</p>
      <p><strong>Description:</strong></p>
      <p>${job.description}</p>
      <br>
      <a href="${job.applyLink}" target="_blank" class="apply-btn">Apply Now</a>
    </div>`;
  }
}
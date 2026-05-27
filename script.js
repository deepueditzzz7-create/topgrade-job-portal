// =============================================
// TopGrade Portal - UPDATED & FIXED VERSION
// =============================================

const currentPage = window.location.pathname.split("/").pop();

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
      const email = document.getElementById("adminEmail").value.trim();
      const password = document.getElementById("adminPassword").value.trim();
      if (email === "admin@topgrade.com" && password === "admin123") {
        localStorage.setItem("role", "admin");
        alert("✅ Admin Login Successful!");
        window.location.href = "admin.html";
      } else {
        alert("❌ Invalid Admin Credentials");
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
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Verifying...";
      submitBtn.disabled = true;

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbzX8XThJwoEGNuVL-NKN7K41hYv_3QbLNdWyhwosoolLERe6C2EmXuu6yp8L6MJh49kYw/exec", {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "verifyStudent", name: studentName, email: studentEmail, code: studentId })
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
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

// ====================== ADMIN PAGE ======================
if (currentPage === "admin.html") {
  if (localStorage.getItem("role") !== "admin") window.location.href = "index.html";

  const form = document.getElementById("addJobForm");
  const jobsList = document.getElementById("adminJobsList");
  const formTitle = document.getElementById("formTitle");
  const submitBtn = document.getElementById("submitBtn");
  const editingIdInput = document.getElementById("editingJobId");

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

  function updateStats() {
    const jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
    document.getElementById("jobsCount").textContent = jobs.length;
    document.getElementById("internshipCount").textContent = jobs.filter(j => j.category === "Internships").length;
    document.getElementById("hackathonCount").textContent = jobs.filter(j => j.category === "Hackathons").length;
    document.getElementById("competitionCount").textContent = jobs.filter(j => j.category === "Competitions").length;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
    const editingId = parseInt(editingIdInput.value);

    const jobData = {
      id: editingId || Date.now(),
      title: document.getElementById("jobTitle").value.trim(),
      company: document.getElementById("companyName").value.trim(),
      category: document.getElementById("category").value,
      type: document.getElementById("jobType").value,
      location: document.getElementById("location").value.trim(),
      salary: document.getElementById("salary").value.trim(),
      description: document.getElementById("description").value.trim(),
      applyLink: document.getElementById("applyLink").value.trim(),
      date: new Date().toISOString()
    };

    if (editingId) {
      const index = jobs.findIndex(j => j.id === editingId);
      if (index !== -1) jobs[index] = jobData;
      alert("Job Updated Successfully");
    } else {
      jobs.push(jobData);
      alert("Posted Successfully");
    }

    localStorage.setItem("topgrade_jobs", JSON.stringify(jobs));
    form.reset();
    editingIdInput.value = "";
    formTitle.textContent = "Post Opportunity";
    submitBtn.textContent = "Post Opportunity";
    loadAdminJobs();
  });

  window.deleteJob = function(id) {
    if (confirm("Delete this opportunity?")) {
      let jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
      jobs = jobs.filter(j => j.id !== id);
      localStorage.setItem("topgrade_jobs", JSON.stringify(jobs));
      loadAdminJobs();
    }
  };

  window.editJob = function(id) {
    const jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    editingIdInput.value = job.id;
    document.getElementById("jobTitle").value = job.title;
    document.getElementById("companyName").value = job.company;
    document.getElementById("category").value = job.category;
    document.getElementById("jobType").value = job.type;
    document.getElementById("location").value = job.location;
    document.getElementById("salary").value = job.salary;
    document.getElementById("description").value = job.description;
    document.getElementById("applyLink").value = job.applyLink;

    formTitle.textContent = "Edit Opportunity";
    submitBtn.textContent = "Update Opportunity";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  document.getElementById("refreshBtn").addEventListener("click", () => window.location.reload());

  document.getElementById("adminLogoutBtn").addEventListener("click", () => {
    const jobsData = localStorage.getItem("topgrade_jobs");
    localStorage.clear();
    if (jobsData) localStorage.setItem("topgrade_jobs", jobsData);
    window.location.href = "index.html";
  });

  loadAdminJobs();
}

// ====================== STUDENT PAGE - IMPROVED ======================
if (currentPage === "student.html") {
  if (localStorage.getItem("role") !== "student") {
    window.location.href = "index.html";
  }

  const studentName = localStorage.getItem("student_name") || "Student";
  document.getElementById("studentWelcome").textContent = `Welcome, ${studentName}`;

  let currentCategory = "Jobs";
  let currentType = "All";
  let currentSort = "new";

  function getAllJobs() {
    return JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
  }

  function applyFilters() {
    let jobs = getAllJobs();
    let filtered = jobs;

    if (currentCategory !== "All") {
      filtered = filtered.filter(job => job.category === currentCategory);
    }
    if (currentCategory === "Jobs" && currentType !== "All") {
      filtered = filtered.filter(job => job.type === currentType);
    }

    const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
    if (searchValue) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchValue) ||
        job.company.toLowerCase().includes(searchValue)
      );
    }

    filtered.sort((a, b) => currentSort === "new" 
      ? new Date(b.date) - new Date(a.date) 
      : new Date(a.date) - new Date(b.date));

    renderJobs(filtered);
  }

  function renderJobs(jobs) {
    const container = document.getElementById("jobsContainer");
    container.innerHTML = "";

    if (jobs.length === 0) {
      container.innerHTML = `<div class="empty-message">No Opportunities Found</div>`;
      return;
    }

    jobs.forEach(job => {
      container.innerHTML += `
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

  // Event Listeners
  document.querySelectorAll(".main-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".main-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      document.getElementById("subFilters").style.display = (currentCategory === "Jobs") ? "flex" : "none";
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

  document.getElementById("searchInput").addEventListener("input", applyFilters);

  window.viewJob = function(id) {
    localStorage.setItem("selected_job", id);
    window.location.href = "job-details.html";
  };

  document.getElementById("refreshBtn").addEventListener("click", () => {
    window.location.reload(true); // Force reload from server
  });

  document.getElementById("studentLogoutBtn").addEventListener("click", () => {
    const jobsData = localStorage.getItem("topgrade_jobs");
    localStorage.clear();
    if (jobsData) localStorage.setItem("topgrade_jobs", jobsData);
    window.location.href = "index.html";
  });

  // Initial Load
  document.getElementById("subFilters").style.display = "flex";
  applyFilters();
}

// ====================== JOB DETAILS ======================
if (currentPage === "job-details.html") {
  const jobs = JSON.parse(localStorage.getItem("topgrade_jobs")) || [];
  const selectedId = parseInt(localStorage.getItem("selected_job"));
  const job = jobs.find(j => j.id === selectedId);
  const container = document.getElementById("jobDetailsContainer");
  const errorDiv = document.getElementById("detailsError");

  if (job && container) {
    errorDiv.classList.add("hidden");
    container.innerHTML = `
      <div class="job-card">
        <span class="tag">${job.category}</span>
        <h1>${job.title}</h1>
        <h2>${job.company}</h2>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Salary / Stipend:</strong> ${job.salary}</p>
        <p><strong>Type:</strong> ${job.type}</p>
        <p><strong>Description:</strong></p>
        <p style="line-height:1.8;">${job.description}</p>
        <br><br>
        <a href="${job.applyLink}" target="_blank" class="apply-btn">Apply Now</a>
      </div>`;
  } else {
    container.classList.add("hidden");
    errorDiv.classList.remove("hidden");
  }
}
// ============================================
// TOPGRADE PORTAL - FINAL UPDATED SCRIPT
// ============================================

const currentPage =
window.location.pathname.split("/").pop();



// ============================================
// DEFAULT JOBS
// ============================================

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
            applyLink: "hr@microsoft.com",
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

    localStorage.setItem(
        "topgrade_jobs",
        JSON.stringify(sampleJobs)
    );

}



// ============================================
// LOGIN PAGE
// ============================================

if (
    currentPage === "index.html" ||
    currentPage === ""
) {

    const adminTab =
    document.getElementById("adminTab");

    const studentTab =
    document.getElementById("studentTab");

    const adminForm =
    document.getElementById("adminLoginForm");

    const studentForm =
    document.getElementById("studentLoginForm");



    // TAB SWITCH

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



    // ADMIN LOGIN

    adminForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const email =
        document.getElementById("adminEmail").value;

        const password =
        document.getElementById("adminPassword").value;


        if (
            email === "admin@topgrade.com" &&
            password === "admin123"
        ) {

            localStorage.setItem("role", "admin");

            window.location.href = "admin.html";

        }

        else {

            alert("Invalid Admin Credentials");

        }

    });




    // STUDENT LOGIN

    studentForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const studentId =
        document.getElementById("studentId")
        .value
        .trim()
        .toUpperCase();



        const pattern1 =
        /^TG-OP-\d{5}$/;

        const pattern2 =
        /^TG-2026-\d{5}$/;



        if (
            pattern1.test(studentId) ||
            pattern2.test(studentId)
        ) {

            localStorage.setItem(
                "role",
                "student"
            );

            localStorage.setItem(
                "student_id",
                studentId
            );

            window.location.href =
            "student.html";

        }

        else {

            alert(
                "Invalid Certificate ID"
            );

        }

    });

}



// ============================================
// ADMIN PAGE
// ============================================

if (currentPage === "admin.html") {

    const role =
    localStorage.getItem("role");

    if (role !== "admin") {

        window.location.href =
        "index.html";

    }


    const addJobForm =
    document.getElementById("addJobForm");

    const jobsList =
    document.getElementById("adminJobsList");



    // LOAD ADMIN JOBS

    function loadAdminJobs() {

        const jobs =
        JSON.parse(
            localStorage.getItem("topgrade_jobs")
        ) || [];


        jobsList.innerHTML = "";



        // COUNTS

        document.getElementById("jobsCount").innerText =
        jobs.filter(j => j.category === "Jobs").length;

        document.getElementById("internshipCount").innerText =
        jobs.filter(j => j.category === "Internships").length;

        document.getElementById("hackathonCount").innerText =
        jobs.filter(j => j.category === "Hackathons").length;



        jobs.forEach(job => {

            jobsList.innerHTML += `

            <div class="job-card">

                <span class="tag">${job.category}</span>

                <h3>${job.title}</h3>

                <p><strong>Company:</strong> ${job.company}</p>

                <p><strong>Location:</strong> ${job.location}</p>

                <p>${job.description}</p>

                <div class="card-buttons">

                    <button
                        onclick="editJob(${job.id})"
                        class="edit-btn"
                    >
                        Edit
                    </button>

                    <button
                        onclick="deleteJob(${job.id})"
                        class="delete-btn"
                    >
                        Delete
                    </button>

                </div>

            </div>

            `;

        });

    }



    // ADD JOB

    addJobForm.addEventListener("submit", (e) => {

        e.preventDefault();


        const jobs =
        JSON.parse(
            localStorage.getItem("topgrade_jobs")
        ) || [];


        const newJob = {

            id: Date.now(),

            title:
            document.getElementById("jobTitle").value,

            company:
            document.getElementById("companyName").value,

            category:
            document.getElementById("category").value,

            type:
            document.getElementById("jobType").value,

            location:
            document.getElementById("location").value,

            salary:
            document.getElementById("salary").value,

            description:
            document.getElementById("description").value,

            applyLink:
            document.getElementById("applyLink").value,

            date:
            new Date().toISOString()

        };


        jobs.push(newJob);


        localStorage.setItem(
            "topgrade_jobs",
            JSON.stringify(jobs)
        );


        alert("Posted Successfully");

        addJobForm.reset();

        loadAdminJobs();

    });




    // DELETE JOB

    window.deleteJob = function(id) {

        let jobs =
        JSON.parse(
            localStorage.getItem("topgrade_jobs")
        ) || [];


        jobs = jobs.filter(
            job => job.id !== id
        );


        localStorage.setItem(
            "topgrade_jobs",
            JSON.stringify(jobs)
        );


        loadAdminJobs();

    };




    // EDIT JOB

    window.editJob = function(id) {

        const jobs =
        JSON.parse(
            localStorage.getItem("topgrade_jobs")
        ) || [];


        const job =
        jobs.find(j => j.id === id);


        if (!job) return;



        document.getElementById("jobTitle").value =
        job.title;

        document.getElementById("companyName").value =
        job.company;

        document.getElementById("category").value =
        job.category;

        document.getElementById("jobType").value =
        job.type;

        document.getElementById("location").value =
        job.location;

        document.getElementById("salary").value =
        job.salary;

        document.getElementById("description").value =
        job.description;

        document.getElementById("applyLink").value =
        job.applyLink;



        deleteJob(id);


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };




    // LOGOUT

    document.getElementById(
        "adminLogoutBtn"
    ).onclick = () => {

        localStorage.removeItem("role");

        window.location.href =
        "index.html";

    };



    loadAdminJobs();

}




// ============================================
// STUDENT PAGE
// ============================================

if (currentPage === "student.html") {

    const role =
    localStorage.getItem("role");

    if (role !== "student") {

        window.location.href =
        "index.html";

    }


    let jobs =
    JSON.parse(
        localStorage.getItem("topgrade_jobs")
    ) || [];


    const jobsContainer =
    document.getElementById(
        "jobsContainer"
    );



    // RENDER JOBS

    function renderJobs(jobList = jobs) {

        jobsContainer.innerHTML = "";


        if (jobList.length === 0) {

            jobsContainer.innerHTML = `

            <div class="empty-message">
                No Current Openings Available
            </div>

            `;

            return;

        }



        jobList.forEach(job => {

            jobsContainer.innerHTML += `

            <div class="job-card">

                <span class="tag">
                    ${job.category}
                </span>

                <h3>${job.title}</h3>

                <p><strong>Company:</strong>
                ${job.company}</p>

                <p><strong>Location:</strong>
                ${job.location}</p>

                <p>${job.description}</p>

                <div class="card-buttons">

                    <button
                        onclick="viewJob(${job.id})"
                        class="view-btn"
                    >
                        View Details
                    </button>

                    <a
                        href="${job.applyLink}"
                        target="_blank"
                        class="apply-btn"
                    >
                        Apply
                    </a>

                </div>

            </div>

            `;

        });

    }



    // FILTER JOBS

   // ============================================
// FILTER BUTTONS WORKING
// ============================================

let currentCategory = "Jobs";
let currentType = "All Jobs";
let currentSort = "new";

const mainTabs =
document.querySelectorAll(".main-tab");

const subTabs =
document.querySelectorAll(".sub-tab");

const sortBtns =
document.querySelectorAll(".sort-btn");

const searchInput =
document.getElementById("searchInput");



// MAIN CATEGORY FILTER

mainTabs.forEach(btn => {

    btn.addEventListener("click", () => {

        mainTabs.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        currentCategory =
        btn.dataset.category;

        applyFilters();

    });

});




// SUB FILTER

subTabs.forEach(btn => {

    btn.addEventListener("click", () => {

        subTabs.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        currentType =
        btn.dataset.type;

        applyFilters();

    });

});




// SORT FILTER

sortBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        sortBtns.forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        currentSort =
        btn.dataset.sort;

        applyFilters();

    });

});




// SEARCH

searchInput.addEventListener("input", () => {

    applyFilters();

});




// MAIN FILTER FUNCTION

function applyFilters() {

    let filteredJobs = [...jobs];



    // CATEGORY

    filteredJobs = filteredJobs.filter(job =>
        job.category === currentCategory
    );



    // TYPE

    if (currentType !== "All Jobs") {

        filteredJobs = filteredJobs.filter(job =>
            job.type === currentType
        );

    }



    // SEARCH

    const searchValue =
    searchInput.value.toLowerCase();

    filteredJobs = filteredJobs.filter(job =>

        job.title.toLowerCase().includes(searchValue) ||

        job.company.toLowerCase().includes(searchValue) ||

        job.type.toLowerCase().includes(searchValue)

    );



    // SORT

    if (currentSort === "new") {

        filteredJobs.sort((a,b) =>
            new Date(b.date) -
            new Date(a.date)
        );

    }

    else {

        filteredJobs.sort((a,b) =>
            new Date(a.date) -
            new Date(b.date)
        );

    }



    renderJobs(filteredJobs);

}



// INITIAL FILTER

applyFilters();




    // VIEW JOB

    window.viewJob = function(id) {

        localStorage.setItem(
            "selected_job",
            id
        );

        window.location.href =
        "job-details.html";

    };




    // LOGOUT

    document.getElementById(
        "studentLogoutBtn"
    ).onclick = () => {

        localStorage.removeItem("role");

        window.location.href =
        "index.html";

    };



    renderJobs();

}




// ============================================
// JOB DETAILS PAGE
// ============================================

if (currentPage === "job-details.html") {

    const jobs =
    JSON.parse(
        localStorage.getItem("topgrade_jobs")
    ) || [];


    const selectedJob =
    parseInt(
        localStorage.getItem("selected_job")
    );


    const job =
    jobs.find(
        j => j.id === selectedJob
    );


    const container =
    document.getElementById(
        "jobDetailsContainer"
    );



    if (job) {

        container.innerHTML = `

        <div class="job-card">

            <span class="tag">
                ${job.category}
            </span>

            <h1>${job.title}</h1>

            <h2>${job.company}</h2>

            <p>
                <strong>Location:</strong>
                ${job.location}
            </p>

            <p>
                <strong>Salary:</strong>
                ${job.salary}
            </p>

            <p>
                <strong>Type:</strong>
                ${job.type}
            </p>

            <p>
                <strong>Description:</strong>
            </p>

            <p>${job.description}</p>

            <br>

            <a
                href="${job.applyLink}"
                target="_blank"
                class="apply-btn"
            >
                Apply Now
            </a>

        </div>

        `;

    }

}
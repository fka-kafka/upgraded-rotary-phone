// import "./src/assets/styles/style.css";

//TODO:
// Implement JSON in-app database => still on it
// Add Project Lead and Date Added to project tile, Done, Styling Remains
//There might be a bug with the complete button, it might not be working as intended[FIXED] => convoluted event listener logic.

function checkStorageSpace() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length;
    }
  }
  return (total / 1024 / 1024).toFixed(2);
}

async function saveToLocalStorage(projectData) {
  try {
    const usedSpace = checkStorageSpace();
    if (usedSpace > 4.5) {
      console.warn(`Storage space running low: ${usedSpace}MB used`);
      await cleanupOldProjects();
    }

    const allProjects =
      localStorage.getItem("projects") !== null
        ? await JSON.parse(localStorage.getItem("projects"))
        : [];

    // Optimize image data if needed
    if (projectData.projectImage && projectData.projectImage.length > 50000) {
      projectData.projectImage = await compressImage(projectData.projectImage);
    }

    let newProject = { dateAdded: Date.now(), data: projectData };
    allProjects.push(newProject);

    try {
      await localStorage.setItem("projects", JSON.stringify(allProjects));
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        await cleanupOldProjects(); //add individual 'delete project' button
        // Try one more time after cleanup
        await localStorage.setItem("projects", JSON.stringify(allProjects));
      } else {
        throw e;
      }
    }
  } catch (error) {
    console.error("Storage error:", error);
    alert(
      "Unable to save project due to storage limitations. Please delete some old projects."
    );
  }
}

async function cleanupOldProjects() {
  const allProjects = JSON.parse(localStorage.getItem("projects")) || [];

  // Keep only last 20 projects or remove completed projects
  const sortedProjects = allProjects.sort((a, b) => b.dateAdded - a.dateAdded);
  const reducedProjects = sortedProjects.slice(0, 20);

  await localStorage.setItem("projects", JSON.stringify(reducedProjects));
}

async function compressImage(base64String) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set target dimensions (e.g., max 800px width)
      const maxWidth = 800;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress to JPEG with 0.7 quality
    };
  });
}

// error handling
function retrieveSavedProjects() {
  const savedProjects = localStorage.getItem("projects");
  return savedProjects === null ? savedProjects : JSON.parse(savedProjects);
}

async function displaySavedProjects() {
  console.log("displaying");
  const allProjects = await retrieveSavedProjects();
  if (allProjects === null) return;

  const completedProjects = document.getElementById("completedProjects");
  const newProjects = document.getElementById("newProjects");

  completedProjects.innerHTML = ''
  newProjects.innerHTML = ''

  allProjects.forEach((project) => {
    const projectContainer = document.createElement("div");
    projectContainer.id = project.dateAdded;
    projectContainer.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-lg"
    );

    let completionInfo = "";
    if (project?.data?.completed) {
      const completedDate = new Date(
        project.data.completedDate
      ).toLocaleDateString();
      const duration = project.data.duration || { hours: 0, minutes: 0 };
      completionInfo = `
        <p class="text-gray-700 mb-2">Completed on: ${completedDate}</p>
        <p class="text-gray-700 mb-2">Duration: ${duration.hours}h ${duration.minutes}m</p>
      `;
    }

    console.log("building");
    projectContainer.innerHTML = `
    <div class="flex justify-end mb-2">
      <button class="delete-btn text-red-600 hover:text-red-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
     <img src=${
       project?.data?.projectImage
     } alt="Project Image" class="w-full h-48 object-cover rounded-md mb-4">
      <h2 class="text-2xl font-bold mb-2">${project?.data?.projectName}</h2>
      <p class="text-gray-700">${project?.data?.projectDescription}</p>
      <p class="text-gray-700 mb-2">Project Lead: ${
        project?.data?.projectLead
      }</p>
      <p class="text-gray-700 mb-2">Date Added: ${new Date(
        project.dateAdded
      ).toLocaleDateString()}</p>
      ${completionInfo}
      ${
        !project?.data?.completed
          ? '<div class="flex justify-center w-full" id="buttonDiv"><button role="checkbox" id="toggleButton" class="bg-black text-white w-1/6 p-2 rounded-md">Complete</button></div>'
          : ""
      }
    `;

    if (!project?.data?.completed) {
      setTimeout(() => {
        const button = projectContainer.querySelector("#toggleButton");
        if (button) {
          button.addEventListener("click", async (e) => {
            e.preventDefault();
            console.log("Complete button clicked");

            try {
              await changeProjectStatus(project.dateAdded);
              const parentColumn = projectContainer.parentElement;
              projectContainer.remove();

              const completedProjects =
                document.getElementById("completedProjects");
              if (parentColumn === completedProjects) {
                document
                  .getElementById("newProjects")
                  .appendChild(projectContainer);
              } else {
                completedProjects.appendChild(projectContainer);
              }

              await displaySavedProjects();
            } catch (error) {
              console.error("Error updating project status:", error);
            }
          });
        }
      }, 0);
      setTimeout(() => {
        const deleteBtn = projectContainer.querySelector(".delete-btn");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", async () => {
            if (confirm("Are you sure you want to delete this project?")) {
              await deleteProject(project.dateAdded);
              projectContainer.remove();
            }
          });
        }
      }, 0);
    }

    project?.data?.completed === true
      ? completedProjects.appendChild(projectContainer)
      : newProjects.appendChild(projectContainer);
  });
}

async function changeProjectStatus(id) {
  console.log("Changing status for project:", id);

  const allProjects = JSON.parse(localStorage.getItem("projects"));
  console.log("All projects before:", allProjects);

  allProjects.forEach((project) => {
    if (project.dateAdded == id) {
      project.data.completed = !project.data.completed;
      project.data.completedDate = project.data.completed ? Date.now() : null;
      project.data.duration = project.data.completed
        ? calculateDuration(project.dateAdded, project.data.completedDate)
        : { hours: 0, minutes: 0 };
      console.log("Updated project:", project);
    }
  });

  await localStorage.setItem("projects", JSON.stringify(allProjects));
  console.log("Storage updated");
  return true;
}

async function deleteProject(id) {
  const allProjects = JSON.parse(localStorage.getItem("projects"));
  const updatedProjects = allProjects.filter(
    (project) => project.dateAdded != id
  );
  await localStorage.setItem("projects", JSON.stringify(updatedProjects));
}

function calculateDuration(startTime, endTime) {
  const durationMs = endTime - startTime;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const project = document.getElementById(data);
  event.target.appendChild(project);
}

async function clearCompletedProjects() {
  const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
  const activeProjects = allProjects.filter(
    (project) => !project.data.completed
  );
  await localStorage.setItem("projects", JSON.stringify(activeProjects));

  const completedProjectsContainer =
    document.getElementById("completedProjects");
  const heading = completedProjectsContainer.querySelector("h2"); // Save heading

  while (completedProjectsContainer.lastChild) {
    if (completedProjectsContainer.lastChild !== heading) {
      completedProjectsContainer.removeChild(
        completedProjectsContainer.lastChild
      );
    } else {
      break;
    }
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  console.log("loaded");
  await displaySavedProjects();
  console.log("fired");
  document.getElementById("projectButton").onclick = function () {
    console.log("clicked");
    document.getElementById("myModal").classList.remove("invisible");
  };

  document.getElementsByClassName("close")[0].onclick = function () {
    document.getElementById("myModal").classList.add("invisible");
  };

  window.onclick = function (event) {
    if (event.target == document.getElementById("myModal")) {
      document.getElementById("myModal").classList.add("invisible");
    }
  };

  document.getElementById("projectImage").onchange = function (event) {
    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById("imagePreview").src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  /* const checkbox = document.getElementById("checkbox");
  if (checkbox) {
    checkbox.onchange = function () {
      if (checkbox.checked) {
        document
          .getElementById("completedProjects")
          .appendChild(checkbox.parentElement);
        changeProjectStatus(checkbox.parentElement.id);
      } else {
        document
          .getElementById("newProjects")
          .appendChild(checkbox.parentElement);
        changeProjectStatus(checkbox.parentElement.id);
      }
    };
  } */
  // console.log("listener");
  // ################## wouldve worked but doesnt cover new projects immediately
  // const button = document.querySelector("#toggleButton");
  // const buttonDiv = document.querySelector("#buttonDiv");
  // if (button && buttonDiv) {
  //   document.querySelector("#toggleButton").onclick = function () {
  //     console.log("clicked completed");
  //     changeProjectStatus(buttonDiv.parentElement.id);
  //     document
  //     .getElementById("completedProjects")
  //     .appendChild(buttonDiv.parentElement);
  //     buttonDiv.parentElement.removeChild(buttonDiv);
  //   };
  // }

  document.getElementById("addProjectButton").onclick = async function () {
    const projectName = document.getElementById("projectName").value;
    const projectDescription =
      document.getElementById("projectDescription").value;
    const projectImage = document.getElementById("imagePreview").src;
    const projectLead = document.getElementById("projectLead").value;
    const dateAdded = new Date().toLocaleDateString();

    const projectContainer = document.createElement("div");
    projectContainer.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-lg"
    );
    projectContainer.setAttribute("draggable", "true");
    projectContainer.ondragstart = drag;

    const projectImageElement = document.createElement("img");
    projectImageElement.src = projectImage;
    projectImageElement.classList.add(
      "w-full",
      "h-48",
      "object-cover",
      "rounded-md",
      "mb-4"
    );

    const projectNameElement = document.createElement("h2");
    projectNameElement.textContent = projectName;
    projectNameElement.classList.add("text-2xl", "font-bold", "mb-2");

    const projectDescriptionElement = document.createElement("p");
    projectDescriptionElement.textContent = projectDescription;
    projectDescriptionElement.classList.add("text-gray-700");

    const projectLeadElement = document.createElement("p");
    projectLeadElement.textContent = `Project Lead: ${projectLead}`;
    projectLeadElement.classList.add("text-gray-700", "mb-2");

    const dateAddedElement = document.createElement("p");
    dateAddedElement.textContent = `Date Added: ${dateAdded}`;
    dateAddedElement.classList.add("text-gray-700", "mb-2");

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("flex", "justify-center", "w-full");

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.classList.add(
      "bg-black",
      "text-white",
      "w-1/6",
      "p-2",
      "rounded-md"
    );

    // event listener doesnt work on refresh
    // const projectId = Date.now();
    // projectContainer.id = projectId;

    // completeButton.addEventListener(
    //   "click",
    //   async function (e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     console.log('clicked complete')

    //     try {
    //       document.getElementById("completedProjects").appendChild(projectContainer)
    //       await changeProjectStatus(projectId);
    //       projectContainer.remove();
    //       // completeButton.parentElement.removeChild()
    //     } catch (error) {
    //       console.error("Error completing project:", error);
    //     }
    //   }, {
    //     once: true
    //   }
    // );

    buttonDiv.appendChild(completeButton);
    projectContainer.appendChild(buttonDiv);

    const projectData = {
      projectName,
      projectImage,
      projectDescription,
      projectLead,
      dateAdded: Date.now(),
      completedDate: null,
      completed: false,
    };

    await saveToLocalStorage(projectData);

    projectContainer.appendChild(projectImageElement);
    projectContainer.appendChild(projectNameElement);
    projectContainer.appendChild(projectDescriptionElement);
    projectContainer.appendChild(projectLeadElement);
    projectContainer.appendChild(dateAddedElement);
    projectContainer.appendChild(buttonDiv);

    document.getElementById("newProjects").appendChild(projectContainer);

    await displaySavedProjects();
    
    document.getElementById("projectName").value = "";
    document.getElementById("projectDescription").value = "";
    document.getElementById("imagePreview").src = "path/to/image.jpg";
    document.getElementById("projectImage").value = "";

    document.getElementById("myModal").classList.add("invisible");
  };

  const footer = document.getElementById("footer");
  const currentYear = new Date().getFullYear();
  footer.innerHTML = `&copy; ${currentYear} Tev and Brandon`;

  const projectsSection =
    document.querySelector("#completedProjects").parentElement;

  //   const clearButton = document.createElement("button");
  //   clearButton.textContent = "Clear Completed Projects";
  //   clearButton.classList.add(
  //     "mt-4",
  //     "bg-red-600",
  //     "text-white",
  //     "px-4",
  //     "py-2",
  //     "rounded-md",
  //     "hover:bg-red-700",
  //     "transition-colors",
  //     "mx-auto",
  //     "block"
  //   );

  //   clearButton.addEventListener("click", async () => {
  //     if (confirm("Are you sure you want to delete all completed projects? This cannot be undone.")) {
  //       await clearCompletedProjects();
  //       console.log("Completed projects cleared");
  //     }
  //   });
  //   if (projectsSection) {
  //       projectsSection.appendChild(clearButton);
  //   } else {
  //       console.error("Projects section not found");
  //   }
  const clearButton = document.getElementById("clearCompletedButton");
  if (clearButton) {
    clearButton.addEventListener("click", async () => {
      if (
        confirm(
          "Are you sure you want to delete all completed projects? This cannot be undone."
        )
      ) {
        await clearCompletedProjects();
        await displaySavedProjects();
        console.log("Completed projects cleared");
      }
    });
  }
});

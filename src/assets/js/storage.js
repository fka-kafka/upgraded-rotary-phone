export function checkStorageSpace() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
    }
  }
  return (total / 1024 / 1024).toFixed(2);
}

export async function saveToLocalStorage(projectData) {
  console.log("adding to local storage");
  try {
    const usedSpace = checkStorageSpace();
    if (usedSpace > 4.5) {
      condaseqrsole.warn(`Storage space running low: ${usedSpace}MB used`);
      await cleanupOldProjects();
    }

    const allProjects =
      localStorage.getItem("projects") !== null
        ? await JSON.parse(localStorage.getItem("projects"))
        : [];

    // Optimize image data if needed
    // if (projectData.projectImage && projectData.projectImage.length > 50000) {
    //   projectData.projectImage = await compressImage(projectData.projectImage);
    // }

    let newProject = { ...projectData, completedDate: null, completed: false };
    console.dir(newProject);
    allProjects.push(newProject);

    try {
      localStorage.setItem("projects", JSON.stringify(allProjects));
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        await cleanupOldProjects(); //add individual 'delete project' button
        // Try one more time after cleanup
        localStorage.setItem("projects", JSON.stringify(allProjects));
      } else {
        throw e;
      }
    }
  } catch (error) {
    console.error("Storage error:", error);
    alert(
      "Unable to save project due to storage limitations. Please delete some old projects.",
    );
  }
}

export async function cleanupOldProjects() {
  const allProjects = JSON.parse(localStorage.getItem("projects")) || [];

  // Keep only last 20 projects or remove completed projects
  const sortedProjects = allProjects.sort(
    (a, b) => b.dateCreated - a.dateCreated,
  );
  const reducedProjects = sortedProjects.slice(0, 20);

  localStorage.setItem("projects", JSON.stringify(reducedProjects));
}

// error handling
export function retrieveSavedProjects() {
  const savedProjects = localStorage.getItem("projects");
  return savedProjects === null ? savedProjects : JSON.parse(savedProjects);
}

export async function changeProjectStatus(id) {
  console.log("Changing status for project:", id);

  const allProjects = JSON.parse(localStorage.getItem("projects"));
  console.log("All projects before:", allProjects);

  allProjects.forEach((project) => {
    if (project.dateCreated == id) {
      project.completed = !project.completed;
      project.completedDate = project.completed ? Date.now() : null;
      project.duration = project.completed
        ? calculateDuration(project.dateCreated, project.completedDate)
        : { hours: 0, minutes: 0 };
      console.log("Updated project:", project);
    }
  });

  localStorage.setItem("projects", JSON.stringify(allProjects));
  console.log("Storage updated");
  return true;
}

export async function deleteProject(id) {
  const allProjects = JSON.parse(localStorage.getItem("projects"));
  const updatedProjects = allProjects.filter(
    (project) => project.dateCreated != id,
  );
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
}

export function calculateDuration(startTime, endTime) {
  const durationMs = endTime - startTime;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
}

export async function clearCompletedProjects() {
  const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
  const activeProjects = allProjects.filter((project) => !project.completed);
  localStorage.setItem("projects", JSON.stringify(activeProjects));

  const completedProjectsContainer =
    document.getElementById("completedProjects");
  const heading = completedProjectsContainer.querySelector("h2"); // Save heading

  while (completedProjectsContainer.lastChild) {
    if (completedProjectsContainer.lastChild !== heading) {
      completedProjectsContainer.removeChild(
        completedProjectsContainer.lastChild,
      );
    } else {
      break;
    }
  }
}

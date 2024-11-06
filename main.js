// import "./src/assets/styles/style.css";

//TODO:
// Implement JSON in-app database
// Add Project Lead and Date Added to project tile

async function saveToLocalStorage(projectData) {
  const allProjects =
    localStorage.getItem("projects") !== null
      ? await JSON.parse(localStorage.getItem("projects"))
      : [];

  let newProject = { dateAdded: 0, data: {} };

  try {
    const dateAdded = Date.now();
    newProject.dateAdded = dateAdded;
    newProject.data = projectData;
    allProjects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(allProjects));
    return;
  } catch (error) {
    console.error(error);
  }
}

function retrieveSavedProjects() {
  const savedProjects = localStorage.getItem("projects");
  return savedProjects === null ? savedProjects : JSON.parse(savedProjects);
}

async function displaySavedProjects() {
  const allProjects = await retrieveSavedProjects();
  if (allProjects === null) {
    return;
  }

  const completedProjects = document.getElementById("completedProjects");
  const newProjects = document.getElementById("newProjects");

  allProjects.forEach((project) => {
    const projectContainer = document.createElement("div");
    projectContainer.id = project.dateAdded;
    projectContainer.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-lg"
    );
    projectContainer.innerHTML = `
				<img src=${
          project?.data?.projectImage
        } alt="Project Image" class="w-full h-48 object-cover rounded-md mb-4">
				<h2 class="text-2xl font-bold mb-2" >${project?.data?.projectName}
				</h2>
				<p class="text-gray-700">
				${project?.data?.projectDescription}
				</p>
				${
          !project?.data?.completed
            ? '<div class=" flex justify-center w-full" id="buttonDiv"><button role="checkbox" id="toggleButton" class=" bg-black text-white w-1/6 p-2 rounded-md">Complete</button></div>'
            : ""
        }
			`; /* <input type="checkbox" id="checkbox"  class="mt-4"> */

    project?.data?.completed === true
      ? completedProjects.appendChild(projectContainer)
      : newProjects.appendChild(projectContainer);
    return;
  });
}

function changeProjectStatus(id) {
  const allProjects = JSON.parse(localStorage.getItem("projects"));
  allProjects.forEach((project) => {
    if (project.dateAdded == id) {
      project.data.completed = !project.data.completed;
      console.log("changed");
    }
  });

  localStorage.setItem("projects", JSON.stringify(allProjects));
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

document.addEventListener("DOMContentLoaded", async function () {
  await displaySavedProjects();
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

  const button = document.querySelector("#toggleButton");
  const buttonDiv = document.querySelector("#buttonDiv");
  if (button && buttonDiv) {
    document.querySelector("#toggleButton").onclick = function () {
      document
        .getElementById("completedProjects")
        .appendChild(buttonDiv.parentElement);
      changeProjectStatus(buttonDiv.parentElement.id);
      button.parentElement.removeChild(button);
    };
  }

  document.getElementById("addProjectButton").onclick = async function () {
    const projectName = document.getElementById("projectName").value;
    const projectDescription =
      document.getElementById("projectDescription").value;
    const projectImage = document.getElementById("imagePreview").src;

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

    const buttonDiv = document.createElement("div");
    buttonDiv.id = "buttonDiv";
    buttonDiv.classList.add("flex", "justify-center", "w-full");

    const button = document.createElement("button");
    button.role = "checkbox";
    button.id = "toggleButton";
		button.textContent = 'Complete'
    button.classList.add(
      "bg-black",
      "text-white",
      "w-1/6",
      "p-2",
      "rounded-md"
    );
		buttonDiv.appendChild(button)
    const projectData = {
      projectName: projectName,
      projectImage: projectImage,
      projectDescription: projectDescription,
      completed: false,
    };

    await saveToLocalStorage(projectData);

    projectContainer.appendChild(projectImageElement);
    projectContainer.appendChild(projectNameElement);
    projectContainer.appendChild(projectDescriptionElement);
    projectContainer.appendChild(buttonDiv);

    document.getElementById("newProjects").appendChild(projectContainer);

    document.getElementById("projectName").value = "";
    document.getElementById("projectDescription").value = "";
    document.getElementById("imagePreview").src = "path/to/image.jpg";
    document.getElementById("projectImage").value = "";

    document.getElementById("myModal").classList.add("invisible");
  };

  const footer = document.getElementById("footer");
  const currentYear = new Date().getFullYear();
  footer.innerHTML = `&copy; ${currentYear} Tev and Brandon`;
});

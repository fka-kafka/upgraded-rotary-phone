// import "./src/assets/styles/style.css";
import { sendProjectEmail } from "./src/assets/js/emailer";
import { createRepo } from "./src/assets/js/apis";
import { saveToLocalStorage, clearCompletedProjects } from "./src/assets/js/storage"
import {displaySavedProjects} from "./src/assets/js/display"
import { handleLogin, handleLoginRedirect, handleLogout, checkAuthentication, getUser } from "./src/assets/js/auth";

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
  const loginButton = document.getElementById("login");
  const logoutButton = document.getElementById("logout");
  const profile = document.getElementById('profile')
  console.log(profile.classList)
  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    await handleLogin()
  });

  await handleLoginRedirect()

  logoutButton.addEventListener("click", async (e) => {
    e.preventDefault();
    await handleLogout()
  });

  const isAuthenticated = await checkAuthentication()
  if (isAuthenticated) {
    const userProfile = await getUser();
    loginButton.classList.toggle("hidden");
    profile.classList.toggle('hidden')
    console.log(userProfile);
    const src = userProfile.picture
    document.getElementById('pfp').src = src
    document.getElementById('currentUser').innerText = userProfile.name
  }

  if (globalThis.location.search.includes("projectName")) {
    const newProjectData = new URLSearchParams(globalThis.location.search);
    let newProject = Object.fromEntries(newProjectData);
    console.dir(newProject);
    await saveToLocalStorage(newProject);
    document.getElementById("projectButton").click();
  }

  console.log("DOMContentLoaded");
  await displaySavedProjects();
  // const repoResponse = await getRepository(
  //   "upgraded-rotary-phone",
  //   "fka-kafka",
  // );
  // console.dir(repoResponse);
  // const colorsResponse = await getRepoColors()
  // console.dir(colorsResponse)
  // const languageColors = await getLanguageColors(repoResponse.languages.data);
  // console.dir(languageColors);

  // const resp = await fetch('https://api.github.com/repos/fka-kafka/wolt-django')
  // const data = await resp.json()
  // console.dir(data)

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

  const leadPicker = document.getElementById("projectLead");

  leadPicker.onchange = function (e) {
    document.getElementById("selectedLead").innerHTML = e.target.value;
    console.log(e.target.value, e.target.value.length);
    if (
      (e.target.value === "Tevstark" || e.target.value === "fka-kafka") &&
      e.target.value.length !== 0
    ) {
      const repoInput = document.getElementById("repositoryName");
      repoInput.removeAttribute("disabled");
    } else {
      const repoInput = document.getElementById("repositoryName");
      repoInput.setAttribute("disabled", true);
    }
  };

  document.getElementById("newProjectForm").onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const projectName = formData.get("projectName");
    const projectDescription = formData.get("projectDescription");
    const repositoryName = formData.get("repositoryName");
    const projectLead = formData.get("projectLead");
    const dateCreated = new Date().toLocaleDateString("en-GB");

    const projectContainer = document.createElement("div");
    projectContainer.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-lg",
    );
    projectContainer.setAttribute("draggable", "true");
    projectContainer.ondragstart = drag;

    const projectNameElement = document.createElement("h2");
    projectNameElement.textContent = projectName;
    projectNameElement.classList.add("text-2xl", "font-bold", "mb-2");

    const projectDescriptionElement = document.createElement("p");
    projectDescriptionElement.textContent = projectDescription;
    projectDescriptionElement.classList.add("text-gray-700");

    const projectLeadElement = document.createElement("p");
    projectLeadElement.textContent = `Project Lead: ${projectLead}`;
    projectLeadElement.classList.add("text-gray-700", "mb-2");

    const repositoryElement = document.createElement("a");
    repositoryElement.textContent = `https://github.com/${projectLead}/${repositoryName}`;
    repositoryElement.classList.add(
      "text-gray-700",
      "mb-2",
      "hover:no-underline",
    );

    const dateCreatedElement = document.createElement("p");
    dateCreatedElement.textContent = `Date Added: ${dateCreated}`;
    dateCreatedElement.classList.add("text-gray-700", "mb-2");

    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("flex", "justify-center", "w-full");

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.classList.add(
      "bg-black",
      "text-white",
      "w-1/6",
      "p-2",
      "rounded-md",
    );

    buttonDiv.appendChild(completeButton);
    projectContainer.appendChild(buttonDiv);

    const projectData = {
      projectName,
      projectDescription,
      projectLead,
      repositoryName,
      dateCreated: Date.now(),
    };

    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");

    const repoResponse = await createRepo(repositoryName);
    if (repoResponse?.status === 201) {
      await saveToLocalStorage(projectData);
      const emailResponse = await sendProjectEmail(projectData);
      if (emailResponse?.status) {
        loader.classList.add("hidden");
      }
    }

    projectContainer.appendChild(projectNameElement);
    projectContainer.appendChild(projectDescriptionElement);
    projectContainer.appendChild(projectLeadElement);
    projectContainer.appendChild(repositoryElement);
    projectContainer.appendChild(dateCreatedElement);
    projectContainer.appendChild(buttonDiv);

    document.getElementById("newProjects").appendChild(projectContainer);

    await displaySavedProjects();

    document.getElementById("projectName").value = "";
    document.getElementById("projectDescription").value = "";
    document.getElementById("repositoryName").value = "";

    document.getElementById("myModal").classList.add("invisible");
  };

  const footer = document.getElementById("footer");
  const currentYear = new Date().getFullYear();
  footer.innerHTML = `&copy; ${currentYear} Tev and Brandon`;

  const projectsSection =
    document.querySelector("#completedProjects").parentElement;

  const clearButton = document.getElementById("clearCompletedButton");
  if (clearButton) {
    clearButton.addEventListener("click", async () => {
      if (
        confirm(
          "Are you sure you want to delete all completed projects? This cannot be undone.",
        )
      ) {
        await clearCompletedProjects();
        await displaySavedProjects();
        console.log("Completed projects cleared");
      }
    });
  }
});

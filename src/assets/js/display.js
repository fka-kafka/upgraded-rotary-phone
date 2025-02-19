import { APIzer, getLanguageColors } from "./apis";
import { retrieveSavedProjects, changeProjectStatus, deleteProject } from "./storage";

export async function prepareLanguageBars(repoData) {
  const languageColors = await getLanguageColors(repoData.languages.data);
  console.log(repoData, languageColors);
  const languageSizes = Object.values(repoData.languages.data);
  const totalBytes = languageSizes.reduce((a, b) => a + b, 0);

  const languageData = Object.keys(repoData.languages.data).reduce(
    (acc, key) => {
      acc[key] = {
        bytes: ((repoData.languages.data[key] / totalBytes) * 100).toFixed(1),
        color: languageColors[key],
      };
      return acc;
    },
    {},
  );

  console.log(languageData);

  const languageBarsHTML = Object.entries(languageData)
    .map(([language, data]) => {
      return `
              <div
                  class="language-bar"
                  style="
                      width: ${data.bytes}%;
                      background-color: ${data.color};"
                  title="${language}: ${data.bytes}%">
              </div>`;
    })
    .join("");

  return languageBarsHTML
}

export async function displaySavedProjects() {
  console.log("displaying");
  const allProjects = await retrieveSavedProjects();
  if (allProjects === null) return;

  const completedProjects = document.getElementById("completedProjects");
  const newProjects = document.getElementById("newProjects");

  completedProjects.innerHTML = "";
  newProjects.innerHTML = "";

  allProjects.forEach(async (project) => {
    let repoData = {}

    try {
      repoData = await new APIzer().getRepository(
        project?.repositoryName,
        project?.projectLead,
      );
    } catch (e) {
      console.error(e)
    }

    const languageBarsHTML = await prepareLanguageBars(repoData)

    const projectContainer = document.createElement("div");
    projectContainer.id = project.dateCreated;
    projectContainer.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-lg",
      "flex",
      "flex-col",
    );

    let completionInfo = ""
    if (project?.completed) {
      const completedDate = new Date(project.completedDate).toLocaleDateString(
        "en-GB",
      );
      const duration = project.duration || { hours: 0, minutes: 0 };
      completionInfo = `
        <p class="text-gray-700 mb-2"><span class="font-bold">Completed on:</span> ${completedDate}</p>
        <p class="text-gray-700 mb-2"><span class="font-bold">Duration:</span> ${duration.hours}h ${duration.minutes}m</p>
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
      <div id="card" class="card cursor-pointer my-2 ">
                  <div class="card-header">
                      <div>
                          <h1 class="card-title">
                            ${project?.projectLead}/${project?.repositoryName}
                          </h1>
                          <p class="card-description">
                            ${project.projectDescription}
                          </p>
                      </div>
                      <div class="card-logo">
                          <div class="logo-grid">
                              <div
                                  class="logo-cell"
                                  style="grid-area: 2 / 2 / 3 / 3"
                              ></div>
                              <div
                                  class="logo-cell"
                                  style="grid-area: 2 / 3 / 3 / 4"
                              ></div>
                              <div
                                  class="logo-cell"
                                  style="grid-area: 3 / 2 / 4 / 3"
                              ></div>
                              <div
                                  class="logo-cell"
                                  style="grid-area: 3 / 3 / 4 / 4"
                              ></div>
                          </div>
                      </div>
                  </div>
                  <div class="card-content ">
                      <div class="stats">
                          <div class="stat">
                              <svg
                                  aria-hidden="true"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  version="1.1"
                                  width="16"
                              >
                                  <path
                                      d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"
                                  ></path>
                              </svg>
                              <span>${2}</span>
                              <span>Contributors</span>
                          </div>
                          <div class="stat">
                              <svg
                                  aria-hidden="true"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  version="1.1"
                                  width="16"
                              >
                                  <path
                                      d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                                  ></path>
                                  <path
                                      d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"
                                  ></path>
                              </svg>
                              <span>${repoData.issues?.data.length}</span>
                              <span>Issues</span>
                          </div>
                          <div class="stat">
                              <svg
                                  aria-hidden="true"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  version="1.1"
                                  width="16"
                              >
                                  <path
                                      d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
                                  ></path>
                              </svg>
                              <span>${repoData.repository?.data?.stargazers_count}</span>
                              <span>Stars</span>
                          </div>
                          <div class="stat">
                              <svg
                                  aria-hidden="true"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  version="1.1"
                                  width="16"
                              >
                                  <path
                                      d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"
                                  ></path>
                              </svg>
                              <span>${repoData.repository?.data?.forks_count}</span>
                              <span>Forks</span>
                          </div>
                      </div>

                  </div>
                  <div
                      class="h-2 w-full flex"
                      id="colorBar"
                      style="
                          height: 0.5rem;
                          width: 100%;
                          display: flex;
                      "
                  >
                  ${languageBarsHTML}
                  </div>
                  </div>
      </div>
      <p class="text-gray-700 mb-2 "><span class="font-bold">Project Lead:</span> ${project?.projectLead}</p>
      <p class="text-gray-700 mb-2 "><span class="font-bold">Date Added:</span> ${new Date(
        Number(project.dateCreated),
      ).toLocaleDateString("en-GB")}</p>
      ${completionInfo}
      ${
        !project?.completed
          ? '<div class="flex justify-center w-full" id="buttonDiv"><button role="checkbox" id="toggleButton" class="bg-black text-white w-1/6 p-2 rounded-md">Complete</button></div>'
          : ""
      }
    `;

    if (!project?.completed) {
      setTimeout(() => {
        const button = projectContainer.querySelector("#toggleButton");

        if (button) {
          button.addEventListener("click", async (e) => {
            e.preventDefault();
            console.log("Complete button clicked");

            try {
              await changeProjectStatus(project.dateCreated);
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
              await deleteProject(project.dateCreated);
              projectContainer.remove();
            }
          });
        }
      }, 0);
    }

    const card = projectContainer.querySelector("#card");
    if (card) {
      card.addEventListener("click", (event) => {
        window.open(
          `https://github.com/${project?.projectLead}/${project?.repositoryName}`,
          "_blank",
        );
      });
    }

    project?.completed === true
      ? completedProjects.appendChild(projectContainer)
      : newProjects.appendChild(projectContainer);
  });
}

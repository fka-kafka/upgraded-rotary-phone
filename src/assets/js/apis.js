// Create 'make repo' route
// Create 'get repo info' route
//
import { Octokit } from "https://esm.sh/octokit";

const octokit = new Octokit({
  auth: import.meta.env.VITE_AUTH_KEY,
});

export async function createRepo(repoName) {
  try {
    const createResponse = await octokit.request("POST /user/repos", {
      name: repoName,
      description: "This is your first api repo!",
      homepage: "https://github.com",
      private: false,
      is_template: false,
      headers: {
        accept: "application/vnd.github+json",
      },
    });
    console.dir(createResponse);
    return createResponse
  } catch (error) {
    console.error("Status:", error.status);
    console.error("Response:", error.response);
    console.error("Message:", error.message);
  }
}

export async function getRepo() {
  const response = await octokit.request(
    "GET /repos/fka-kafka/wolt-django/languages",
    {
      owner: "fka-kafka",
      repo: "wolt-django",
      headers: {
        accept: "application/vnd.github+json",
      },
    },
  );
  return response;
}

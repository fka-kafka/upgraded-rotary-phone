import { Octokit } from "https://esm.sh/@octokit/core@4.2.2";

const octokit = new Octokit({
  auth: import.meta.env.VITE_AUTH_KEY,
});

export async function createRepo(repoName, description) {
  try {
    const createResponse = await octokit.request("POST /user/repos", {
      name: repoName,
      description: description,
      homepage: "https://github.com",
      private: false,
      is_template: false,
      headers: {
        accept: "application/vnd.github+json",
      },
    });
    console.dir(createResponse);
    return createResponse;
  } catch (error) {
    console.error("Status:", error.status);
    console.error("Response:", error.response);
    console.error("Message:", error.message);
  }
}

export async function getRepository(repoName, repoOwner) {
  try {
    console.log(repoName, repoOwner);
    const [repoData, issues, languages /*,collaborators*/] = await Promise.all([
      // Get repo data
      octokit.request("GET /repos/{owner}/{repo}", {
        owner: repoOwner,
        repo: repoName,
        headers: {
          accept: "application/vnd.github+json",
        },
      }),
      // Get repo issues
      octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner: repoOwner,
        repo: repoName,
        headers: {
          accept: "application/vnd.github+json",
        },
      }),
      // Get repo languages
      octokit.request("GET /repos/{owner}/{repo}/languages", {
        owner: repoOwner,
        repo: repoName,
        headers: {
          accept: "application/vnd.github+json",
        },
      }),
      // Get repo collaborators
      // octokit.request("GET /repos/{owner}/{repo}/collaborators", {
      //   owner: repoOwner,
      //   repo: repoName,
      //   headers: {
      //     accept: "application/vnd.github+json",
      //   },
      // })
    ]);

    return {
      repository: await repoData,
      issues: await issues,
      languages: await languages,
      // collaborators: await collaborators,
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
}

export async function getRepoColors() {
  const colorsResponse = await fetch(
    "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json",
  );
  return colorsResponse.json();
}

export async function getLanguageColors(repoLanguages) {
  // Get the full colors data
  const colorsData = await getRepoColors();

  // Create a new object with only the colors we need
  const languageColors = Object.fromEntries(
    Object.keys(repoLanguages)
      .map((lang) => [lang, colorsData[lang]?.color])
      .filter(([, color]) => color !== undefined),
  );

  return languageColors;
}

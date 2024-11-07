document.addEventListener("DOMContentLoaded", function () {
  const profilesContainer = document.getElementById("profilesContainer");
  const usernames = ["Tevstark", "fka-kafka"];

  // Add skeleton cards
  usernames.forEach(() => {
    profilesContainer.appendChild(createSkeletonCard());
  });

  async function fetchGitHubProfile(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const profile = await response.json();
      // Remove a skeleton card before rendering the actual profile
      const skeleton = profilesContainer.querySelector(".animate-pulse");
      if (skeleton) {
        skeleton.remove();
      }
      renderProfile(profile);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }

  // Fetch all profiles
  usernames.forEach(username => fetchGitHubProfile(username));
});


  function renderProfile(profile) {
    const profileCard = document.createElement("a");
    profileCard.href = profile.html_url;
    profileCard.target = "_blank";
    profileCard.classList.add(
      "bg-white",
      "border",
      "h-64",
      "p-4",
      "rounded-lg",
      "shadow-lg",
      "flex",
      "flex-col",
      "items-center",
      "hover:bg-gray-100",
      "transition",
      "duration-300"
    );

    const profileImage = document.createElement("img");
    profileImage.src = profile.avatar_url;
    profileImage.alt = `${profile.login}'s profile picture`;
    profileImage.classList.add("w-24", "h-24", "rounded-full", "mb-4");

    const profileName = document.createElement("h2");
    profileName.textContent = profile.login || profile.name; //display usernames first
    profileName.classList.add("text-xl", "font-bold", "mb-2");

    const profileDescription = document.createElement("p");
    profileDescription.textContent = profile.bio || "Certified Badass";
    profileDescription.classList.add("font-sans", "text-center");

    profileCard.appendChild(profileImage);
    profileCard.appendChild(profileName);
    profileCard.appendChild(profileDescription);
    profilesContainer.appendChild(profileCard);
  }

  function createSkeletonCard() {
    const skeletonCard = document.createElement("div");
    skeletonCard.classList.add(
      "bg-white",
      "border",
      "h-64",
      "p-4",
      "rounded-lg",
      "shadow-lg",
      "flex",
      "flex-col",
      "items-center",
      "animate-pulse"
    );


    const skeletonAvatar = document.createElement("div");
    skeletonAvatar.classList.add(
      "w-24",
      "h-24",
      "rounded-full",
      "mb-4",
      "bg-gray-200"
    );


    const skeletonName = document.createElement("div");
    skeletonName.classList.add(
      "h-4",
      "bg-gray-200",
      "rounded",
      "w-1/3",
      "mb-4"
    );

    const skeletonBio = document.createElement("div");
    skeletonBio.classList.add(
      "h-4",
      "bg-gray-200",
      "rounded",
      "w-2/3"
    );

    skeletonCard.appendChild(skeletonAvatar);
    skeletonCard.appendChild(skeletonName);
    skeletonCard.appendChild(skeletonBio);

    return skeletonCard;
  }

  fetchGitHubProfile("Tevstark");
  fetchGitHubProfile("fka-kafka");


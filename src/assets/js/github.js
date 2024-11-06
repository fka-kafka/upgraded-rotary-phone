document.addEventListener('DOMContentLoaded', function() {
  const profilesContainer = document.getElementById('profilesContainer');

  async function fetchGitHubProfile(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const profile = await response.json();
      renderProfile(profile);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }

  function renderProfile(profile) {
    const profileCard = document.createElement('a');
    profileCard.href = profile.html_url;
    profileCard.target = '_blank';
    profileCard.classList.add('bg-white', 'border', 'h-64', 'p-4', 'rounded-lg', 'shadow-lg', 'flex', 'flex-col', 'items-center', 'hover:bg-gray-100', 'transition', 'duration-300');

    const profileImage = document.createElement('img');
    profileImage.src = profile.avatar_url;
    profileImage.alt = `${profile.login}'s profile picture`;
    profileImage.classList.add('w-24', 'h-24', 'rounded-full', 'mb-4');

    const profileName = document.createElement('h2');
    profileName.textContent = profile.name || profile.login;
    profileName.classList.add('text-xl', 'font-bold', 'mb-2');

    const profileDescription = document.createElement('p');
    profileDescription.textContent = profile.bio || 'Certified Badass';
    profileDescription.classList.add('font-sans', 'text-center');



    profileCard.appendChild(profileImage);
    profileCard.appendChild(profileName);
    profilesContainer.appendChild(profileCard);
    profileCard.appendChild(profileDescription);
  }


  fetchGitHubProfile('Tevstark');
  fetchGitHubProfile('fka-kafka');
});
import { createAuth0Client } from "@auth0/auth0-spa-js";
// auth0
//   .createAuth0Client({
//     domain: "eeek-auth.us.auth0.com",
//     clientId: "14o3dw6AFzMElFlfxCBi5iLqiz3Hh5I4",
//     authorizationParams: {
//       redirect_uri: window.location.origin,
//     },
//   })
//   .then(async (auth0Client) => {
//     // Assumes a button with id "login" in the DOM
//     const loginButton = document.getElementById("login");

//     loginButton.addEventListener("click", (e) => {
//       e.preventDefault();
//       auth0Client.loginWithRedirect();
//     });

//     if (
//       location.search.includes("state=") &&
//       (location.search.includes("code=") || location.search.includes("error="))
//     ) {
//       await auth0Client.handleRedirectCallback();
//       window.history.replaceState({}, document.title, "/");
//     }

//     // Assumes a button with id "logout" in the DOM
//     const logoutButton = document.getElementById("logout");

//     logoutButton.addEventListener("click", (e) => {
//       e.preventDefault();
//       auth0Client.logout();
//     });

//     const isAuthenticated = await auth0Client.isAuthenticated();
//     const userProfile = await auth0Client.getUser();
//     console.log(userProfile);

//     // Assumes an element with id "profile" in the DOM
//     const profileElement = document.getElementById("profile");

//     if (isAuthenticated) {
//       loginButton.classList.toggle("hidden");
//       logoutButton.classList.toggle("hidden");
//       profileElement.style.display = "block";
//       profileElement.innerHTML = `
//             <p>${userProfile.name}</p>
//             <img src="${userProfile.picture}" />
//           `;
//     } else {
//       profileElement.style.display = "none";
//     }
//   });

const auth0Client = createAuth0Client({
  domain: import.meta.env.VITE_AUTH0_CLIENT_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
});

export async function handleLogin() {
  try {
    await (await auth0Client).loginWithRedirect();
    console.log("login succesful");
  } catch (e) {
    console.error(e);
  }

  return;
}

export async function handleLoginRedirect() {
  if (
    location.search.includes("state=") &&
    (location.search.includes("code=") || location.search.includes("error="))
  ) {
    await (await auth0Client).handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }
  return
}

export async function handleLogout() {
  try {
    await (await auth0Client).logout();
    console.log("logout succesful");
  } catch (e) {
    console.error(e);
  }
}

export async function checkAuthentication() {
  try {
    const isAuthenticated = await (await auth0Client).isAuthenticated();
    return isAuthenticated;
  } catch (e) {
    console.error(e);
  }
  return;
}

export async function getUser() {
  try {
    const userProfile = (await auth0Client).getUser();
    return userProfile;
  } catch (e) {
    console.error(e);
  }
}

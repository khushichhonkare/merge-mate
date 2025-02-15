// /**
//  * Initiates GitHub OAuth login flow by opening a popup window
//  * Uses Chrome extension's popup URL as the redirect target
//  */
// export const handleGitHubLogin = () => {
//   // GitHub OAuth application credentials and configuration
//   const clientId = process.env.CLIENT_ID;
//   const redirectUri = chrome.runtime.getURL('popup.html');
//   const scope = 'read:user user:email';
  
//   const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  
//   // Open OAuth login in a popup window
//   chrome.windows.create({
//     url: githubUrl,
//     type: 'popup',
//     width: 800,
//     height: 600
//   });
// };

// /**
//  * Exchanges OAuth code for access token via backend service
//  * Stores the received token in Chrome's local storage
//  */
// export const handleGitHubAuth = async (code: string) => {
//   try {
//     // Exchange authorization code for access token
//     const response = await fetch('YOUR_BACKEND_URL/auth/github', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ code })
//     });

//     const data = await response.json();
    
//     if (data.accessToken) {
//       // Store token in Chrome's local storage for future use
//       await chrome.storage.local.set({ 'github_token': data.accessToken });
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.error('GitHub authentication error:', error);
//     return false;
//   }
// };
export const handleGitHubLogin = () => {
  const clientId = 'SHA256:SvKnqdkxewc3FK9uk8Rj8sstgf4kFBT+OamymlxR92k=';
  const redirectUri = chrome.runtime.getURL('popup.html');
  const scope = 'read:user user:email';
  
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  
  chrome.windows.create({
    url: githubUrl,
    type: 'popup',
    width: 800,
    height: 600
  });
};

export const handleGitHubAuth = async (code: string) => {
  try {
    const response = await fetch('YOUR_BACKEND_URL/auth/github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    });

    const data = await response.json();
    
    if (data.accessToken) {
      await chrome.storage.local.set({ 'github_token': data.accessToken });
      return true;
    }
    return false;
  } catch (error) {
    console.error('GitHub authentication error:', error);
    return false;
  }
};
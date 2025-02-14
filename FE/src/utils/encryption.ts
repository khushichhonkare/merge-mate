import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'merge-mate-access-token'; // You might want to move this to an env variable

export const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
};

export const decryptToken = (encryptedToken: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const getStoredAccessToken = (): string | null => {
  const encryptedToken = localStorage.getItem('merge-mate-access');
  if (!encryptedToken) return null;
  return decryptToken(encryptedToken);
};

export const isGitHubPullRequestPage = (currentURL: string): boolean => {
  const prPagePattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+$/;
  if(currentURL.includes("github.com")) {
    return prPagePattern.test(currentURL);
  }
  return false;
};

export const getGitHubPRDetails = (currentURL: string) => {
  const matches = currentURL.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
  
  if (!matches) return null;
  
  return {
    owner: matches[1],
    repo: matches[2],
    pullNumber: parseInt(matches[3])
  };
}; 
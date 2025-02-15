import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

/**
 * Encrypts GitHub access token for secure storage
 */
export const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
};

/**
 * Decrypts stored GitHub access token
 */
export const decryptToken = (encryptedToken: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Retrieves and decrypts stored access token from localStorage
 */
export const getStoredAccessToken = (): string | null => {
  const encryptedToken = localStorage.getItem('merge-mate-access');
  if (!encryptedToken) return null;
  return decryptToken(encryptedToken);
};

/**
 * Validates if current URL matches GitHub PR page pattern
 * Example: https://github.com/owner/repo/pull/123
 */
export const isGitHubPullRequestPage = (currentURL: string): boolean => {
  const prPagePattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+$/;
  if(currentURL.includes("github.com")) {
    return prPagePattern.test(currentURL);
  }
  return false;
};

/**
 * Extracts owner, repo and PR number from GitHub PR URL
 */
export const getGitHubPRDetails = (currentURL: string) => {
  const matches = currentURL.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
  
  if (!matches) return null;
  
  return {
    owner: matches[1],
    repo: matches[2],
    pullNumber: parseInt(matches[3])
  };
}; 
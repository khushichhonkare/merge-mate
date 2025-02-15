import { useState, useEffect } from 'react'
import { getGitHubPRDetails, isGitHubPullRequestPage } from '../utils/encryption'

export interface PRDetails {
  owner: string
  repo: string
  pullNumber: string
  comments?: any[]
}

/**
 * Custom hook to fetch and manage GitHub PR details and comments
 * Handles PR page detection and data fetching based on URL and auth token
 */
export function useGitHubPR(currentURL: string, accessToken: string | null) {
  const [prDetails, setPRDetails] = useState<PRDetails | null>(null)
  const [isPRPage, setIsPRPage] = useState(false)

  // Check if current page is a PR and fetch basic PR details
  useEffect(() => {
    const checkPage = async () => {
      const isPR = await isGitHubPullRequestPage(currentURL)
      setIsPRPage(isPR)

      if (isPR) {
        const details = await getGitHubPRDetails(currentURL)
        setPRDetails({
          ...details,
          pullNumber: String(details.pullNumber)
        })
      }
    }

    if (currentURL) {
      checkPage()
    }
  }, [currentURL])

  // Fetch PR comments using GitHub API
  const fetchPullRequestComments = async () => {
    if (prDetails && accessToken) {
      const { owner, repo, pullNumber } = prDetails
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/comments`

      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json"
          }
        })

        if (response.ok) {
          const comments = await response.json()
          setPRDetails((prev) => ({
            ...prev,
            comments: comments
          }))
        } else {
          console.error("Failed to fetch PR comments", response.statusText)
        }
      } catch (error) {
        console.error("Error fetching PR comments:", error)
      }
    }
  }

  // Fetch comments when on PR page and access token is available
  useEffect(() => {
    if (isPRPage && accessToken) {
      fetchPullRequestComments()
    }
  }, [isPRPage, accessToken, prDetails])

  return { prDetails, isPRPage }
} 
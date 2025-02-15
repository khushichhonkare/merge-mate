import "./styles/globals.css"

import { useEffect, useState } from "react"
import { AccessTokenForm } from "./components/AccessTokenForm"
import { PRDetailsView } from "./components/PRDetails"
import { NotPRPage } from "./components/NotPRPage"
import { useGitHubPR } from "./hooks/useGitHubPR"
import { getStoredAccessToken } from "./utils/encryption"

/**
 * Main popup component that handles GitHub PR detection and content display
 * based on the current page and authentication status
 */
function IndexPopup() {
  // State to store the GitHub access token
  const [accessToken, setAccessToken] = useState<string | null>(null)
  // State to store the current tab's URL
  const [currentURL, setCurrentURL] = useState("")
  
  // Custom hook to fetch PR details using the current URL and access token
  const { prDetails, isPRPage } = useGitHubPR(currentURL, accessToken)

  // Get current tab's URL when popup opens
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      if (tab && tab.url) {
        setCurrentURL(tab.url)
      }
    })
  }, [])

  // Load stored access token on mount
  useEffect(() => {
    const storedToken = getStoredAccessToken()
    if (storedToken) {
      setAccessToken(storedToken)
    }
  }, [])

  // If no access token is present, show the token input form
  if (!accessToken) {
    return <AccessTokenForm onTokenSubmit={setAccessToken} />
  }

  // Render PR details if on a PR page, otherwise show the "Not PR Page" message
  return (
    <div>
      {isPRPage ? (
        <PRDetailsView prDetails={prDetails} />
      ) : (
        <NotPRPage />
      )}
    </div>
  )
}

export default IndexPopup

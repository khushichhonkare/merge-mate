import "./styles/globals.css"

import { useEffect, useState } from "react"
import { AccessTokenForm } from "./components/AccessTokenForm"
import { PRDetailsView } from "./components/PRDetails"
import { NotPRPage } from "./components/NotPRPage"
import { useGitHubPR } from "./hooks/useGitHubPR"
import { getStoredAccessToken } from "./utils/encryption"

function IndexPopup() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [currentURL, setCurrentURL] = useState("")
  
  const { prDetails, isPRPage } = useGitHubPR(currentURL, accessToken)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      if (tab && tab.url) {
        setCurrentURL(tab.url)
      }
    })
  }, [])

  useEffect(() => {
    const storedToken = getStoredAccessToken()
    if (storedToken) {
      setAccessToken(storedToken)
    }
  }, [])

  if (!accessToken) {
    console.log("No access token")
    return <AccessTokenForm onTokenSubmit={setAccessToken} />
  }

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

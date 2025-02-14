import "./styles/globals.css"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "~components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~components/ui/form"
import { Input } from "~components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~components/ui/table"
import { Eye } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~components/ui/tooltip"

import {
  encryptToken,
  getGitHubPRDetails,
  getStoredAccessToken,
  isGitHubPullRequestPage
} from "./utils/encryption"

const formSchema = z.object({
  access_token: z
    .string()
    .min(1, {
      message: "Access token is required."
    })
   
})

function IndexPopup() {
  const [accessToken, setAccessToken] = useState(null)
  const [prDetails, setPRDetails] = useState(null)
  const [currentURL, setCurrentURL] = useState("")
  const [isPRPage, setIsPRPage] = useState(false)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      access_token: ""
    }
  })


  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      if (tab && tab.url) {
        setCurrentURL(tab.url)
      }
    })
  }, [])

  useEffect(() => {
    const checkPage = async () => {
      const isPR = await isGitHubPullRequestPage(currentURL)
      setIsPRPage(isPR)

      if (isPR) {
        const details = await getGitHubPRDetails(currentURL)
        setPRDetails(details)
      }
    }

    if (currentURL) {
      checkPage()
    }
  }, [currentURL])

  useEffect(() => {
    const storedToken = getStoredAccessToken()
    if (storedToken) {
      setAccessToken(storedToken)
    }
  }, [])

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

  useEffect(() => {
    if (isPRPage && accessToken) {
      fetchPullRequestComments()
    }
  }, [isPRPage, accessToken, prDetails])

  const onSubmit = (data) => {
    setAccessToken(data.access_token)
    localStorage.removeItem("merge-mate-access")
    const encryptedToken = encryptToken(data.access_token)
    localStorage.setItem("merge-mate-access", encryptedToken)
  }

  const accessTokenLink =
    "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"

  return accessToken ? (
    <div>
      {isPRPage ? (
        <div className="w-[600px] p-4">
          <div className="flex flex-col border-b border-gray-200 pb-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Merge Mate</h1>
              <div className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                Beta
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Repository:</span>
                <span className="hover:text-blue-600 cursor-pointer">
                  {prDetails?.owner}/{prDetails?.repo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Pull Request:</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                  #{prDetails?.pullNumber}
                </span>
              </div>
            </div>
          </div>

          <Table>
            <TableCaption className="text-gray-600 mb-2">
              A list of comments on this pull request
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-gray-50">
                <TableHead className="text-center font-semibold text-gray-700">Comment</TableHead>
                <TableHead className="text-center font-semibold text-gray-700">Author</TableHead>
                <TableHead className="text-center font-semibold text-gray-700">Status</TableHead>
                <TableHead className="text-center font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prDetails?.comments?.map((comment) => (
                <TableRow key={comment.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-center max-w-[250px] truncate">
                    {comment.body}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <img 
                        src={comment.user.avatar_url} 
                        alt={comment.user.login}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-gray-600">{comment.user.login}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {comment.position === null ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Outdated
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center p-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => window.open(comment.html_url, "_blank")}
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">View Comment</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col w-[400px] items-center justify-center p-6 bg-white rounded-lg shadow-md border border-gray-200 space-y-4">
          <div className="text-4xl mb-2">🤔</div>
          <h2 className="text-xl font-semibold text-gray-800">
            Oops! Not a Pull Request Page
          </h2>
          <p className="text-gray-600 text-center">
            Please navigate to a GitHub pull request page to use this extension
          </p>
          <a
            href="https://github.com/pulls"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center px-4 py-2 bg-[#2da44e] text-white rounded-md hover:bg-[#2c974b] transition-colors">
            Go to GitHub Pull Requests
          </a>
        </div>
      )}
    </div>
  ) : (
    <div className="flex justify-center items-center w-[450px] min-w-[450px] p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-8 p-4 w-full border-2 bg-gray-100 border-gray-300">
          <FormField
            control={form.control}
            name="access_token"
            render={({ field }) => (
              <FormItem className="w-full text-center">
                <FormLabel className="text-center text-xl font-semibold">
                  Please enter your access token
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="ghp_abcDEFGHIJKLMNOPQRSTUVWXYZ123..."
                    {...field}
                    className="text-sm"
                  />
                </FormControl>
                <FormDescription className="text-center text-sm">
                  Click{" "}
                  <a
                    href={accessTokenLink}
                    target="_blank"
                    className="text-blue-500">
                    here
                  </a>{" "}
                  to see how to generate access token
                </FormDescription>
                <FormMessage className="text-center text-sm" />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-4 text-base">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default IndexPopup

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
    .regex(/^ghp_[a-zA-Z0-9]+$/, {
      message: "Invalid access token format. It should start with 'ghp_'"
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

  const dummyData = [
    {
      url: "https://api.github.com/repos/khushichhonkare/demo-repo/pulls/comments/1953208196",
      pull_request_review_id: 2612872090,
      id: 1953208196,
      node_id: "PRRC_kwDON4jeVs50a5eE",
      diff_hunk:
        "@@ -1 +1,6 @@\n-This is a demo txt file\n\\ No newline at end of file\n+This is a demo txt file\n+This is a demo txt file\n+",
      path: "demo-file.txt",
      commit_id: "a8c5292eb14d1900c822f9d126d2550161abefbc",
      original_commit_id: "a8c5292eb14d1900c822f9d126d2550161abefbc",
      user: {
        login: "khushichhonkare",
        id: 93440608,
        node_id: "U_kgDOBZHKYA",
        avatar_url: "https://avatars.githubusercontent.com/u/93440608?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/khushichhonkare",
        html_url: "https://github.com/khushichhonkare",
        followers_url: "https://api.github.com/users/khushichhonkare/followers",
        following_url:
          "https://api.github.com/users/khushichhonkare/following{/other_user}",
        gists_url:
          "https://api.github.com/users/khushichhonkare/gists{/gist_id}",
        starred_url:
          "https://api.github.com/users/khushichhonkare/starred{/owner}{/repo}",
        subscriptions_url:
          "https://api.github.com/users/khushichhonkare/subscriptions",
        organizations_url: "https://api.github.com/users/khushichhonkare/orgs",
        repos_url: "https://api.github.com/users/khushichhonkare/repos",
        events_url:
          "https://api.github.com/users/khushichhonkare/events{/privacy}",
        received_events_url:
          "https://api.github.com/users/khushichhonkare/received_events",
        type: "User",
        user_view_type: "public",
        site_admin: false
      },
      body: "remove this line gap",
      created_at: "2025-02-12T18:35:16Z",
      updated_at: "2025-02-12T18:35:37Z",
      html_url:
        "https://github.com/khushichhonkare/demo-repo/pull/1#discussion_r1953208196",
      pull_request_url:
        "https://api.github.com/repos/khushichhonkare/demo-repo/pulls/1",
      author_association: "OWNER",
      _links: {
        self: {
          href: "https://api.github.com/repos/khushichhonkare/demo-repo/pulls/comments/1953208196"
        },
        html: {
          href: "https://github.com/khushichhonkare/demo-repo/pull/1#discussion_r1953208196"
        },
        pull_request: {
          href: "https://api.github.com/repos/khushichhonkare/demo-repo/pulls/1"
        }
      },
      reactions: {
        url: "https://api.github.com/repos/khushichhonkare/demo-repo/pulls/comments/1953208196/reactions",
        total_count: 0,
        "+1": 0,
        "-1": 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0
      },
      start_line: null,
      original_start_line: null,
      start_side: null,
      line: 3,
      original_line: 3,
      side: "RIGHT",
      original_position: 5,
      position: 5,
      subject_type: "line"
    },
    {
      url: "https://api.github.com/repos/khushichhonkare/demo-repo/pulls/comments/1953208362",
      pull_request_review_id: 2612872090,
      id: 1953208362,
      node_id: "PRRC_kwDON4jeVs50a5gq",
      diff_hunk:
        "@@ -1 +1,6 @@\n-This is a demo txt file\n\\ No newline at end of file\n+This is a demo txt file\n+This is a demo txt file\n+\n+This is a demo txt file\n+",
      path: "demo-file.txt",
      commit_id: "a8c5292eb14d1900c822f9d126d2550161abefbc",
      original_commit_id: "a8c5292eb14d1900c822f9d126d2550161abefbc",
      user: {
        login: "khushichhonkare",
        id: 93440608,
        node_id: "U_kgDOBZHKYA",
        avatar_url: "https://avatars.githubusercontent.com/u/93440608?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/khushichhonkare",
        html_url: "https://github.com/khushichhonkare",
        followers_url: "https://api.github.com/users/khushichhonkare/followers",
        following_url:
          "https://api.github.com/users/khushichhonkare/following{/other_user}",
        gists_url:
          "https://api.github.com/users/khushichhonkare/gists{/gist_id}",
        starred_url:
          "https://api.github.com/users/khushichhonkare/starred{/owner}{/repo}",
        subscriptions_url:
          "https://api.github.com/users/khushichhonkare/subscriptions",
        organizations_url: "https://api.github.com/users/khushichhonkare/orgs",
        repos_url: "https://api.github.com/users/khushichhonkare/repos",
        events_url:
          "https://api.github.com/users/khushichhonkare/events{/privacy}",
        received_events_url:
          "https://api.github.com/users/khushichhonkare/received_events",
        type: "User",
        user_view_type: "public",
        site_admin: false
      },
      body: "remove this line too",
      created_at: "2025-02-12T18:35:25Z",
      updated_at: "2025-02-12T18:35:37Z",
      html_url:
        "https://github.com/khushichhonkare/demo-repo/pull/1#discussion_r1953208362",
      pull_request_url:
        "https://api.github.com/repos/khushichhonkare/demo-repo/pulls/1",
      author_association: "OWNER",
      _links: {
        self: {
          href: "https://api.github.com/repos/khushichhonkare/demo-repo/pulls/comments/1953208362"
        },
        html: {
          href: "https://github.com/khushichhonkare/demo-repo/pull/1#discussion_r1953208362"
        },
        pull_request: {
          href: "https://api.github.com/repos/khushichhonkare/demo-repo/pulls/1"
        }
      },
      reactions: {
        url: "https://api.github.com/repos/khushichhonkare/demo-repo/pulls/comments/1953208362/reactions",
        total_count: 0,
        "+1": 0,
        "-1": 0,
        laugh: 0,
        hooray: 0,
        confused: 0,
        heart: 0,
        rocket: 0,
        eyes: 0
      },
      start_line: null,
      original_start_line: null,
      start_side: null,
      line: 5,
      original_line: 5,
      side: "RIGHT",
      original_position: 7,
      position: 7,
      subject_type: "line"
    }
  ]
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
          <div className="flex flex-col border-b border-gray-200 pb-3">
            <h1 className="text-2xl font-bold">Merge Mate</h1>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Repository:</span>
                <span>
                  {prDetails?.owner}/{prDetails?.repo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Pull Request:</span>
                <span>#{prDetails?.pullNumber}</span>
              </div>
            </div>
          </div>

          <Table>
            <TableCaption>Pull Request Comments</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Comment</TableHead>
                <TableHead className="text-center">Author</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyData.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium text-center">{comment.body}</TableCell>
                  <TableCell className="text-center">{comment.user.login}</TableCell>
                  <TableCell className="text-center">
                    {comment.position === null ? "Outdated" : "Active"}
                  </TableCell>
                  <TableCell className="text-center p-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span 
                            className="inline-flex cursor-pointer hover:text-blue-500 transition-colors"
                            onClick={() => window.open(comment.html_url, "_blank")}
                          >
                            <Eye className="h-4 w-4" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Comment</p>
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

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~components/ui/table"
import { Eye } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~components/ui/tooltip"
import type { PRDetails } from "../hooks/useGitHubPR"

interface PRDetailsViewProps {
  prDetails: PRDetails
}

/**
 * Displays pull request information and a table of comments with their status and actions
 */
export function PRDetailsView({ prDetails }: PRDetailsViewProps) {
  return (
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
              {prDetails.owner}/{prDetails.repo}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Pull Request:</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full">
              #{prDetails.pullNumber}
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
          {prDetails.comments?.map((comment) => (
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
  )
} 
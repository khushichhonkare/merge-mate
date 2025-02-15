export function NotPRPage() {
  return (
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
  )
} 
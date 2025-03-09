# Merge Mate - GitHub PR Review Extension

Usually, when I receive too many PR comments, I lose track of them because GitHub hides some behind a "Click here to load more comments" message. As a result, multiple comments get overlooked while resolving PR feedback.

Here’s the ultimate solution—Mergeee Mate! 🚀

It's a Chrome extension that enhances your GitHub Pull Request review experience by providing quick access to PR details and comments, ensuring you never miss important feedback again!

## Features

- 🔒 Secure GitHub authentication
- 🔍 Automatic PR page detection
- 💬 View PR comments and their status
- 🔐 Encrypted token storage
- 🎯 Quick navigation to specific comments

## Tech Stack

- **Framework**: React + TypeScript
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **Security**: CryptoJS for token encryption
- **UI Components**: Custom shadcn/ui components

## Project Structure 
├── src/
│ ├── components/ # React components
│ │ ├── AccessTokenForm # GitHub token input form
│ │ ├── NotPRPage # Non-PR page message
│ │ ├── PRDetails # PR information display
│ │ └── ui/ # Reusable UI components
│ ├── hooks/
│ │ └── useGitHubPR # PR data fetching hook
│ ├── lib/
│ │ ├── githubAuth # GitHub OAuth handling
│ │ └── utils # Utility functions
│ ├── utils/
│ │ └── encryption # Token encryption utilities
│ └── popup.tsx # Main extension popup├── src/
│ ├── components/ # React components
│ │ ├── AccessTokenForm # GitHub token input form
│ │ ├── NotPRPage # Non-PR page message
│ │ ├── PRDetails # PR information display
│ │ └── ui/ # Reusable UI components
│ ├── hooks/
│ │ └── useGitHubPR # PR data fetching hook
│ ├── lib/
│ │ ├── githubAuth # GitHub OAuth handling
│ │ └── utils # Utility functions
│ ├── utils/
│ │ └── encryption # Token encryption utilities
│ └── popup.tsx # Main extension popup


## Setup & Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd FE
   npm install
   ```
3. Create a GitHub OAuth app and update the `clientId` in `src/lib/githubAuth.ts`
4. Build the extension:
   ```bash
   npm run build
   ```
5. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Security

- GitHub access tokens are encrypted using AES encryption before storage
- Tokens are stored in browser's localStorage in encrypted form
- OAuth authentication flow uses a secure popup window
- Environment variables are used for sensitive data

## Usage

1. Click the extension icon in Chrome
2. If not authenticated, provide your GitHub access token
3. When viewing a GitHub PR:
   - See PR details and repository information
   - View all PR comments with their status (Active/Outdated)
   - Click the eye icon to navigate to specific comments
4. On non-PR pages, a helpful message is displayed

## Development

1. Make changes to the code
2. Run development server:
   ```bash
   npm run dev
   ```
3. The extension will auto-reload with your changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
MIT License - feel free to use and modify for your needs!
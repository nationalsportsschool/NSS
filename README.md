# National Sports School Portal

A comprehensive PWA for sports school management with Admin, Coach, and Parent interfaces.

## PWA Features

This project has been enhanced with the following PWA features:

- **Offline Support**: Access previously viewed pages even without an internet connection
- **Installable**: Add to your home screen for app-like experience on mobile and desktop
- **Dark Mode**: Automatically adapts to system preferences or manual toggle
- **Responsive Design**: Optimized for all screen sizes
- **Fast Loading**: Efficient caching strategies for quick access
- **Automatic Updates**: Service workers ensure users always get the latest version

## Project info

**URL**: https://lovable.dev/projects/905c6f1d-3dbd-4246-9a3e-4c0ea07fb89f

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/905c6f1d-3dbd-4246-9a3e-4c0ea07fb89f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite & vite-plugin-pwa
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- PWA service workers
- React Router
- React Query
- next-themes (for dark mode)
- Recharts (for analytics)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/905c6f1d-3dbd-4246-9a3e-4c0ea07fb89f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## PWA Development Notes

### Service Worker Management

- In development mode, service workers are automatically disabled to prevent caching issues
- In production, vite-plugin-pwa handles registration and updates with the "autoUpdate" strategy

### Theme Support 

- The app supports light, dark, and system themes via next-themes
- Toggle between themes using the sun/moon icon in the navigation bar

### Installation

- Users will see an install prompt after interacting with the site
- iOS users receive custom instructions for adding to home screen
- The prompt is shown once per week unless permanently dismissed

### Offline Support

- The app caches essential assets and API responses
- An offline banner appears when network connectivity is lost
- Users can access previously visited pages even when offline

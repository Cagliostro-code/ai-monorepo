import { RouterProvider, createRouter } from '@tanstack/react-router';
// import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import './index.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { App } from 'antd';
// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const RootEl = document.getElementById('root');
if (RootEl) {
  createRoot(RootEl).render(
    // <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>,
    // </StrictMode>,
  );
}

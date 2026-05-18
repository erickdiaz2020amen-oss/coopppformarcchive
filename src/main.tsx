import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Buffer } from 'buffer';

// Polyfill Buffer for @react-pdf/renderer
(globalThis as any).Buffer = Buffer;

import './index.css';
import { App } from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import { AdminLayout } from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import SolicitudDetail from './pages/admin/SolicitudDetail';

// Create a root route
const rootRoute = createRootRoute({});

// User Routes
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  component: Home,
});

// Admin Routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: Dashboard,
});

const solicitudesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/solicitudes',
  component: Dashboard, // Redirige a dashboard por ahora
});

const solicitudDetailRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/solicitudes/$id',
  component: SolicitudDetail,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  appRoute.addChildren([indexRoute]),
  loginRoute,
  adminRoute.addChildren([dashboardRoute, solicitudesRoute, solicitudDetailRoute])
]);

// Create the router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

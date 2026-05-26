import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Buffer } from 'buffer';

// Polyfill Buffer for @react-pdf/renderer
(globalThis as any).Buffer = Buffer;

import './index.css';
import { PublicLayout } from './layouts/PublicLayout';
import Landing from './pages/Landing';
import AbrirCuenta from './pages/AbrirCuenta';
import Prestamos from './pages/Prestamos';
import PrestamoDetail from './pages/prestamos/PrestamoDetail';
import Login from './pages/Login';
import { AdminLayout } from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import SolicitudDetail from './pages/admin/SolicitudDetail';

// Create a root route
const rootRoute = createRootRoute({});

// ──────────────────────────────────────────────
// PUBLIC ROUTES (PublicLayout: header + footer)
// ──────────────────────────────────────────────
const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: PublicLayout,
});

const landingRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/',
  component: Landing,
});

const abrirCuentaRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/abrir-cuenta',
  component: AbrirCuenta,
});

const prestamosRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/prestamos',
  component: Prestamos,
});

const prestamoDetailRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/prestamos/$tipo',
  component: PrestamoDetail,
});

// ──────────────────────────────────────────────
// AUTH / ADMIN ROUTES
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// ROUTE TREE
// ──────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  publicRoute.addChildren([
    landingRoute,
    abrirCuentaRoute,
    prestamosRoute,
    prestamoDetailRoute,
  ]),
  loginRoute,
  adminRoute.addChildren([dashboardRoute, solicitudesRoute, solicitudDetailRoute]),
]);

// Create the router instance
const router = createRouter({ 
  routeTree,
  basepath: '/digital'
});

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

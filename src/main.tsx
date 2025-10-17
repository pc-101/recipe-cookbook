import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '@/App';
import Cookbook from '@/routes/Cookbook';
import ShoppingList from '@/routes/ShoppingList';
import { ThemeProvider } from '@/components/ThemeProvider';
import '@/index.css';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/cookbook', element: <Cookbook /> },
  { path: '/shopping-list', element: <ShoppingList /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);

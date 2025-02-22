import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router/dom';
import { router } from './routes/Routes';
import AuthProvider from './providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <section className='bg-purple-100'>
          <RouterProvider router={router}></RouterProvider>
        </section>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)

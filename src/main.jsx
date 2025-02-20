import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router/dom';
import { router } from './routes/Routes';
import AuthProvider from './providers/AuthProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <section className='bg-base-100'>
        <RouterProvider router={router}></RouterProvider>
      </section>
    </AuthProvider>
  </StrictMode>,
)

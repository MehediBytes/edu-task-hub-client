import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router/dom';
import { router } from './routes/Routes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <section className='bg-base-100'>
      <RouterProvider router={router}></RouterProvider>
    </section>
  </StrictMode>,
)

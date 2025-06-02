import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import './index.css';
import App from './App';

// React Router v7 için uyarıları gidermek için future flag'leri kullanıyoruz
const router = createBrowserRouter(
  [{ path: "*", element: <App /> }],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Router versiyonunuza göre aşağıdaki iki seçenekten birini kullanın */}

    {/* Seçenek 1: RouterProvider (react-router-dom v6.4+) */}
    <RouterProvider router={router} />

    {/* Seçenek 2: BrowserRouter (eski stil) */}
    {/* <BrowserRouter>
      <App />
    </BrowserRouter> */}
  </React.StrictMode>
);

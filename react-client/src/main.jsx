import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import App from './App.jsx';
import Layout from './components/Layout.jsx';
import Pelanggan from './Pages/pelanggan/App.jsx';
import DetailPelanggan from './Pages/pelanggan/Detail.jsx';
import Kategori from './Pages/kategori/App.jsx';
import Barang from './Pages/barang/App.jsx';
import Penjualan from './Pages/penjualan/App.jsx';
import DetailBarang from './Pages/barang/Detail.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: 'pelanggan',
        element: <Pelanggan />
      },
      {
        path: 'pelanggan/:id',
        element: <DetailPelanggan />
      },
      {
        path: 'kategori',
        element: <Kategori />
      },
      {
        path: 'barang',
        element: <Barang />
      },
      {
        path: 'barang/:id',
        element: <DetailBarang />
      },
      {
        path: 'penjualan',
        element: <Penjualan />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

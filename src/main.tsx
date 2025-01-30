import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from "react-router";
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import UserContextProvider from './context/UserContextProvider.tsx';
import LoginForm from './pages/LoginPage.tsx';
import Dashboard from './pages/Layout.tsx';
import AdminsPage from './pages/AdminsPage/AdminsPage.tsx';
import MembersPages from './pages/MembersPage/MembersPages.tsx';
import FamiliesPage from './pages/FamiliesPage.tsx';
import LogsPage from './pages/LogsPage.tsx';
import OrdersPage from './pages/OrdersPage.tsx';
import HomePage from './pages/HomePage.tsx';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <HashRouter>
      <UserContextProvider>
        <Routes>
          <Route path='/' element={<LoginForm />} />
          <Route element={<Dashboard />}>
            <Route path='/home' element={<HomePage />} />
            <Route path='/admins' element={<AdminsPage />} />
            <Route path='/members' element={<MembersPages />} />
            <Route path='/families' element={<FamiliesPage />} />
            <Route path='/logs' element={<LogsPage />} />
            <Route path='/orders' element={<OrdersPage />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </HashRouter>
  </ThemeProvider>
)

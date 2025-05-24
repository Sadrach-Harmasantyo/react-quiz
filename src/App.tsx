import { type ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Layout from "./components/Layout";
import { useAuthStore } from "./store/authStore";

// Konfigurasi React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Komponen untuk melindungi rute yang membutuhkan autentikasi
// Akan redirect ke halaman login jika user belum login
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((state) => state.user);

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Komponen untuk rute publik yang hanya bisa diakses ketika tidak login
// Akan redirect ke home jika user sudah login
const PublicRoute = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((state) => state.user);

  if (user.isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Konfigurasi rute aplikasi
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rute autentikasi tanpa header */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Rute dengan header */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      {/* Rute quiz dilindungi, hanya bisa diakses setelah login */}
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <Layout>
              <Quiz />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* Redirect rute yang tidak dikenal ke home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Komponen utama aplikasi
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}

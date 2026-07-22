import React, { useEffect, useState } from "react";

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function AdminGuard({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const adminData = localStorage.getItem("admin");

      if (!adminData) {
        window.location.href = "/admin-login";
        return;
      }

      try {
        const admin = JSON.parse(adminData);
        if (
          !admin.access_token ||
          !admin.role ||
          admin.role !== "admin" ||
          isTokenExpired(admin.access_token)
        ) {
          localStorage.removeItem("admin");
          localStorage.removeItem("barber");
          window.location.href = "/admin-login";
          return;
        }

        setIsAuthorized(true);
      } catch {
        localStorage.removeItem("admin");
        localStorage.removeItem("barber");
        window.location.href = "/admin-login";
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f1a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

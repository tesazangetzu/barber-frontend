import React, { useEffect, useState } from "react";

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
        if (!admin.access_token || !admin.role || admin.role !== "admin") {
          localStorage.removeItem("admin");
          window.location.href = "/admin-login";
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        localStorage.removeItem("admin");
        window.location.href = "/admin-login";
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

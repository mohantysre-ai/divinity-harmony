import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLocale } from "@/hooks/use-locale";

const NotFound = () => {
  const location = useLocation();
  const { tk } = useLocale();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600 dark:text-muted-foreground">
          {tk("pageNotFound")}
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          {tk("pageNotFoundDesc")}
        </p>
        <Link
          to="/"
          className="text-blue-500 underline hover:text-blue-700 dark:text-primary"
        >
          {tk("returnToHome")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

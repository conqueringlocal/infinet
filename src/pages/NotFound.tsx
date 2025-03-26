
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  
  // Check if this is the root edit route specifically
  const isRootEditRoute = location.pathname === "/edit";
  
  // Check if this is any other edit route that wasn't found
  const isEditRoute = location.pathname.endsWith('/edit');
  
  // Get the base path (for non-root paths)
  const basePath = isRootEditRoute 
    ? "/" 
    : isEditRoute 
      ? location.pathname.slice(0, -5) 
      : location.pathname;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      isRootEditRoute ? "(Attempted root edit mode)" : (isEditRoute ? `(Attempted edit mode for ${basePath})` : '')
    );
  }, [location.pathname, isEditRoute, basePath, isRootEditRoute]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-800 mb-6">Oops! Page not found</p>
        
        {(isRootEditRoute || isEditRoute) && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-amber-700 mb-2">
              You attempted to access edit mode for a page that doesn't exist.
            </p>
            <p className="text-sm text-amber-600">
              Make sure you're adding "/edit" to a valid page URL.
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <Link 
            to="/" 
            className="block w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Return to Home
          </Link>
          
          {isEditRoute && !isRootEditRoute && (
            <Link 
              to={basePath} 
              className="block w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Try without edit mode
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;

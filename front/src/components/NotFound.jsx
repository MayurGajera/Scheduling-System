import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * @constant NotFound
 * @description Displays a 404 error page when the requested route is not found.
 * Provides a button to navigate back to the home page.
 *
 * @returns {JSX.Element} The rendered 404 Not Found page.
 */
const NotFound = () => {
  /**
   * @constant navigate
   * @description React Router navigation function.
   */
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div className="text-center">
        <h1 className="display-3 text-danger">404</h1>
        <h4 className="mb-3">Page Not Found</h4>
        <p className="text-muted">
          The link you're trying to access is invalid or expired.
        </p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

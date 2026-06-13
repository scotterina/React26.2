import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div>
      <h2>404 Error - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Return to the home page</Link>
    </div>
  );
}

export default NotFoundPage;

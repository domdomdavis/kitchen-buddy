import { Link } from "@remix-run/react";

export const HomeButton = () => {
  return (
    <div>
      <Link
        to="/"
        className="text-xl p-4 bg-violet-300 rounded-md font-medium hover:bg-violet-500 w-full"
      >
        Back to Home
      </Link>
    </div>
  );
};

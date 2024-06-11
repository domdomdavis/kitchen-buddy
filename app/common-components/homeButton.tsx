import { Link } from "@remix-run/react";

export const HomeButton = () => {
  return (
    <div>
      {" "}
      <Link
        to="/"
        className="text-xl mt-8 ml-8 p-4 bg-violet-300 rounded-md font-medium hover:bg-violet-500"
      >
        Back to Home
      </Link>
    </div>
  );
};

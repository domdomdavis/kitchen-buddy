import { Link } from "@remix-run/react";
import { useState } from "react";
import { UserType } from "~/helpers/types";
type NavbarProps = {
  user: UserType;
};
export const Navbar = ({ user }: NavbarProps) => {
  const [openMobileNav, setOpenMobileNav] = useState(false);
  return (
    <div>
      <div className="block lg:hidden m-4">
        <button
          className="flex items-center px-3 py-2 border rounded text-fuchsia-500 border-orange-500"
          onClick={() => setOpenMobileNav(!openMobileNav)}
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
        {openMobileNav && (
          <div>
            <ul className="flex flex-col items-center justify-between min-h-[250px]">
              <li className="border-b border-sky-400 my-8 font-medium ">
                <a href="/">Home</a>
              </li>
              <li className="border-b border-sky-400 my-8 font-medium">
                <a href="/recipes/new">Add Recipe</a>
              </li>
              <li className="border-b border-sky-400 my-8 font-medium">
                <a href="/inventory">View Inventory</a>
              </li>
              <li>
                <form
                  action="/logout"
                  method="POST"
                  className="border-b border-sky-400 my-8 font-medium"
                >
                  <button className="font-medium" type="submit">
                    Logout{" "}
                    <span className="font-semibold ">{user.username}</span>
                  </button>
                </form>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="hidden lg:flex justify-between mt-2 p-2">
        <span>
          <span className="mx-4">
            <Link
              to="/"
              className="font-medium hover:text-violet-700 hover:font-semibold"
            >
              Home
            </Link>
          </span>

          <span className="mx-4">
            <Link
              to="/recipes/new"
              className="font-medium hover:text-violet-700 hover:font-semibold"
            >
              Add Recipe
            </Link>
          </span>
          <span className="mx-4">
            {" "}
            <Link
              to="/inventory"
              className="font-medium hover:text-violet-700 hover:font-semibold"
            >
              View Inventory
            </Link>
          </span>
        </span>

        <span>
          {!user ? (
            <Link
              to="/login"
              className="font-medium hover:text-violet-700 hover:font-semibold"
            >
              Login
            </Link>
          ) : (
            <div className="mx-4">
              <form
                action="/logout"
                method="POST"
                className="flex justify-end hover:text-orange-700 hover:font-semibold"
              >
                <button className="font-medium" type="submit">
                  Logout <span className="font-semibold ">{user.username}</span>
                </button>
              </form>
            </div>
          )}
        </span>
      </div>
      <div className="bg-gradient-to-r from-orange-300 via-fuchsia-300 to-violet-300 h-0.5"></div>
    </div>
  );
};

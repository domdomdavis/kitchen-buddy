import { Link } from "@remix-run/react";
import { useState } from "react";
import { UserType } from "~/helpers/types";
type NavbarProps = {
  user: UserType;
};
export const Navbar = ({ user }: NavbarProps) => {
  return (
    <div>
      {" "}
      <div className="flex justify-between mt-2 p-2">
        <span>
          <span className="mx-4">
            <Link to="/" className="font-medium">
              Home
            </Link>
          </span>

          <span className="mx-4">
            <Link to="/recipes/new" className="font-medium">
              Add Recipe
            </Link>
          </span>
          <span className="mx-4">
            {" "}
            <Link to="/inventory" className="font-medium">
              View Inventory
            </Link>
          </span>
        </span>

        <span>
          {!user ? (
            <Link to="/login" className="font-medium">
              Login
            </Link>
          ) : (
            <div className="mx-4">
              <form action="/logout" method="POST" className="flex justify-end">
                <button className="font-medium" type="submit">
                  Logout <span className="font-semibold">{user.username}</span>
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

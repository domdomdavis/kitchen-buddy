import { Link } from "@remix-run/react";
import { useState } from "react";
import { UserType } from "~/helpers/types";
type NavbarProps = {
  user: UserType;
};
export const Navbar = ({ user }: NavbarProps) => {
  return (
    <div className="flex justify-between mt-2">
      <span>
        <span className="mx-4">
          <Link to="/" className="">
            Home
          </Link>
        </span>

        <span className="mx-4">
          <Link to="/recipes/new" className="">
            Add Recipe
          </Link>
        </span>
        <span className="mx-4">
          {" "}
          <Link to="/inventory" className="">
            View Inventory
          </Link>
        </span>
      </span>

      <span>
        {!user ? (
          <Link to="/login" className="">
            Login
          </Link>
        ) : (
          <div className="mx-4">
            <form action="/logout" method="POST" className="flex justify-end">
              <button className="" type="submit">
                Logout
              </button>
            </form>
          </div>
        )}
      </span>
    </div>
  );
};

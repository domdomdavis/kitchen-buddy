import { Link, useActionData } from "@remix-run/react";
import { useState } from "react";
import { db } from "~/utils/db.server";
import { ActionReturnType, badRequest } from "./login";
import { createUserSession, register } from "~/utils/session.server";

export const action = async ({
  request,
}: {
  request: Request;
}): ActionReturnType => {
  const form = await request.formData();
  const username = form.get("username")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";
  const fields = { username, password };

  const userExists = await db.user.findFirst({
    where: {
      username,
    },
  });
  if (userExists)
    return badRequest({
      fields,
      fieldErrors: { username: "Username already exists." },
    });
  const user = await register({ username, password });
  if (!user) throw new Error("Something went wrong.");
  return createUserSession(user.id, "/");
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState({
    setPW: "",
    confirmPW: "",
  });

  const passwordError =
    password.confirmPW !== "" && password.confirmPW !== password.setPW;

  const disableSubmit =
    passwordError || password.setPW === "" || username === "";
  return (
    <div className="p-8">
      <h1 className="text-center text-4xl font-semibold">Create New Account</h1>
      <div className="flex flex-col items-center">
        <form method="POST" className="w-1/4">
          <div>
            <label htmlFor="username">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              name="username"
              id="username"
              className="w-full p-4 border-2 border-violet-300 rounded-md mb-2"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              value={password.setPW}
              onChange={(e) =>
                setPassword({ ...password, setPW: e.target.value })
              }
              type="password"
              name="password"
              id="password"
              className="w-full p-4 border-2 border-violet-300 rounded-md mb-2"
            />
          </div>
          <div>
            <label htmlFor="password">Confirm Password</label>
            <input
              value={password.confirmPW}
              onChange={(e) =>
                setPassword({ ...password, confirmPW: e.target.value })
              }
              type="password"
              name="confirmedPassword"
              id="confirmedPassword"
              className="w-full p-4 border-2 border-violet-300 rounded-md mb-2"
            />
          </div>
          <p className={`text-red-500 ${!passwordError && "invisible"}`}>
            Passwords do not match.
          </p>
          <div className={`text-red-500 text-center`}>
            {actionData?.fieldErrors?.username}
          </div>
          <button
            disabled={disableSubmit}
            type="submit"
            className={`text-xl p-4 font-medium rounded-md w-full ${
              disableSubmit ? "bg-gray-300" : "bg-sky-300 hover:bg-sky-500"
            }`}
          >
            Create Account
          </button>
        </form>
        <p className="mt-8">Already have an account?</p>
        <Link
          to="/login"
          className="mt-2 font-medium p-2 border-2 border-fuchsia-500 rounded-md hover:bg-fuchsia-200"
        >
          Login!
        </Link>
      </div>
    </div>
  );
}

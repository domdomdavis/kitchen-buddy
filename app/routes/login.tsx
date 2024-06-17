import { TypedResponse } from "@remix-run/node";
import { Link, json, useActionData } from "@remix-run/react";
import { login, createUserSession } from "~/utils/session.server";

export type ActionReturnType = Promise<
  | TypedResponse<{
      fieldErrors: { username: string };
      fields: { username: string; password: string };
    }>
  | undefined
>;

export function badRequest<T>(data: T): TypedResponse<T> {
  return json(data, { status: 400 });
}
export const action = async ({
  request,
}: {
  request: Request;
}): ActionReturnType => {
  const form = await request.formData();
  const username = form.get("username")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";

  const fields = { username, password };

  const user = await login({ username, password });
  if (!user) {
    return badRequest({
      fields,
      fieldErrors: { username: "Invalid credentials." },
    });
  }

  return createUserSession(user.id, "/");
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="p-8">
      <h1 className="text-center text-4xl font-semibold">Login</h1>
      <div className="flex flex-col items-center">
        <form method="POST" className="w-1/4">
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="w-full p-4 border-2 border-violet-300 rounded-md mb-2"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-4 border-2 border-violet-300 rounded-md mb-2"
            />
          </div>
          <div className={`text-red-500 text-center`}>
            {actionData?.fieldErrors?.username}
          </div>
          <button
            type="submit"
            className="text-xl p-4 bg-sky-300 font-medium rounded-md mt-2 hover:bg-sky-500 w-full"
          >
            Submit
          </button>
        </form>
        <p className="mt-8">Don't have an account?</p>
        <Link
          to="/register"
          className="mt-2 font-medium p-2 border-2 border-fuchsia-500 rounded-md hover:bg-fuchsia-200"
        >
          Create one!
        </Link>
      </div>
    </div>
  );
}

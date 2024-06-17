import { login, createUserSession } from "~/utils/session.server";

export const action = async ({ request }: { request: Request }) => {
  const form = await request.formData();
  const username = form.get("username")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";

  const user = await login({ username, password });
  if (!user) throw new Error();
  return createUserSession(user.id, "/");
};

export default function Login() {
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
          <button
            type="submit"
            className="text-xl p-4 bg-sky-300 font-medium rounded-md mt-2 hover:bg-sky-500 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

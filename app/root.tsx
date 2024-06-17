import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { getUser } from "./utils/session.server";
import { Navbar } from "./common-components/navbar";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
export const loader = async ({ request }: { request: Request }) => {
  const user = await getUser(request);
  return user ?? null;
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const user = useLoaderData<LoaderType>();

  return (
    <div>
      {user && <Navbar user={user} />}

      <Outlet />
    </div>
  );
}

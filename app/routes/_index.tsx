import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function Index() {
  return (
    <div className="p-8">
      <h1 className="text-center text-4xl font-medium">My Recipes</h1>
    </div>
  );
}

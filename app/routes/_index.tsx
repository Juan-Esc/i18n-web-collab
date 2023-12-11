import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Nav } from "~/components/Nav";
import { authenticator, requireAuthentication } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "i18n web collab" },
    { name: "description", content: "Make translations together" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return requireAuthentication(request)
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <Nav isAdmin={data?.user?.isAdmin} />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello, Hola, Bonjour 👋</h1>
            <p className="py-6">It's time to make some translations!</p>
            <Link to="/translate" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

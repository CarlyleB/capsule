import { Badge, Button } from "@mantine/core";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";

import { auth as serverAuth } from "../firebase.server";
import { getUserSession } from "~/sessions.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Curated" },
  ];
};

export default function Index() {
  const { profile } = useLoaderData<typeof loader>();

  if (profile) {
    return (
      <div>
        <Badge>{profile.email}</Badge>
        <Form action="/logout" method="post">
          <Button type="submit">
            Logout
          </Button>
        </Form>
      </div>
    );
  }

  return (
    <>
      <h1>Sorry, nothing to see here 👀</h1>
      <Link to="/login">Log In</Link>
    </>
  );
}


export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getUserSession(request);
  if (!token) {
    return redirect("/login");
  }
  const profile = await serverAuth.getUser(token.uid);
  return {
    profile,
  };
}

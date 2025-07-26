import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { destroyUserSession } from "~/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  return destroyUserSession(request);
}

export async function loader() {
  return redirect("/");
}

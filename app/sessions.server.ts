import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { auth as serverAuth } from "./firebase.server";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || ''],
    secure: process.env.NODE_ENV === "production",
  },
});

export const createUserSession = async (jwt: string, expiresIn: number) => {
  const session = await sessionStorage.getSession();
  session.set("token", jwt);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, { expires: new Date(Date.now() + expiresIn) }),
    },
  });
}

export const getUserSession = async (request: Request) => {
  const cookieSession = await sessionStorage.getSession(request.headers.get("Cookie"));
  const token = cookieSession.get("token");
  if (!token) return null;
  try {
    const jwt = await serverAuth.verifySessionCookie(token);
    return jwt;
  } catch (e) {
    return null;
  }
}

export async function destroyUserSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

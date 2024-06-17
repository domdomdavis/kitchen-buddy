import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { db } from "./db.server";
import bcrypt from "bcrypt";
type LoginProps = {
  username: string;
  password: string;
};
export async function login({ username, password }: LoginProps) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) return null;

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) return null;
  return user;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("No Session Secret");

const storage = createCookieSessionStorage({
  cookie: {
    name: "kitchenbuddy_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true,
  },
});

export async function register({ username, password }: LoginProps) {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: {
      username,
      passwordHash,
    },
  });
}
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/logout", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES, SESSION_COOKIE_NAME } from "@/lib/constants";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  redirect(token ? ROUTES.dashboard : ROUTES.login);
}

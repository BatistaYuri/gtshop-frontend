import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function SettingsRedirectPage() {
  redirect(ROUTES.stock);
}
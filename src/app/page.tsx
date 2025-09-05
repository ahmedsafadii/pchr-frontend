import { redirect } from "next/navigation";

export default async function Home() {
  // Always redirect to Arabic as the default locale
  // The middleware will handle locale detection and cookies
  redirect("/ar");
} 
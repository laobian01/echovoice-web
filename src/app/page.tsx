import { headers } from "next/headers";
import { redirect } from "next/navigation";

const zhCountries = new Set(["CN", "HK", "MO", "TW", "SG", "MY"]);

export default async function RootPage() {
  const h = await headers();
  const country = (h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || "").toUpperCase();
  const lang = (h.get("accept-language") || "").toLowerCase();

  if (zhCountries.has(country) || lang.startsWith("zh")) {
    redirect("/zh");
  }

  redirect("/en");
}

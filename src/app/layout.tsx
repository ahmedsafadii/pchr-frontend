import OriginLayout from "../_app/layout";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <OriginLayout>{children}</OriginLayout>;
} 
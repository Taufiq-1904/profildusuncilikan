// AuthProvider is in root layout, so no need to wrap again here.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

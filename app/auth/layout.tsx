export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#15397F] p-6 md:p-10">
      {children}
    </div>
  );
} 
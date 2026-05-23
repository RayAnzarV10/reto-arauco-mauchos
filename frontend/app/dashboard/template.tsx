export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-[pageIn_0.35s_ease-out]">
      {children}
    </div>
  );
}

export function DashboardCardRow({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid grid-cols-12 w-full gap-4 h-[275px] max-h-[275px] overflow-hidden'>
      {children}
    </div>
  );
}

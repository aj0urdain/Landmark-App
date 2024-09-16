import WelcomeCard from '@/components/molecules/DashboardCards/WelcomeCard/WelcomeCard';

function AdminPage() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 mx-auto max-w-6xl py-4'>
      <div className='flex gap-4 w-full max-h-60'>
        <div className='w-2/5 flex'>
          <WelcomeCard />
        </div>
        <div className='w-3/5 flex'>
          <WelcomeCard />
        </div>
      </div>
      <div className='flex gap-4 w-full'>
        <div className='w-1/4 flex'>
          <WelcomeCard />
        </div>
        <div className='w-1/4 flex'>
          <WelcomeCard />
        </div>
        <div className='w-1/4 flex'>
          <WelcomeCard />
        </div>
        <div className='w-1/4 flex'>
          <WelcomeCard />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

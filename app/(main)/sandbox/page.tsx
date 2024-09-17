import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
const SandboxPage = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 mx-4 2xl:mx-auto max-w-6xl py-4'>
      <Card>
        <CardHeader>
          <CardTitle>Sandbox</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SandboxPage;

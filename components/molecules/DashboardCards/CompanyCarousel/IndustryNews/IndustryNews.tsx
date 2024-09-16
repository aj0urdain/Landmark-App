import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { NewspaperIcon } from 'lucide-react';

export default function IndustryNews() {
  return (
    <Card className='relative w-full h-full flex flex-col items-center rounded-3xl justify-end p-6'>
      <div className='absolute top-0 left-0 w-full h-full z-10 rounded-3xl bg-gradient-to-t from-slate-800 to-transparent' />
      <Image
        src='https://static.ffx.io/images/%24zoom_0.216%2C%24multiply_1.0582%2C%24ratio_1.5%2C%24width_756%2C%24x_0%2C%24y_0/t_crop_custom/q_86%2Cf_auto/50b8846a9729666788e249b3ac8bbf2c7f594b8b'
        alt='news'
        width={800}
        height={533}
        className='object-cover absolute opacity-30 top-0 left-0 grayscale w-full h-full rounded-3xl'
      />

      <div className='absolute top-0 flex gap-2 items-center right-0 z-20 px-6 py-4 bg-slate-800/75 border-b border-l border-slate-500 rounded-tr-3xl rounded-bl-3xl p-2'>
        <NewspaperIcon className='w-4 h-4' />
        <p className='text-sm font-medium'>Herald Sun</p>
      </div>

      <div className='rounded-b-3xl flex flex-col gap-2 h-1/2 items-center justify-center w-full z-20'>
        <p className='text-xl font-extrabold'>
          AVC, Charter Hall snap up pubs as corporate dealmaking ramps up
        </p>
        <p className='text-sm text-muted-foreground'>
          Corporate investment in the pub sector is ramping up with the
          country’s second-biggest operator, Australian Venue Co, swooping in
          on..
        </p>
      </div>
    </Card>
  );
}

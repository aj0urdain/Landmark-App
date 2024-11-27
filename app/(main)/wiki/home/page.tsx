import { Dot } from '@/components/atoms/Dot/Dot';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronsDown } from 'lucide-react';

import Image from 'next/image';
import React from 'react';

const WikiHomePage = () => {
  return (
    <>
      <div className="flex min-h-[600px] w-full flex-col items-center justify-center gap-36">
        <div className="flex flex-col gap-4">
          <div className="ml-1.5 flex items-center gap-4">
            <div className="animate-slide-left-fade-in opacity-0 [animation-delay:_0.25s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
              <Dot
                size="small"
                className="h-1.5 w-1.5 animate-pulse bg-muted-foreground uppercase text-foreground [animation-delay:_0.25s] [animation-duration:_2s] [animation-fill-mode:_forwards]"
              />
            </div>

            <p className="animate-slide-down-fade-in uppercase tracking-[0.25em] text-muted-foreground opacity-0 [animation-delay:_0.25s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
              Welcome to
            </p>
          </div>

          <div className="flex items-center gap-4 text-7xl font-bold">
            <p className="animate-slide-up-fade-in bg-gradient-to-br from-slate-100 to-slate-400 bg-clip-text tracking-tighter text-transparent opacity-0 [animation-delay:_1s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
              Burgess
            </p>
            <p className="animate-slide-down-fade-in bg-gradient-to-br from-slate-100 to-slate-400 bg-clip-text tracking-tighter text-transparent opacity-0 [animation-delay:_1.25s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
              Rawson.
            </p>
          </div>
        </div>
        <div className="animate-slide-down-fade-in opacity-0 [animation-delay:_2.25s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
          <ChevronsDown className="h-10 w-10 animate-bounce" />
        </div>
      </div>

      <Card className="animate-slide-down-fade-in border-t-0 opacity-0 [animation-delay:_3.25s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
        <div className="flex flex-col gap-4">
          <Image
            src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/wiki_images/home/BR-Partners-Photo.jpg"
            alt="Burgess Rawson Partners"
            width={1500}
            height={1500}
            className="w-full rounded-t-xl object-cover object-center grayscale h-[30rem]"
          />
          <CardContent className="flex flex-col gap-6 pt-6">
            <h1 className="text-xl uppercase text-muted-foreground">Our people</h1>
            <div className="flex flex-col gap-8">
              <p className="border-l-2 border-l-foreground pl-4 text-3xl text-foreground">
                If you ask our clients, they'll tell you;{' '}
                <span className="font-black italic">
                  Burgess Rawson's people are the backbone of our success.
                </span>
              </p>
              <p className="text-justify text-lg text-muted-foreground">
                As the largest privately owned commercial agency, our clients understand
                that our people are our business. Our core values—collaborative,
                innovative, accountable, empowering, trustworthy, and client-focused—are
                not just words; they're the principles that ensure our clients receive the
                best service and results.
              </p>
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <Card className="p-6 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-foreground">Sales</h2>
            <p className="text-muted-foreground line-clamp-2">
              Expert guidance in commercial property sales across Australia. Our national
              team specializes in portfolio auctions, private treaties, and expressions of
              interest campaigns across all asset classes.
            </p>
          </div>
        </Card>

        <Card className="p-6 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-foreground">Leasing</h2>
            <p className="text-muted-foreground line-clamp-2">
              Comprehensive leasing solutions for property owners and tenants. We handle
              everything from market analysis to lease negotiations, ensuring optimal
              outcomes for all parties.
            </p>
          </div>
        </Card>

        <Card className="p-6 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-foreground">Asset Management</h2>
            <p className="text-muted-foreground line-clamp-2">
              Full-service property management delivering maximum returns. Our team
              handles tenant relations, maintenance, financial reporting, and strategic
              planning.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {[
          {
            title: 'Portfolio Auctions',
            description:
              'Held every six weeks in Sydney, Melbourne, and Brisbane. Three bidding options available—online, phone, and in-person, covering all asset classes from $300k.',
          },
          {
            title: 'Industry Insights',
            description:
              'In-depth analysis and market insights helping you navigate the commercial property landscape. Access reports on early education, convenience retail, healthcare, and more.',
          },
          {
            title: 'Asset Valuation',
            description:
              'Comprehensive valuation services in Western Australia and trusted connections nationwide. Get accurate and reliable asset valuations wherever your property is located.',
          },
          {
            title: 'Tailored Property Expertise',
            description:
              'Specialists across 17 key property categories, including fast food, early education, medical facilities, and industrial properties. Expert guidance for blue-chip tenant investments.',
          },
          {
            title: 'First Time Buyers',
            description:
              'Dedicated support for first-time commercial property investors. Our experts provide guidance on market entry, risk assessment, and investment strategies to help you make informed decisions.',
          },
          {
            title: 'Institutional Investment',
            description:
              'Specialized services for institutional investors seeking premium commercial assets. Our team provides comprehensive market analysis, portfolio optimization, and strategic investment opportunities across Australia.',
          },
        ].map((item, index) => (
          <Card
            key={index}
            className="p-6 opacity-80 hover:opacity-100 transition-opacity"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-foreground">{item.title}</h2>
              <p className="text-muted-foreground line-clamp-2">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default WikiHomePage;

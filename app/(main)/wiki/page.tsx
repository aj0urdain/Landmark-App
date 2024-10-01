import { Dot } from "@/components/atoms/Dot/Dot";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronsDown } from "lucide-react";

import Image from "next/image";
import React from "react";

const WikiPage = () => {
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
          <div className="flex flex-col gap-2">
            <Image
              src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/staff_images/BR-Partners-Photo-1.jpg?t=2024-10-01T04%3A13%3A33.044Z"
              alt="Burgess Rawson Partners"
              width={1500}
              height={1500}
              className="aspect-[2.5/1] rounded-3xl object-cover object-center grayscale"
            />
            <CardContent className="flex flex-col gap-6 pt-6">
              <h1 className="text-xl uppercase text-muted-foreground">
                Our people
              </h1>
              <div className="flex flex-col gap-8">
                <p className="border-l-2 border-l-foreground pl-4 text-3xl text-foreground">
                  If you ask our clients, they’ll tell you;{" "}
                  <span className="font-black italic">
                    Burgess Rawson’s people are the backbone of our success.
                  </span>
                </p>

                <p className="text-justify text-lg text-muted-foreground">
                  As the largest privately owned commercial agency, our clients
                  understand that our people are our business. Our core
                  values—collaborative, innovative, accountable, empowering,
                  trustworthy, and client-focused—are not just words; they’re
                  the principles that ensure our clients receive the best
                  service and results.
                </p>
                <p className="text-justify text-lg text-muted-foreground">
                  Honesty and integrity are at the core of our client
                  relationships. Our commitment to transparency and ethical
                  conduct has allowed us to foster long-standing partnerships.
                  Clients not only buy properties through us, but subsequently
                  trust us to manage and sell those properties, making us their
                  comprehensive solution to wealth creation.
                </p>
                <p className="text-justify text-lg text-muted-foreground">
                  With a truly national team of experts across every asset class
                  and presence in every state and territory, clients benefit
                  from our extensive knowledge and reach. Our tenure speaks
                  volumes about the dedication and expertise of our team, as it
                  surpasses that of most other agencies. In the eyes of our
                  clients, Burgess Rawson’s people are synonymous with trust,
                  reliability, and results, making us the go-to choice for all
                  their commercial real estate needs.
                </p>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </>
  );
};

export default WikiPage;

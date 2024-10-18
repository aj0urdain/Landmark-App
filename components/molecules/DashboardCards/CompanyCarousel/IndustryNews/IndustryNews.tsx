import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { NewspaperIcon } from "lucide-react";

export default function IndustryNews() {
  return (
    <Card className="relative flex h-full w-full flex-col items-center justify-end rounded-3xl p-6">
      <div className="absolute left-0 top-0 z-10 h-full w-full rounded-3xl bg-gradient-to-t from-slate-800 to-transparent" />
      <Image
        src="https://static.ffx.io/images/%24zoom_0.216%2C%24multiply_1.0582%2C%24ratio_1.5%2C%24width_756%2C%24x_0%2C%24y_0/t_crop_custom/q_86%2Cf_auto/50b8846a9729666788e249b3ac8bbf2c7f594b8b"
        alt="news"
        width={800}
        height={533}
        className="absolute left-0 top-0 h-full w-full rounded-3xl object-cover opacity-30 grayscale"
      />

      <div className="absolute right-0 top-0 z-20 flex items-center gap-2 rounded-bl-3xl rounded-tr-3xl border-b border-l border-slate-500 bg-slate-800/75 p-2 px-6 py-4">
        <NewspaperIcon className="h-4 w-4" />
        <p className="text-sm font-medium">Herald Sun</p>
      </div>

      <div className="z-20 flex h-1/2 w-full flex-col items-center justify-center gap-2 rounded-b-3xl">
        <p className="text-xl font-extrabold">
          AVC, Charter Hall snap up pubs as corporate dealmaking ramps up
        </p>
        <p className="text-sm text-muted-foreground">
          Corporate investment in the pub sector is ramping up with the
          country’s second-biggest operator, Australian Venue Co, swooping in
          on..
        </p>
      </div>
    </Card>
  );
}

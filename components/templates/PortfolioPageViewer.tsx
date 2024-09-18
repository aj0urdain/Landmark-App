"use client";

import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";

interface PortfolioPageViewerProps {
  zoom: number;
  overlayOpacity: number;
  content: string;
}

const PortfolioPageViewer: React.FC<PortfolioPageViewerProps> = ({
  zoom,
  overlayOpacity,
  content = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const contentBlocks = content
    .split("\n")
    .filter((block) => block.trim() !== "");

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // A4 aspect ratio is 1:√2 (approximately 1:1.4142)
  const a4AspectRatio = 1 / Math.sqrt(2);
  const containerAspectRatio = containerSize.width / containerSize.height;

  let paperWidth, paperHeight;
  if (containerAspectRatio > a4AspectRatio) {
    // Container is wider than A4
    paperHeight = containerSize.height;
    paperWidth = paperHeight * a4AspectRatio;
  } else {
    // Container is taller than A4
    paperWidth = containerSize.width;
    paperHeight = paperWidth / a4AspectRatio;
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-auto"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
      }}
    >
      <div
        className="absolute z-20 h-full w-full"
        style={{
          backgroundImage: `url('/images/portfolio-reference.png')`,
          opacity: overlayOpacity,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: `${paperWidth}px`,
          height: `${paperHeight}px`,
        }}
      />
      <div
        className="bg-white shadow-lg transition-transform duration-200 ease-in-out"
        style={{
          width: `${paperWidth}px`,
          height: `${paperHeight}px`,
        }}
      >
        {/* A4 paper content goes here */}
        <div className="relative flex h-full w-full flex-col gap-3 pb-[35px] pl-[30px] pr-[30px] pt-[50px]">
          {/* Location Tab */}
          <div className="absolute right-0 top-0 flex h-[37px] w-[173px] items-center justify-end rounded-bl-[15px] bg-[#1d384c] pr-[28px] pt-[6px] tracking-wider">
            <p className="font-metro text-[8px] uppercase text-white">
              Victoria
            </p>
          </div>
          {/* Photo A */}
          <div
            style={{
              backgroundImage: `url('https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/eden-academy-a.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="min-h-[300px] w-full rounded-tr-[45px]"
          />
          {/* Photo B & C */}
          <div className="flex min-h-[195px] w-full gap-3">
            <div
              style={{
                backgroundImage: `url('https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/eden-academy-b.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="h-full w-1/2 bg-blue-400"
            />
            <div
              style={{
                backgroundImage: `url('https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/eden-academy-c.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="h-full w-1/2 bg-blue-800"
            />
          </div>
          <div className="flex h-[50px] w-full items-center justify-between gap-3">
            {/* Headline */}
            <div className="mt-[8px] flex h-full w-full max-w-[350px] items-end justify-center">
              <p className="font-lexia text-[143%] font-medium leading-[23px] text-portfolio-headline">
                Stunning Childcare Investment New 20 Year Net Lease to 2044
              </p>
            </div>
            {/* Logo */}
            <div className="mt-[8px] flex h-full w-full max-w-[130px] items-center justify-center">
              <Image
                src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/eden-academy-logo.png"
                alt="logo"
                width={135}
                height={135}
                className="h-auto w-[130px]"
              />
            </div>
          </div>
          <div className="mt-[10px] flex h-[170px] w-full items-center gap-[10px] border-b-[1px] border-portfolio-border">
            <div className="mb-[10px] flex h-[160px] w-[180px] flex-col justify-between">
              {/* Address */}
              <div className="flex h-[50px] w-full flex-col items-start justify-center -space-y-0.5 border-b border-t border-portfolio-border pt-[3px]">
                <p className="font-lexia text-[11.6px] font-bold text-portfolio-address">
                  Pakenham (Melbourne) VIC
                </p>
                <p className="font-lexia text-[11.6px] font-bold text-portfolio-address">
                  56 Army Road
                </p>
              </div>
              {/* Finance Copy */}
              <div className="mt-[10px] flex h-[70px] w-full flex-col gap-[10px] font-lexia text-[11.8px] font-medium leading-[12.5px] text-portfolio-financeCopy">
                <p>Two 10 year options to 2064</p>
                <p>Fixed 3% annual rent increases</p>
                <p>
                  Brand new construction offering significant depreciation
                  benefits
                </p>
              </div>
              {/* Net Income */}
              <div className="flex h-[25px] w-full items-end">
                <p className="font-lexia text-[10.8px] font-extrabold text-portfolio-financeCopy">
                  Net Income: $460,375 pa* + GST
                </p>
              </div>
            </div>
            {/* Property Copy */}
            <div className="mb-[10px] h-[160px] w-[180px] overflow-y-hidden font-medium">
              <div className="flex flex-col gap-[8px]">
                {contentBlocks.map((block, index) => (
                  <div
                    key={index}
                    className="flex h-full w-full items-start justify-center"
                  >
                    <p className="w-full max-w-[13px] pl-[2px] font-lexia text-[9.5px] leading-[11px] text-portfolio-propertyCopy">
                      +
                    </p>
                    <p className="w-full font-lexia text-[10.65px] leading-[12px] text-portfolio-propertyCopy">
                      {block}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-[15px] flex h-[155px] w-[170px] flex-col justify-start gap-[10px] border-l-[1px] border-portfolio-border">
              {/* Contact */}

              <div className="flex w-full items-start justify-center">
                <div className="flex h-full w-full max-w-[38px] items-start justify-center">
                  <Image
                    src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/phone.png"
                    alt="phone"
                    width={20}
                    height={30}
                    className="h-auto w-[13px]"
                  />
                </div>
                <div className="w-full">
                  <p className="font-metro text-[9.25px] font-bold text-portfolio-contactHeader">
                    Contact
                  </p>
                  {/* Agents */}
                  <div className="w-full">
                    <p className="font-metro text-[9.25px] text-portfolio-agents">
                      Adam Thomas 0418 998 971
                    </p>
                    <p className="font-metro text-[9.25px] text-portfolio-agents">
                      Natalie Couper 0413 856 983
                    </p>
                    <p className="font-metro text-[9.25px] text-portfolio-agents">
                      Josh Scapolan 0484 229 829
                    </p>

                    {/* Add more agents here as needed */}
                  </div>
                </div>
              </div>

              {/* Sale Type */}
              <div className="flex w-full items-start justify-center">
                <div className="flex h-full w-full max-w-[38px] items-start justify-center">
                  <Image
                    src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/email.png"
                    alt="phone"
                    width={20}
                    height={30}
                    className="mr-[1px] mt-[2px] h-auto w-[22px]"
                  />
                </div>
                <div className="w-full">
                  <p className="whitespace-pre-line font-metro text-[9.25px] font-bold text-portfolio-contactHeader">
                    {"For Sale by\nExpressions of Interest"}
                  </p>
                  {/* Agents */}
                  <div className="flex w-full flex-col gap-[10px]">
                    <div className="flex flex-col items-start">
                      <p className="font-metro text-[9.25px] text-portfolio-agents">
                        Closing 3pm AEST
                      </p>
                      <p className="font-metro text-[9.25px] text-portfolio-agents">
                        Thursday 3 October 2024
                      </p>
                    </div>
                    <div>
                      <p className="font-metro text-[7.25px] font-bold text-portfolio-agents">
                        *Approx
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPageViewer;

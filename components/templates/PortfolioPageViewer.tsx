'use client';

import Image from 'next/image';
import React, { useRef, useEffect, useState } from 'react';

interface PortfolioPageViewerProps {
  zoom: number;
  overlayOpacity: number;
  content: string;
}

const PortfolioPageViewer: React.FC<PortfolioPageViewerProps> = ({
  zoom,
  overlayOpacity,
  content,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const contentBlocks = content
    .split('\n')
    .filter((block) => block.trim() !== '');

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
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
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
      className='relative w-full h-full overflow-auto  flex items-center justify-center'
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'center center',
      }}
    >
      <div
        className='absolute  w-full h-full z-20'
        style={{
          backgroundImage: `url('/images/portfolio-reference.png')`,
          opacity: overlayOpacity,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: `${paperWidth}px`,
          height: `${paperHeight}px`,
        }}
      />
      <div
        className='bg-white shadow-lg transition-transform duration-200 ease-in-out'
        style={{
          width: `${paperWidth}px`,
          height: `${paperHeight}px`,
        }}
      >
        {/* A4 paper content goes here */}
        <div className='relative pr-[30px] pl-[30px] pb-[35px] pt-[50px] w-full h-full flex flex-col gap-3'>
          {/* Location Tab */}
          <div className='absolute top-0 right-0 w-[173px] flex items-center justify-end tracking-wider pr-[28px] pt-[6px] h-[37px] rounded-bl-[15px] bg-[#1d384c]'>
            <p className='uppercase text-white text-[8px] font-metro'>
              Victoria
            </p>
          </div>
          {/* Photo A */}
          <div
            style={{
              backgroundImage: `url('https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/eden-academy-a.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className='w-full min-h-[300px] rounded-tr-[45px] '
          />
          {/* Photo B & C */}
          <div className='w-full min-h-[195px] flex gap-3'>
            <div
              style={{
                backgroundImage: `url('https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/eden-academy-b.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className='w-1/2 h-full bg-blue-400'
            />
            <div
              style={{
                backgroundImage: `url('https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/eden-academy-c.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className='w-1/2 h-full bg-blue-800'
            />
          </div>
          <div className='w-full h-[50px] flex items-center justify-between gap-3'>
            {/* Headline */}
            <div className='w-full max-w-[350px] h-full flex items-end justify-center mt-[8px]'>
              <p className='text-[143%] leading-[23px] font-medium text-portfolio-headline font-lexia'>
                Stunning Childcare Investment New 20 Year Net Lease to 2044
              </p>
            </div>
            {/* Logo */}
            <div className='max-w-[130px] w-full h-full flex items-center justify-center mt-[8px]'>
              <Image
                src='https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/eden-academy-logo.png'
                alt='logo'
                width={135}
                height={135}
                className='w-[130px] h-auto'
              />
            </div>
          </div>
          <div className='w-full h-[170px] mt-[10px] flex items-center gap-[10px] border-b-[1px] border-portfolio-border'>
            <div className='w-[180px] h-[160px] mb-[10px] flex flex-col justify-between'>
              {/* Address */}
              <div className='w-full h-[50px] border-b border-t pt-[3px] border-portfolio-border flex flex-col -space-y-0.5 items-start justify-center'>
                <p className='text-portfolio-address font-lexia font-bold text-[11.6px]'>
                  Pakenham (Melbourne) VIC
                </p>
                <p className='text-portfolio-address font-lexia font-bold text-[11.6px]'>
                  56 Army Road
                </p>
              </div>
              {/* Finance Copy */}
              <div className='w-full h-[70px] mt-[10px] flex flex-col gap-[10px] leading-[12.5px] text-portfolio-financeCopy font-lexia font-medium text-[11.8px]'>
                <p>Two 10 year options to 2064</p>
                <p>Fixed 3% annual rent increases</p>
                <p>
                  Brand new construction offering significant depreciation
                  benefits
                </p>
              </div>
              {/* Net Income */}
              <div className='w-full h-[25px] flex items-end'>
                <p className='text-portfolio-financeCopy font-lexia font-extrabold text-[10.8px]'>
                  Net Income: $460,375 pa* + GST
                </p>
              </div>
            </div>
            {/* Property Copy */}
            <div className='w-[180px] h-[160px] mb-[10px] font-medium overflow-y-hidden '>
              <div className='flex flex-col gap-[8px]'>
                {contentBlocks.map((block, index) => (
                  <div
                    key={index}
                    className='flex items-start w-full h-full justify-center'
                  >
                    <p className='w-full max-w-[13px] pl-[2px] text-portfolio-propertyCopy font-lexia text-[9.5px] leading-[11px]'>
                      +
                    </p>
                    <p className='text-[10.65px] w-full font-lexia text-portfolio-propertyCopy leading-[12px] '>
                      {block}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className='w-[170px] h-[155px] flex flex-col justify-start gap-[10px] border-l-[1px] border-portfolio-border mb-[15px]'>
              {/* Contact */}

              <div className='flex items-start justify-center w-full'>
                <div className='max-w-[38px] w-full h-full flex items-start justify-center'>
                  <Image
                    src='https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/phone.png'
                    alt='phone'
                    width={20}
                    height={30}
                    className='w-[13px] h-auto'
                  />
                </div>
                <div className='w-full'>
                  <p className='text-portfolio-contactHeader font-bold font-metro text-[9.25px]'>
                    Contact
                  </p>
                  {/* Agents */}
                  <div className='w-full'>
                    <p className='text-portfolio-agents font-metro text-[9.25px]'>
                      Adam Thomas 0418 998 971
                    </p>
                    <p className='text-portfolio-agents font-metro text-[9.25px]'>
                      Natalie Couper 0413 856 983
                    </p>
                    <p className='text-portfolio-agents font-metro text-[9.25px]'>
                      Josh Scapolan 0484 229 829
                    </p>

                    {/* Add more agents here as needed */}
                  </div>
                </div>
              </div>

              {/* Sale Type */}
              <div className='flex items-start justify-center w-full'>
                <div className='max-w-[38px] w-full h-full flex items-start justify-center'>
                  <Image
                    src='https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/email.png'
                    alt='phone'
                    width={20}
                    height={30}
                    className='w-[22px] h-auto mt-[2px] mr-[1px]'
                  />
                </div>
                <div className='w-full'>
                  <p className='text-portfolio-contactHeader font-bold font-metro text-[9.25px] whitespace-pre-line'>
                    {'For Sale by\nExpressions of Interest'}
                  </p>
                  {/* Agents */}
                  <div className='w-full flex flex-col gap-[10px]'>
                    <div className='flex flex-col items-start'>
                      <p className='text-portfolio-agents font-metro text-[9.25px]'>
                        Closing 3pm AEST
                      </p>
                      <p className='text-portfolio-agents font-metro text-[9.25px]'>
                        Thursday 3 October 2024
                      </p>
                    </div>
                    <div>
                      <p className='text-portfolio-agents font-metro font-bold text-[7.25px]'>
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

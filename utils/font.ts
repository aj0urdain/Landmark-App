import localFont from 'next/font/local';

export const metroSans = localFont({
  src: [
    {
      path: '../public/fonts/MetroSans/MetroSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/MetroSans/MetroSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/MetroSans/MetroSans-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/MetroSans/MetroSans-Book.woff2',
      weight: '450',
      style: 'normal',
    },
    {
      path: '../public/fonts/MetroSans/MetroSans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/MetroSans/MetroSans-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/MetroSans/MetroSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/MetroSans/MetroSans-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/MetroSans/MetroSans-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/MetroSans/MetroSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/MetroSans/MetroSans-SemiBoldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
  ],
  variable: '--font-metro-sans',
});

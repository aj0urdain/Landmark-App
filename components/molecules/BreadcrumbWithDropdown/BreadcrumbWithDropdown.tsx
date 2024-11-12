import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDownIcon } from 'lucide-react';
import { SlashIcon } from '@radix-ui/react-icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const sandboxOptions = [
  { title: 'Document Generator', href: '/sandbox/document-generator' },
  { title: 'Chart Generator', href: '/sandbox/chart-generator' },
  { title: 'Yield Calculator', href: '/sandbox/yield-calculator' },
  { title: 'Property Comparison', href: '/sandbox/property-comparison' },
  { title: 'Market Trends', href: '/sandbox/market-trends' },
];

const formatSegmentName = (segment: string): string => {
  // Check if the segment is a known sandbox option
  const sandboxOption = sandboxOptions.find((option) => option.href.endsWith(segment));
  if (sandboxOption) {
    return sandboxOption.title;
  }

  // Otherwise, capitalize each word
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function BreadcrumbWithDropdown() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const [isOpen, setIsOpen] = useState(false);
  const [ellipsisOpen, setEllipsisOpen] = useState(false);

  // Add this to determine when to collapse
  const shouldCollapse = pathSegments.length > 3;

  const lastTwoSegments = pathSegments.slice(-2);
  const middleSegments = pathSegments.slice(1, -2);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {shouldCollapse ? (
          <>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <DropdownMenu open={ellipsisOpen} onOpenChange={setEllipsisOpen}>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {middleSegments.map((segment) => {
                    const href = `/${pathSegments.slice(0, pathSegments.indexOf(segment) + 1).join('/')}`;
                    return (
                      <DropdownMenuItem key={segment} asChild>
                        <Link
                          href={href}
                          onClick={() => {
                            setEllipsisOpen(false);
                          }}
                        >
                          {formatSegmentName(segment)}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            {/* Last two segments */}
            {lastTwoSegments.map((segment, index) => {
              const href = `/${pathSegments.slice(0, pathSegments.length - 2 + index + 1).join('/')}`;
              const isLast = index === lastTwoSegments.length - 1;

              return (
                <React.Fragment key={segment}>
                  <BreadcrumbSeparator>
                    <SlashIcon />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {segment === 'sandbox' ? (
                      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          Sandbox
                          <ChevronDownIcon className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {sandboxOptions.map((option) => (
                            <DropdownMenuItem key={option.href} asChild>
                              <Link
                                href={option.href}
                                onClick={() => {
                                  setIsOpen(false);
                                }}
                              >
                                {option.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : isLast ? (
                      <BreadcrumbPage>{formatSegmentName(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href}>
                        {formatSegmentName(segment)}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </>
        ) : (
          // Original code for paths with 3 or fewer segments
          pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;

            return (
              <React.Fragment key={segment}>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {segment === 'sandbox' ? (
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                      <DropdownMenuTrigger className="flex items-center gap-1">
                        Sandbox
                        <ChevronDownIcon className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {sandboxOptions.map((option) => (
                          <DropdownMenuItem key={option.href} asChild>
                            <Link
                              href={option.href}
                              onClick={() => {
                                setIsOpen(false);
                              }}
                            >
                              {option.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : isLast ? (
                    <BreadcrumbPage>{formatSegmentName(segment)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>
                      {formatSegmentName(segment)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

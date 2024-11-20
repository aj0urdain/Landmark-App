import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Link2, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { userProfileOptions } from '@/types/userProfileTypes';
import { Separator } from '@/components/ui/separator';

interface LinkType {
  id: number;
  title: string;
  url: string;
  category_id: number;
  departments: number[];
  branches: number[];
  teams: number[];
}

// Link tile component
const LinkTile = ({ title, url }: { title: string; url: string }) => {
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://icon.horse/icon/${domain}`;
    } catch {
      return null;
    }
  };

  const [faviconError, setFaviconError] = useState(false);
  const faviconUrl = url.startsWith('http') ? getFaviconUrl(url) : null;

  return (
    <div className="flex items-center justify-start gap-1 w-fit group">
      {faviconUrl && !faviconError ? (
        <img
          src={faviconUrl}
          alt=""
          className="w-4 h-4"
          onError={() => {
            setFaviconError(true);
          }}
        />
      ) : (
        <span className="">🔗</span>
      )}
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer w-full"
      >
        <p className="text-xs animated-underline-1 w-full truncate text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </p>
      </Link>
    </div>
  );
};

const getCategoryOrder = (name: string): number => {
  const order = ['tools', 'sharepoint', 'advertising', 'news', 'social'];
  const index = order.indexOf(name);
  return index === -1 ? order.length : index;
};

const PersonalLinks = () => {
  const supabase = createBrowserClient();
  const { data: userProfile } = useQuery(userProfileOptions);

  // Fetch categories and links
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ['linkCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('link_categories')
        .select('id, name')
        .order('name');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  const {
    data: links = [],
    isLoading: linksLoading,
    isError: linksError,
  } = useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('links').select('*').order('title');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  // Filter links based on user's access
  const accessibleLinks = links.filter((link) => {
    if (!userProfile) return false;

    // If link has no restrictions, show it to everyone
    if (
      (!link.departments.length || link.departments.length === 0) &&
      (!link.branches?.length || link.branches.length === 0) &&
      (!link.teams?.length || link.teams.length === 0)
    ) {
      return true;
    }

    // Check if user has access through departments or branches
    const hasMatchingDepartment = link.departments?.some((deptId) =>
      userProfile.department_ids?.includes(deptId),
    );
    const hasMatchingBranch = link.branches?.some((branchId) =>
      userProfile.branch_ids?.includes(branchId),
    );
    const hasMatchingTeam = link.teams?.some((teamId) =>
      userProfile.team_ids?.includes(teamId),
    );

    return hasMatchingDepartment || hasMatchingBranch || hasMatchingTeam;
  });

  // Group all links by category (unfiltered)
  const allLinksByCategory = links.reduce(
    (acc, link) => {
      const category = categories.find((c) => c.id === link.category_id);
      if (category) {
        if (!acc[category.name]) {
          acc[category.name] = [];
        }
        acc[category.name].push(link);
      }
      return acc;
    },
    {} as Record<string, LinkType[]>,
  );

  return (
    <Card className="flex h-full w-full items-center flex-col overflow-hidden">
      {categoriesLoading || linksLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="all" className="h-full w-full">
          <TabsList className="rounded-none flex justify-between gap-1 px-6 text-xs bg-transparent border-b border-muted/50 w-full h-16">
            <div className="flex items-center gap-1 text-muted-foreground/80">
              <Link2 className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1">
              {categories.length > 0 && (
                <StaggeredAnimation index={0} baseDelay={0.1} incrementDelay={0.05}>
                  <TabsTrigger key="all" value="all" className="text-xs capitalize">
                    Me
                  </TabsTrigger>
                </StaggeredAnimation>
              )}
              {categories
                .sort((a, b) => getCategoryOrder(a.name) - getCategoryOrder(b.name))
                .map((category, index) => (
                  <StaggeredAnimation
                    key={category.id}
                    index={index + 1}
                    baseDelay={0.1}
                    incrementDelay={0.05}
                  >
                    <TabsTrigger
                      key={category.id}
                      value={category.name}
                      className="text-xs capitalize animate-slide-down-fade-in"
                    >
                      {category.name}
                    </TabsTrigger>
                  </StaggeredAnimation>
                ))}
            </div>
          </TabsList>

          <ScrollArea className="h-[calc(100%-4rem)]">
            <TabsContent value="all" className="m-0 p-6">
              {categories
                .sort((a, b) => getCategoryOrder(a.name) - getCategoryOrder(b.name))
                .map((category) => {
                  const categoryLinks = accessibleLinks.filter(
                    (link) => link.category_id === category.id,
                  );

                  if (categoryLinks.length === 0) return null;

                  return (
                    <div key={category.id} className="mb-8 flex flex-col gap-1 last:mb-0">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-xs font-bold text-muted-foreground/50 capitalize">
                          {category.name}
                        </h3>

                        <Separator className="bg-muted/50" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {categoryLinks.map((link, index) => (
                          <StaggeredAnimation
                            key={link.id}
                            index={index}
                            baseDelay={0.1}
                            incrementDelay={0.05}
                          >
                            <LinkTile title={link.title} url={link.url} />
                          </StaggeredAnimation>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </TabsContent>

            {categories
              .sort((a, b) => getCategoryOrder(a.name) - getCategoryOrder(b.name))
              .map((category) => (
                <TabsContent key={category.id} value={category.name} className="m-0 p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {(allLinksByCategory[category.name] || []).map((link, index) => (
                      <StaggeredAnimation
                        key={link.id}
                        index={index}
                        baseDelay={0.1}
                        incrementDelay={0.05}
                      >
                        <LinkTile title={link.title} url={link.url} />
                      </StaggeredAnimation>
                    ))}
                  </div>
                </TabsContent>
              ))}
          </ScrollArea>
        </Tabs>
      )}
    </Card>
  );
};

export default PersonalLinks;

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, UserIcon } from 'lucide-react';

const NewsPage = () => {
  const featuredArticle = {
    title: 'New Skyscraper Project Breaks Ground in Downtown',
    description:
      'Our company has begun construction on a revolutionary 80-story mixed-use building, setting new standards for sustainable urban development.',
    author: 'Jane Doe',
    date: '2023-06-15',
    department: 'Development',
  };

  const announcements = [
    {
      title: 'Q2 Earnings Call Scheduled',
      description: 'Join us for our Q2 earnings call on July 15th at 2 PM EST.',
      author: 'Investor Relations Team',
      date: '2023-06-10',
      department: 'Finance',
    },
    {
      title: 'Annual Company Picnic',
      description:
        'Save the date for our annual company picnic on August 5th at Central Park.',
      author: 'HR Department',
      date: '2023-06-08',
      department: 'Human Resources',
    },
  ];

  const companyNews = [
    {
      title: 'New VP of Operations Appointed',
      description:
        "We're pleased to announce the appointment of John Smith as our new VP of Operations.",
      author: 'CEO Office',
      date: '2023-06-05',
      department: 'Executive',
    },
    {
      title: 'Sustainability Initiative Launched',
      description:
        'Our company commits to achieving carbon neutrality in all properties by 2030.',
      author: 'Sustainability Team',
      date: '2023-06-01',
      department: 'Sustainability',
    },
  ];

  const externalNews = [
    {
      title: 'Commercial Real Estate Market Outlook 2023',
      description:
        'Experts predict a strong recovery in the commercial real estate sector post-pandemic.',
      author: 'Real Estate Times',
      date: '2023-05-28',
      department: 'Industry',
    },
    {
      title: 'New Zoning Laws to Affect Urban Development',
      description:
        'City council passes new zoning laws that will impact future commercial developments.',
      author: 'City Planning Board',
      date: '2023-05-25',
      department: 'Legal',
    },
  ];

  const departmentColors = {
    Development: 'bg-blue-500',
    Finance: 'bg-green-500',
    'Human Resources': 'bg-purple-500',
    Executive: 'bg-red-500',
    Sustainability: 'bg-teal-500',
    Industry: 'bg-orange-500',
    Legal: 'bg-indigo-500',
  };

  const ArticleCard = ({ article, featured = false }) => (
    <Card className={featured ? 'col-span-2' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className={featured ? 'text-2xl' : 'text-lg'}>
            {article.title}
          </CardTitle>
          {!featured && (
            <Badge className={`${departmentColors[article.department]} text-white`}>
              {article.department}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className={featured ? 'text-lg mb-4' : 'text-sm mb-2'}>
          {article.description}
        </p>
        {featured && (
          <Badge className={`${departmentColors[article.department]} text-white mb-4`}>
            {article.department}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <div className="flex items-center">
          <UserIcon className="w-4 h-4 mr-1" />
          <span className="mr-4">{article.author}</span>
          <CalendarIcon className="w-4 h-4 mr-1" />
          <span>{article.date}</span>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Commercial Real Estate News</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Article</h2>
        <ArticleCard article={featuredArticle} featured={true} />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((announcement, index) => (
            <ArticleCard key={index} article={announcement} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Company News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companyNews.map((news, index) => (
            <ArticleCard key={index} article={news} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Industry News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {externalNews.map((news, index) => (
            <ArticleCard key={index} article={news} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;

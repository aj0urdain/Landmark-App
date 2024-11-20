'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Eye,
  EyeOff,
  InboxIcon,
  Lock,
  Unlock,
  User,
  Users,
  Building,
  Archive,
  X,
  RotateCcw,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dot } from '@/components/atoms/Dot/Dot';
import ReactTimeAgo from 'react-time-ago';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  sheetMode?: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'optional' | 'low' | 'medium' | 'high';
  status: 'to do' | 'in progress' | 'done' | 'cancelled' | 'ignored';
  assignee_ids: string[];
  department_ids: string[];
  creator_ids: string[];
  branch_ids: string[];
}

interface Notification {
  id: string;
  task_id: string;
  read: boolean;
  created_at: string;
}

// Dummy data
const dummyNotifications: Notification[] = [
  {
    id: '1',
    task_id: 'task-1',
    read: false,
    created_at: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
  },
  {
    id: '2',
    task_id: 'task-2',
    read: false,
    created_at: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
  },
  {
    id: '3',
    task_id: 'task-3',
    read: true,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: '4',
    task_id: 'task-4',
    read: false,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: '5',
    task_id: 'task-5',
    read: true,
    created_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
  },
  {
    id: '6',
    task_id: 'task-6',
    read: false,
    created_at: new Date(Date.now() - 2592000000).toISOString(), // 1 month ago
  },
  {
    id: '7',
    task_id: 'task-7',
    read: false,
    created_at: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
  },
  {
    id: '8',
    task_id: 'task-8',
    read: true,
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: '9',
    task_id: 'task-9',
    read: false,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: '10',
    task_id: 'task-10',
    read: true,
    created_at: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
  },
  {
    id: '11',
    task_id: 'task-11',
    read: false,
    created_at: new Date(Date.now() - 45000).toISOString(), // 45 seconds ago
  },
  {
    id: '12',
    task_id: 'task-12',
    read: true,
    created_at: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
  },
  {
    id: '13',
    task_id: 'task-13',
    read: false,
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
  {
    id: '14',
    task_id: 'task-14',
    read: true,
    created_at: new Date(Date.now() - 1814400000).toISOString(), // 3 weeks ago
  },
  {
    id: '15',
    task_id: 'task-15',
    read: false,
    created_at: new Date(Date.now() - 3888000000).toISOString(), // 1.5 months ago
  },
  {
    id: '16',
    task_id: 'task-16',
    read: false,
    created_at: new Date(Date.now() - 15000).toISOString(), // 15 seconds ago
  },
  {
    id: '17',
    task_id: 'task-17',
    read: true,
    created_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
  },
  {
    id: '18',
    task_id: 'task-18',
    read: false,
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
  },
  {
    id: '19',
    task_id: 'task-19',
    read: true,
    created_at: new Date(Date.now() - 2419200000).toISOString(), // 4 weeks ago
  },
  {
    id: '20',
    task_id: 'task-20',
    read: false,
    created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
  {
    id: '21',
    task_id: 'task-21',
    read: true,
    created_at: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
  },
  {
    id: '22',
    task_id: 'task-22',
    read: false,
    created_at: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
  },
  {
    id: '23',
    task_id: 'task-23',
    read: true,
    created_at: new Date(Date.now() - 5184000000).toISOString(), // 2 months ago
  },
  {
    id: '24',
    task_id: 'task-24',
    read: false,
    created_at: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
  },
  {
    id: '25',
    task_id: 'task-25',
    read: true,
    created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
  },
];

const dummyTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Update portfolio page',
    description: 'Revise and update the main portfolio page',
    due_date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    priority: 'high',
    status: 'to do',
    assignee_ids: ['user-1'],
    department_ids: ['dept-1'],
    creator_ids: ['user-2'],
    branch_ids: ['branch-1'],
  },
  {
    id: 'task-2',
    title: 'Review Q2 financial reports',
    description: 'Analyze and summarize Q2 financial performance',
    due_date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    priority: 'medium',
    status: 'in progress',
    assignee_ids: ['user-2'],
    department_ids: ['dept-2'],
    creator_ids: ['user-3'],
    branch_ids: ['branch-1', 'branch-2'],
  },
  {
    id: 'task-3',
    title: 'Prepare client presentation',
    description: 'Create slides for upcoming client meeting',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    priority: 'high',
    status: 'to do',
    assignee_ids: ['user-1', 'user-3'],
    department_ids: ['dept-1', 'dept-3'],
    creator_ids: ['user-4'],
    branch_ids: ['branch-2'],
  },
  {
    id: 'task-4',
    title: 'Update company handbook',
    description: 'Revise policies and procedures in the company handbook',
    due_date: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
    priority: 'low',
    status: 'to do',
    assignee_ids: [],
    department_ids: ['dept-1', 'dept-2', 'dept-3'],
    creator_ids: ['user-5'],
    branch_ids: ['branch-1', 'branch-2', 'branch-3'],
  },
  {
    id: 'task-5',
    title: 'Organize team building event',
    description: 'Plan and schedule Q3 team building activity',
    due_date: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days from now
    priority: 'medium',
    status: 'to do',
    assignee_ids: ['user-4'],
    department_ids: ['dept-1'],
    creator_ids: ['user-1'],
    branch_ids: ['branch-1'],
  },
  {
    id: 'task-6',
    title: 'Implement new security measures',
    description: 'Roll out updated security protocols across all systems',
    due_date: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
    priority: 'high',
    status: 'in progress',
    assignee_ids: ['user-5'],
    department_ids: ['dept-2'],
    creator_ids: ['user-2'],
    branch_ids: ['branch-1', 'branch-2', 'branch-3'],
  },
  {
    id: 'task-7',
    title: 'Conduct user feedback survey',
    description: 'Design and distribute customer satisfaction survey',
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    priority: 'medium',
    status: 'to do',
    assignee_ids: ['user-3'],
    department_ids: ['dept-3'],
    creator_ids: ['user-4'],
    branch_ids: ['branch-2'],
  },
  {
    id: 'task-8',
    title: 'Optimize database queries',
    description: 'Improve performance of key database operations',
    due_date: new Date(Date.now() + 86400000 * 8).toISOString(), // 8 days from now
    priority: 'high',
    status: 'in progress',
    assignee_ids: ['user-2', 'user-5'],
    department_ids: ['dept-2'],
    creator_ids: ['user-1'],
    branch_ids: ['branch-1'],
  },
  {
    id: 'task-9',
    title: 'Plan marketing campaign',
    description: 'Develop strategy for upcoming product launch campaign',
    due_date: new Date(Date.now() + 86400000 * 20).toISOString(), // 20 days from now
    priority: 'high',
    status: 'to do',
    assignee_ids: ['user-4'],
    department_ids: ['dept-3'],
    creator_ids: ['user-3'],
    branch_ids: ['branch-2', 'branch-3'],
  },
  {
    id: 'task-10',
    title: 'Conduct code review',
    description: 'Review and provide feedback on recent code changes',
    due_date: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
    priority: 'medium',
    status: 'to do',
    assignee_ids: ['user-1', 'user-2'],
    department_ids: ['dept-2'],
    creator_ids: ['user-5'],
    branch_ids: ['branch-1'],
  },
  {
    id: 'task-11',
    title: 'Update project documentation',
    description: 'Revise and expand documentation for main project',
    due_date: new Date(Date.now() + 86400000 * 6).toISOString(), // 6 days from now
    priority: 'low',
    status: 'to do',
    assignee_ids: ['user-3'],
    department_ids: ['dept-1', 'dept-2'],
    creator_ids: ['user-4'],
    branch_ids: ['branch-1', 'branch-2'],
  },
  {
    id: 'task-12',
    title: 'Prepare monthly report',
    description: 'Compile and analyze data for monthly executive report',
    due_date: new Date(Date.now() + 86400000 * 4).toISOString(), // 4 days from now
    priority: 'high',
    status: 'in progress',
    assignee_ids: ['user-5'],
    department_ids: ['dept-1', 'dept-3'],
    creator_ids: ['user-2'],
    branch_ids: ['branch-3'],
  },
  {
    id: 'task-13',
    title: 'Resolve customer support tickets',
    description: 'Address backlog of customer support issues',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    priority: 'high',
    status: 'to do',
    assignee_ids: ['user-1', 'user-4'],
    department_ids: ['dept-3'],
    creator_ids: ['user-3'],
    branch_ids: ['branch-2'],
  },
  {
    id: 'task-14',
    title: 'Update software licenses',
    description: 'Renew and update licenses for company software',
    due_date: new Date(Date.now() + 86400000 * 15).toISOString(), // 15 days from now
    priority: 'medium',
    status: 'to do',
    assignee_ids: ['user-2'],
    department_ids: ['dept-2'],
    creator_ids: ['user-5'],
    branch_ids: ['branch-1', 'branch-3'],
  },
  {
    id: 'task-15',
    title: 'Conduct team performance reviews',
    description: 'Schedule and conduct quarterly performance reviews',
    due_date: new Date(Date.now() + 86400000 * 25).toISOString(), // 25 days from now
    priority: 'medium',
    status: 'to do',
    assignee_ids: [],
    department_ids: ['dept-1', 'dept-2', 'dept-3'],
    creator_ids: ['user-1'],
    branch_ids: ['branch-1', 'branch-2', 'branch-3'],
  },
  {
    id: 'task-16',
    title: 'Prepare quarterly budget report',
    description: 'Compile and analyze Q3 budget data',
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    priority: 'high',
    status: 'to do',
    assignee_ids: ['user-1'],
    department_ids: ['dept-2'],
    creator_ids: ['user-3'],
    branch_ids: ['branch-1'],
  },
  {
    id: 'task-17',
    title: 'Update employee onboarding process',
    description: 'Revise and streamline new hire orientation procedures',
    due_date: new Date(Date.now() + 86400000 * 12).toISOString(), // 12 days from now
    priority: 'medium',
    status: 'in progress',
    assignee_ids: ['user-4'],
    department_ids: ['dept-1'],
    creator_ids: ['user-2'],
    branch_ids: ['branch-2'],
  },
  {
    id: 'task-18',
    title: 'Conduct security audit',
    description: 'Perform comprehensive review of IT security measures',
    due_date: new Date(Date.now() + 86400000 * 18).toISOString(), // 18 days from now
    priority: 'high',
    status: 'to do',
    assignee_ids: ['user-5'],
    department_ids: ['dept-2', 'dept-3'],
    creator_ids: ['user-1'],
    branch_ids: ['branch-1', 'branch-3'],
  },
  {
    id: 'task-19',
    title: 'Develop new product feature',
    description: 'Design and implement requested customer feature',
    due_date: new Date(Date.now() + 86400000 * 22).toISOString(), // 22 days from now
    priority: 'medium',
    status: 'in progress',
    assignee_ids: ['user-2', 'user-3'],
    department_ids: ['dept-3'],
    creator_ids: ['user-4'],
    branch_ids: ['branch-2'],
  },
  {
    id: 'task-20',
    title: 'Organize company-wide meeting',
    description: 'Plan and schedule annual all-hands meeting',
    due_date: new Date(Date.now() + 86400000 * 35).toISOString(), // 35 days from now
    priority: 'low',
    status: 'to do',
    assignee_ids: ['user-1'],
    department_ids: ['dept-1', 'dept-2', 'dept-3'],
    creator_ids: ['user-5'],
    branch_ids: ['branch-1', 'branch-2', 'branch-3'],
  },
  {
    id: 'task-21',
    title: 'Review and update company policies',
    description: 'Assess and revise corporate policies and procedures',
    due_date: new Date(Date.now() + 86400000 * 28).toISOString(), // 28 days from now
    priority: 'medium',
    status: 'to do',
    assignee_ids: ['user-3', 'user-4'],
    department_ids: ['dept-1', 'dept-2'],
    creator_ids: ['user-2'],
    branch_ids: ['branch-1', 'branch-3'],
  },
  {
    id: 'task-22',
    title: 'Implement new CRM system',
    description: 'Oversee installation and staff training for new CRM software',
    due_date: new Date(Date.now() + 86400000 * 45).toISOString(), // 45 days from now
    priority: 'high',
    status: 'to do',
    assignee_ids: ['user-2', 'user-5'],
    department_ids: ['dept-2', 'dept-3'],
    creator_ids: ['user-1'],
    branch_ids: ['branch-2'],
  },
  {
    id: 'task-23',
    title: 'Conduct employee satisfaction survey',
    description: 'Prepare and distribute annual employee feedback questionnaire',
    due_date: new Date(Date.now() + 86400000 * 15).toISOString(), // 15 days from now
    priority: 'medium',
    status: 'in progress',
    assignee_ids: ['user-4'],
    department_ids: ['dept-1'],
    creator_ids: ['user-3'],
    branch_ids: ['branch-1', 'branch-2', 'branch-3'],
  },
  {
    id: 'task-24',
    title: 'Prepare for industry conference',
    description: 'Coordinate logistics and materials for upcoming trade show',
    due_date: new Date(Date.now() + 86400000 * 40).toISOString(), // 40 days from now
    priority: 'high',
    status: 'to do',
    assignee_ids: ['user-1', 'user-3'],
    department_ids: ['dept-3'],
    creator_ids: ['user-5'],
    branch_ids: ['branch-2'],
  },
  {
    id: 'task-25',
    title: 'Update company website',
    description: 'Refresh content and design of corporate website',
    due_date: new Date(Date.now() + 86400000 * 25).toISOString(), // 25 days from now
    priority: 'medium',
    status: 'in progress',
    assignee_ids: ['user-2'],
    department_ids: ['dept-2'],
    creator_ids: ['user-4'],
    branch_ids: ['branch-1', 'branch-3'],
  },
];

export function Inbox({
  isCollapsed,
  toggleSidebar,
  sheetMode,
}: NotificationSidebarProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [showContent, setShowContent] = useState(!isCollapsed);
  const [visibleSections, setVisibleSections] = useState({
    me: true,
    groups: true,
    company: true,
  });
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [lockMessage, setLockMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isCollapsed) {
      timer = setTimeout(() => setShowContent(true), 300);
    } else {
      setShowContent(false);
    }
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  const handleMouseEnter = () => {
    if (!isLocked && isCollapsed) {
      toggleSidebar();
    }
  };

  const handleMouseLeave = () => {
    if (!isLocked && !isCollapsed) {
      toggleSidebar();
    }
  };

  const toggleLock = () => {
    if (lockMessage) return; // Simple debounce: don't do anything if a message is already showing

    setIsLocked((prev) => !prev);
    setLockMessage(isLocked ? 'Inbox Undocked!' : 'Inbox Docked!');
    setTimeout(() => {
      setLockMessage(null);
    }, 2000);
  };

  const toggleSectionVisibility = (section: keyof typeof visibleSections) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleNotificationRead = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: !notif.read } : notif,
      ),
    );
  };

  const groupNotifications = (notifications: Notification[], tasks: Task[]) => {
    const currentUserId = 'user-1'; // Assume current user is user-1
    const currentUserDeptId = 'dept-1'; // Assume current user is in dept-1
    const currentUserBranchId = 'branch-1'; // Assume current user is in branch-1

    return {
      me: notifications.filter((n) => {
        const task = tasks.find((t) => t.id === n.task_id);
        return task && task.assignee_ids.includes(currentUserId);
      }),
      groups: notifications.filter((n) => {
        const task = tasks.find((t) => t.id === n.task_id);
        return (
          task &&
          !task.assignee_ids.includes(currentUserId) &&
          (task.department_ids.includes(currentUserDeptId) ||
            task.branch_ids.includes(currentUserBranchId))
        );
      }),
      company: notifications.filter((n) => {
        const task = tasks.find((t) => t.id === n.task_id);
        return (
          task &&
          !task.assignee_ids.includes(currentUserId) &&
          !task.department_ids.includes(currentUserDeptId) &&
          !task.branch_ids.includes(currentUserBranchId)
        );
      }),
    };
  };

  const sortNotifications = (notifications: Notification[]) => {
    return notifications.sort((a, b) => {
      const taskA = dummyTasks.find((t) => t.id === a.task_id);
      const taskB = dummyTasks.find((t) => t.id === b.task_id);
      const priorityOrder = { high: 0, medium: 1, low: 2, optional: 3 };
      if (
        taskA &&
        taskB &&
        priorityOrder[taskA.priority] !== priorityOrder[taskB.priority]
      ) {
        return priorityOrder[taskA.priority] - priorityOrder[taskB.priority];
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  const renderCollapsedNotifications = (showArchive: boolean) => {
    const filteredNotifications = showArchive
      ? notifications.filter((n) => n.read)
      : notifications.filter((n) => !n.read);

    const groupedNotifications = groupNotifications(filteredNotifications, dummyTasks);

    return (
      <div className="space-y-4">
        {(['me', 'groups', 'company'] as const).map((section) => {
          const count = groupedNotifications[section].length;
          if (count === 0) return null;
          return (
            <div
              key={section}
              className="flex w-fit flex-col items-center justify-center gap-1 rounded-full border border-muted bg-muted/25 p-2"
            >
              {section === 'me' && <User className="h-4 w-4" />}
              {section === 'groups' && <Users className="h-4 w-4" />}
              {section === 'company' && <Building className="h-4 w-4" />}
              <span className="mt-1 text-xs">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderNotifications = (showArchive: boolean) => {
    const filteredNotifications = showArchive
      ? notifications.filter((n) => n.read)
      : notifications.filter((n) => !n.read);

    const groupedNotifications = groupNotifications(filteredNotifications, dummyTasks);
    Object.keys(groupedNotifications).forEach((key) => {
      groupedNotifications[key as keyof typeof groupedNotifications] = sortNotifications(
        groupedNotifications[key as keyof typeof groupedNotifications],
      );
    });

    return (
      <>
        {(['me', 'groups', 'company'] as const).map((section) => {
          if (groupedNotifications[section].length === 0) return null;
          return (
            <div key={section}>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1 text-xs font-semibold capitalize text-muted-foreground">
                  {section === 'me' && <User className="h-3 w-3" />}
                  {section === 'groups' && <Users className="h-3 w-3" />}
                  {section === 'company' && <Building className="h-3 w-3" />}
                  {section}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    toggleSectionVisibility(section);
                  }}
                >
                  {visibleSections[section] ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {visibleSections[section] &&
                groupedNotifications[section].map((notification) => {
                  const task = dummyTasks.find((t) => t.id === notification.task_id);
                  if (!task) return null;
                  return (
                    <Card
                      key={notification.id}
                      className="relative mb-2 animate-slide-down-fade-in p-4"
                    >
                      <div className="flex items-start gap-2">
                        <Dot
                          size="small"
                          className={`mt-1.5 ${
                            task.priority === 'high'
                              ? 'animate-pulse bg-red-500'
                              : task.priority === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                        />
                        <div className="flex-1">
                          <h1
                            className={`line-clamp-2 text-xs font-semibold ${showArchive ? 'text-muted-foreground line-through' : ''}`}
                          >
                            {task.title}
                          </h1>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {/* <ReactTimeAgo date={new Date(notification.created_at)} /> */}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="group absolute right-1 top-1 h-6 w-6 rounded-full"
                          onClick={() => {
                            toggleNotificationRead(notification.id);
                          }}
                        >
                          {notification.read ? (
                            <RotateCcw className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground group-hover:text-destructive" />
                          )}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div
      className={`flex h-full max-h-screen w-full flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'max-w-16' : 'max-w-64'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex h-full flex-col ${sheetMode ? 'p-4 px-6' : 'space-y-6 border-l p-4'}`}
      >
        <div className="flex-shrink-0">
          {isCollapsed ? (
            <div className="flex justify-center">
              <InboxIcon className="mb-5 mt-1 h-5 w-6 text-muted-foreground" />
            </div>
          ) : (
            <Button
              variant="outline"
              className={`${
                isLocked ? 'border-foreground text-foreground' : 'text-muted-foreground'
              } ${sheetMode ? 'hidden' : 'w-full'} group justify-between text-xs`}
              onClick={toggleLock}
            >
              {lockMessage ? (
                <span className="animate-slide-left-fade-in">{lockMessage}</span>
              ) : (
                <>
                  <p className="block group-hover:hidden">
                    Inbox {isLocked ? 'Docked' : 'Undocked'}
                  </p>
                  <p className="hidden group-hover:block">
                    {isLocked ? 'Undock' : 'Dock'} Inbox?
                  </p>
                </>
              )}
              {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            </Button>
          )}
        </div>
        {isCollapsed ? (
          <div className="flex flex-grow justify-center">
            {renderCollapsedNotifications(false)}
          </div>
        ) : (
          <div className="flex flex-grow flex-col overflow-hidden">
            <Tabs
              defaultValue="inbox"
              className="flex h-full flex-col items-center justify-center"
            >
              <TabsList className="mb-2 grid w-full flex-shrink-0 grid-cols-2 bg-transparent">
                <TabsTrigger
                  value="inbox"
                  className="group py-2 data-[state=active]:border-b data-[state=active]:border-foreground data-[state=active]:font-bold data-[state=active]:text-foreground"
                >
                  <InboxIcon className="mr-1.5 h-3 w-3 group-data-[state=active]:animate-bounce" />
                  <p className="text-xs">Inbox</p>
                </TabsTrigger>
                <TabsTrigger
                  value="archive"
                  className="group py-2 data-[state=active]:border-b data-[state=active]:border-foreground data-[state=active]:font-bold data-[state=active]:text-foreground"
                >
                  <Archive className="mr-1.5 h-3 w-3 group-data-[state=active]:animate-bounce" />
                  <p className="text-xs">Archive</p>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="inbox" className="flex-grow overflow-hidden">
                <ScrollArea className="h-full">
                  {showContent && renderNotifications(false)}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="archive" className="flex-grow overflow-hidden">
                <ScrollArea className="h-full">
                  {showContent && renderNotifications(true)}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

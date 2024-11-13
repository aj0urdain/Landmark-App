import { Article } from '@/types/articleTypes';
import React, { useState, useEffect } from 'react';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import { Button } from '@/components/ui/button';
import { Ban, Component, PencilIcon, PlusIcon, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { departmentInfo, getDepartmentInfo } from '@/utils/getDepartmentInfo';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@/utils/supabase/client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ArticleDepartments = ({
  article,
  editing,
}: {
  article: Article;
  editing: boolean;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const { data: allDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('department_name');

      if (error) throw error;

      // join departmentnames and id from supabase with departmentInfo metadata
      const enrichedDepartments = data.map((dept) => ({
        ...dept,
        ...(departmentInfo.find((info) => info.name === dept.department_name) ?? {
          color: 'gray',
          backgroundColor: 'bg-gray-100',
        }),
      }));

      console.log(`enrichedDepartments`);
      console.log(enrichedDepartments);

      console.log(`data`);
      console.log(data);

      return enrichedDepartments;
      // return data;
    },
  });

  useEffect(() => {
    if (isDialogOpen) {
      setSelectedDepartments(article.departments.map((dept) => dept));
    }
  }, [isDialogOpen, article.departments]);

  const handleDepartmentRemove = async (departmentId: number) => {
    console.log(`attempting to remove ${departmentId}`);

    if (article.departments.length === 1) {
      const burgessRawsonDept = allDepartments?.find(
        (dept) => dept.department_name.toLowerCase() === 'burgess rawson',
      );

      if (!burgessRawsonDept) {
        throw new Error('Burgess Rawson department not found');
      }

      const { error } = await supabase
        .from('articles')
        .update({ departments: [burgessRawsonDept.id] })
        .eq('id', article.id)
        .select();

      if (error) {
        throw error;
      }
      return;
    }

    const updatedDepartments = article.departments
      .filter((dept) => dept !== departmentId)
      .map((dept) => dept);

    const { error } = await supabase
      .from('articles')
      .update({ departments: updatedDepartments })
      .eq('id', article.id)
      .select();

    if (error) {
      throw error;
    }
  };

  const handleDepartmentAdd = async () => {
    const { error } = await supabase
      .from('articles')
      .update({ departments: selectedDepartments })
      .eq('id', article.id)
      .select();

    if (error) {
      throw error;
    }
  };

  const removeDepartmentMutation = useMutation({
    mutationFn: handleDepartmentRemove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['article', article.id.toString()],
      });
    },
  });

  const addDepartmentsMutation = useMutation({
    mutationFn: handleDepartmentAdd,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['article', article.id.toString()],
      });
      setIsDialogOpen(false);
    },
  });

  const toggleDepartment = (departmentId: number) => {
    setSelectedDepartments((prev) => {
      if (prev.includes(departmentId)) {
        return prev.filter((id) => id !== departmentId);
      }
      if (prev.length >= 7) return prev; // Maximum 7 departments
      return [...prev, departmentId];
    });
  };

  if (!allDepartments) return null;

  if (!article.departments) return null;

  return editing ? (
    <>
      <div className="flex flex-col gap-4 group items-start justify-center">
        <Label className="flex flex-row gap-2 items-center text-xl uppercase font-bold text-muted group-hover:text-warning-foreground group-hover:translate-x-2 group-hover:animate-pulse transition-all duration-300">
          <Component />
          Departments
          <PencilIcon className="hidden group-hover:block group-hover:animate-slide-right-fade-in w-4 h-4" />
        </Label>
        <div className="flex flex-row gap-4 items-center" key={article.id}>
          <Button
            variant="secondary"
            className="flex flex-row gap-2"
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Add Department
          </Button>
          <Separator orientation="vertical" className="h-4" />
          {article.departments.length > 0 &&
            article.departments.map((department) => {
              const fullDepartment = allDepartments.find((dept) => dept.id == department);

              const departmentInformation = getDepartmentInfo(
                fullDepartment?.department_name,
              );

              if (!departmentInformation) {
                return null;
              }

              const { icon: Icon, color } = departmentInformation;

              return (
                <TooltipProvider key={fullDepartment?.id}>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        key={fullDepartment?.id}
                        variant="outline"
                        className={`flex flex-row gap-2 group/department transition-all duration-300 hover:bg-destructive hover:text-primary
                        ${article.departments.length <= 1 ? 'cursor-not-allowed hover:border-destructive hover:bg-muted hover:text-muted-foreground' : ''}
                        `}
                        onClick={() => {
                          if (article.departments.length <= 1) return;

                          removeDepartmentMutation.mutate(department);
                        }}
                      >
                        <Ban className="w-4 h-4 hidden group-hover/department:block group-hover/department:animate-slide-down-fade-in" />
                        <Icon
                          className={cn(
                            'w-4 h-4 block group-hover/department:hidden animate-slide-up-fade-in',
                            color,
                          )}
                        />
                        <span
                          className={cn(
                            `${color} group-hover/department:text-primary text-sm`,
                          )}
                        >
                          {fullDepartment?.department_name}
                        </span>
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent
                      hidden={article.departments.length > 1}
                      side="right"
                      className="text-primary bg-destructive"
                    >
                      <p>Every article must have at least one department!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Departments</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              {allDepartments?.map((dept) => {
                const isSelected = selectedDepartments.includes(dept.id);
                const departmentInfo = getDepartmentInfo(dept.department_name);
                if (!departmentInfo) return null;
                const { icon: Icon, color } = departmentInfo;

                return (
                  <Button
                    key={dept.id}
                    variant="outline"
                    className={cn(
                      'flex h-10 w-full items-center justify-start gap-2 px-3',
                      isSelected && `border ${color}`,
                      'transition-all duration-300',
                    )}
                    onClick={() => toggleDepartment(dept.id)}
                  >
                    {isSelected ? (
                      <Check className={`h-4 w-4 shrink-0 ${color}`} />
                    ) : (
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground/75" />
                    )}
                    <span
                      className={cn(
                        'truncate',
                        isSelected ? color : 'text-muted-foreground/75',
                      )}
                    >
                      {dept.department_name}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => addDepartmentsMutation.mutate()}
              disabled={selectedDepartments.length === 0}
            >
              Add Departments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  ) : (
    <div className="flex flex-row gap-8">
      {article?.departments?.length > 0 &&
        article.departments.map((department) => {
          const fullDepartment = allDepartments.find((dept) => dept.id == department);

          if (!fullDepartment) return null;
          return (
            <DepartmentBadge
              key={fullDepartment.id}
              department={fullDepartment.department_name}
              list
              size="large"
            />
          );
        })}
    </div>
  );
};

export default ArticleDepartments;

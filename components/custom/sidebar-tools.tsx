'use client';

import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { type User } from 'next-auth';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import { MoreHorizontalIcon, TrashIcon } from '@/components/custom/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Chat } from '@/db/schema';
import { fetcher } from '@/lib/utils';

type GroupedChats = {
  today: Chat[];
  yesterday: Chat[];
  lastWeek: Chat[];
  lastMonth: Chat[];
  older: Chat[];
};

const ToolItem = ({
  tool,
  setOpenMobile,
}: {
  tool: string;
  setOpenMobile: (open: boolean) => void;
}) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild>
      <Link target="_blank" href={`https://app.toolhouse.ai/store/${tool}`} onClick={() => setOpenMobile(false)}>
        <span>{tool}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export function SidebarTools({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const pathname = usePathname();
  const {
    data: tools,
    isLoading,
    mutate,
  } = useSWR<Array<string>>('/api/tools', fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
      method: 'DELETE',
    });

    toast.promise(deletePromise, {
      loading: 'Deleting chat...',
      success: () => {
        mutate((history) => {
          if (history) {
            return history.filter((h) => h.id !== id);
          }
        });
        return 'Chat deleted successfully';
      },
      error: 'Failed to delete chat',
    });

    setShowDeleteDialog(false);

    if (deleteId === id) {
      router.push('/');
    }
  };

  // if (!user) {
  //   return (
  //     <SidebarGroup>
  //       <SidebarGroupContent>
  //         <div className="text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
  //           <div>Manage your tools in the Tool Store.</div>
  //         </div>
  //       </SidebarGroupContent>
  //     </SidebarGroup>
  //   );
  // }

  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
          Manage your tools in the <Link className="text-primary" href="https://app.toolhouse.ai">Tool Store</Link>.
        </div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
                <div
                  className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                  style={
                    {
                      '--skeleton-width': `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (tools?.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            <div>
              <h4>No tools installed</h4>
              <p>Install tools in the <Link href="https://app.toolhouse.ai/">Tool Store</Link>.</p>
            </div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      <SidebarGroup>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
          Manage your tools in the <Link className="text-primary" href="https://app.toolhouse.ai">Tool Store</Link>.
        </div>

        <SidebarGroupContent>
          <SidebarMenu>
            {tools ? 
              tools.map((tool) => (<ToolItem
                key={tool}
                tool={tool}
                setOpenMobile={setOpenMobile}
              />)) : 
              <></>
            }
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

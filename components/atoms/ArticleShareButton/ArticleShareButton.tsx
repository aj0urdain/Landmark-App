import React from 'react';
import { Article } from '@/types/articleTypes';
import {
  Share,
  Clipboard,
  Mail,
  Linkedin,
  Twitter,
  Link2,
  Hammer,
  Instagram,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const ArticleShareButton = ({
  article,
  editing,
}: {
  article: Article;
  editing: boolean;
}) => {
  const [open, setOpen] = React.useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
      setOpen(false);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 flex items-center">
          <Share className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share article</DialogTitle>
          <DialogDescription>{/* Just imported to ignore errors */}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">Private</h3>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleCopyToClipboard}
              >
                <Clipboard className="w-4 h-4" />
                Copy URL to clipboard
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 cursor-not-allowed"
                disabled
              >
                <Mail className="w-4 h-4" />
                Email
                <div className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
                  <Hammer className="w-3 h-3" />
                  <p>Coming soon</p>
                </div>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">Public</h3>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 cursor-not-allowed"
                disabled
              >
                <Link2 className="w-4 h-4" />
                Get public link
                <div className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
                  <Hammer className="w-3 h-3" />
                  <p>Coming soon</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 cursor-not-allowed"
                disabled
              >
                <Linkedin className="w-4 h-4" />
                Post to LinkedIn
                <div className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
                  <Hammer className="w-3 h-3" />
                  <p>Coming soon</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 cursor-not-allowed"
                disabled
              >
                <Twitter className="w-4 h-4" />
                Post to Twitter
                <div className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
                  <Hammer className="w-3 h-3" />
                  <p>Coming soon</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 cursor-not-allowed"
                disabled
              >
                <Instagram className="w-4 h-4" />
                Post to Instagram
                <div className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
                  <Hammer className="w-3 h-3" />
                  <p>Coming soon</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleShareButton;

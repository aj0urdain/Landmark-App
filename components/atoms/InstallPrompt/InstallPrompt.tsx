import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share, Plus } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <h3 className="text-lg font-semibold">Install Landmark</h3>
      </CardHeader>
      <CardContent>
        {isIOS ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To install Landmark on your iOS device:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Tap the share button <Share className="inline w-4 h-4 mx-1" />
              </li>
              <li>
                Select "Add to Home Screen" <Plus className="inline w-4 h-4 mx-1" />
              </li>
            </ol>
          </div>
        ) : (
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add to Home Screen
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

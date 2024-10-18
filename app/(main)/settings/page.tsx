import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <Card className="h-full w-full p-6">
      <CardTitle className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </CardTitle>
      <CardContent>
        <p className="text-sm text-muted-foreground">No settings yet.</p>
      </CardContent>
    </Card>
  );
}

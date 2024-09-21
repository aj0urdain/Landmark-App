import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function AdminPage() {
  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-4 py-4">
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>Updates</CardTitle>
          <CardDescription>Manage your updates here</CardDescription>
        </CardHeader>
        <CardContent className="h-full w-full">Testing</CardContent>
      </Card>
    </div>
  );
}

export default AdminPage;

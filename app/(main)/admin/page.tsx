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
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Access administrator settings here</CardDescription>
        </CardHeader>
        <CardContent className="h-full w-full">Controls to come!</CardContent>
      </Card>
    </div>
  );
}

export default AdminPage;

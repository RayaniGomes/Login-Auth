import { Loader2 } from "lucide-react";

export default function IsLoading() {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
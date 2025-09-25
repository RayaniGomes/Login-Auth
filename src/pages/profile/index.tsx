import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
export default function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout realizado");
    navigate("/login");
  };

  return (
    <>
      <header className="flex items-center justify-end p-4">
        <Button
          onClick={handleLogout}
          size="lg"
          variant="default"
          className="w-70 text-lg"
          style={{ backgroundColor: "#02274F" }}
        >
          Logout
        </Button>
      </header>

      <section className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
        <Card className="w-full max-w-md shadow-2xl rounded-3xl">
          <CardHeader className="flex flex-col items-center justify-center pb-8">
            <p className="text-sm text-gray-500 font-medium">Profile picture</p>
            <Avatar className="h-18 w-18">
              <AvatarImage src="/avatar-placeholder.png" alt="Avatar" />
              <AvatarFallback className="text-2xl">U</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form className="space-y-6">
              <div className="space-y-2">
                <p>
                  Your
                  <span className="font-medium"> Nome</span>
                </p>
                <Input
                  type="text"
                  placeholder="Nome"
                  className="w-full h-14 bg-gray-100 border-gray-200 rounded-md px-3 text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <p>
                  Your
                  <span className="font-medium"> E-mail</span>
                </p>
                <Input
                  type="text"
                  placeholder="Nome"
                  className="w-full h-14 bg-gray-100 border-gray-200 rounded-md px-3 text-gray-500"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

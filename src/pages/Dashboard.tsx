import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { getStoredUser } from "@/services/api";
import { UserProfile } from "@/interfaces/profile.interface";
import { getProfile } from "@/services/profile.service";
import { logout } from "@/services/auth.service";
import IsLoading from "@/utils/isLoading.function";
import { getInitials } from "@/lib/utils";

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const storedUser = getStoredUser();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        setError("Erro ao carregar perfil do usuário");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [storedUser?.id]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
      variant: "default",
    });
    navigate("/", { replace: true });
  };

  if (isLoading) {
    return IsLoading();
  }

  return (
    <>
      <header className="flex items-center justify-end p-4 fixed top-0 left-0 w-full bg-card/50 z-10">
        <Button
          variant="default"
          onClick={handleLogout}
          data-cy="logout-button"
          className="w-80 transition-smooth hover:opacity-90"
          style={{ backgroundColor: "#02274F" }}
        >
          Logout
        </Button>
      </header>

      {error ? (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 ">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      ) : (
        <main className="h-screen flex flex-col items-center justify-center bg-blue-50 p-4">
          <Card
            className="w-full max-w-md shadow-2xl rounded-3xl"
            data-cy="profile-card"
          >
            <CardHeader>
              <CardTitle className="flex flex-col items-center space-x-2">
                <p className="text-sm text-gray-500 font-medium">
                  Profile picture
                </p>
                <Avatar
                  className="w-16 h-16 bg-blue-50 rounded-lg"
                  data-cy="profile-avatar"
                >
                  <AvatarImage
                    className="object-cover "
                    src={profile?.avatar?.high}
                    alt={profile?.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials(profile?.name || "", profile?.last_name)}
                  </AvatarFallback>
                </Avatar>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile ? (
                <form className="space-y-6">
                  <div className="space-y-2">
                    <p>
                      Your <span className="font-medium"> Nome</span>
                    </p>
                    <Input
                      type="text"
                      value={profile.name}
                      readOnly
                      data-cy="profile-name"
                      className="w-full h-14 bg-gray-100 border-gray-200 rounded-md px-3 text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <p>
                      Your <span className="font-medium"> E-mail</span>
                    </p>
                    <Input
                      type="text"
                      value={profile.email}
                      readOnly
                      data-cy="profile-email"
                      className="w-full h-14 bg-gray-100 border-gray-200 rounded-md px-3 text-gray-700"
                    />
                  </div>
                </form>
              ) : (
                IsLoading()
              )}
            </CardContent>
          </Card>
        </main>
      )}
    </>
  );
}

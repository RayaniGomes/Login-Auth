import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useAuth } from "@/contexts/auth.context";
import { loginSchema, type LoginFormData } from "@/schemas/login.schema";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isLoading: authLoading } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo so deu perfil.",
        variant: "default",
      });
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        const serverErrors = error.response.data;
        Object.keys(serverErrors).forEach((field) => {
          setError(field as keyof LoginFormData, {
            type: "server",
            message: serverErrors[field][0],
          });
        });
      } else {
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas. Verifique seu email e senha.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl">
        <CardHeader className="flex items-center justify-center">
          <div className="text-4xl font-bold">
            <img src="/logo.png" alt="logo" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="w-full">
              <Label
                htmlFor="email"
                className="text-xl font-bold text-gray-700"
              >
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="@gmail.com"
                className={`h-12 bg-gray-100 border-gray-200 rounded-md px-3 text-gray-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                disabled={authLoading}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="w-full">
              <Label
                htmlFor="password"
                className="text-xl font-bold text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="************"
                className={`h-12 bg-gray-100 border-gray-200 rounded-md px-3 text-gray-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
                disabled={authLoading}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={authLoading}
              variant="default"
              size="lg"
              className="w-full"
              style={{ backgroundColor: "#02274F" }}
            >
              {authLoading ? "Entrando..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

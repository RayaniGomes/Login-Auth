import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormData } from "@/schemas/login.schema";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log("Dados do login:", data);
      // Aqui você implementaria a lógica de autenticação
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula API call

      // Redireciona para o perfil após login bem-sucedido
      navigate("/profile");
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
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
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <div className="space-y-2">
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
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
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
              disabled={isLoading}
              variant="default"
              size="lg"
              className="w-full mt-4"
              style={{ backgroundColor: "#02274F" }}
            >
              {isLoading ? "Entrando..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

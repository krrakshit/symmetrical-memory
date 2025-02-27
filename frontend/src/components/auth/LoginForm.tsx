//frontend/src/components/auth/LoginForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAtom } from "jotai";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { pageAtom } from "@/atoms/pageAtom";
import { useAuth } from "@/hooks/useAuth";

// ✅ Zod Schema for validation
const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setWhichPage] = useAtom(pageAtom);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
        type: "success"
      });

    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid email or password",
        type: "error"
      });
      form.setValue("password", ""); // Clear password on error
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[400px] p-8 rounded-lg border border-gray-300/30 
                      bg-white/10 backdrop-blur-md shadow-lg shadow-blue-500/20">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-blue-400 selection:bg-blue-600"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-blue-400 selection:bg-blue-600 pr-10 transition-all"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* Signup Link */}
            <p className="text-center text-gray-400 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setWhichPage("Signup")}
                className="text-blue-400 hover:underline"
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}


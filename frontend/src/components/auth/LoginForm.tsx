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
import { loginAtom } from "@/atoms/authAtom";
import { pageAtom } from "@/atoms/pageAtom";

// ✅ Define form schema with Zod
const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginForm() {
  const [auth, setAuth] = useAtom(loginAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [, setWhichPage] = useAtom(pageAtom)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: auth,
  });

  function onSubmit(data: z.infer<typeof LoginSchema>) {
    setAuth(data);
    toast({
      title: "Login Successful!",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field with Animated Reveal */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      {/* Password Input */}
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-blue-400 selection:bg-blue-600 pr-10 transition-all"
                      />

                      {/* Eye Open/Close Animation */}
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 flex items-center justify-center w-6 h-6"
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
            >
              Login
            </Button>

            {/* Signup Link */}
            <p className="text-center text-gray-400 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setWhichPage("Signup")}
                className="text-blue-400 hover:underline"
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


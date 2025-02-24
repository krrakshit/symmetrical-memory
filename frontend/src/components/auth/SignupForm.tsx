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
import { signupAtom } from "@/atoms/authAtom";

// ✅ Define Signup Form Schema with Zod
const SignupSchema = z
  .object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignupForm() {
  const [auth, setAuth] = useAtom(signupAtom)
  const [, setWhichPage] = useAtom(pageAtom);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: auth,
  });

  function onSubmit(data: z.infer<typeof SignupSchema>) {
    setAuth(data)
    toast({
      title: "Signup Successful!",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    setWhichPage("Login"); // Redirect to login page after signup
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[400px] p-8 rounded-lg border border-gray-300/30 
                      bg-white/10 backdrop-blur-md shadow-lg shadow-green-500/20">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Sign Up</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      {...field}
                      className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-green-400 selection:bg-green-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-green-400 selection:bg-green-600"
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
                        className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-green-400 selection:bg-green-600 pr-10 transition-all"
                      />
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

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...field}
                      className="bg-gray-800 text-white border-none focus:ring-2 focus:ring-green-400 selection:bg-green-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
            >
              Sign Up
            </Button>

            {/* Back to Login Link */}
            <p className="text-center text-gray-400 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setWhichPage("Login")}
                className="text-green-400 hover:underline"
              >
                Log in
              </button>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}


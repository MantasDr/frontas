import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authProvider";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Privaloma įvesti vartotojo vardą",
  }),
  password: z.string().min(1, { message: "Privaloma įvesti slaptažodį" }),
});

export default function Login() {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(
        "auth/login",
        {
          login: values.username,
          password: values.password,
        },
        { withCredentials: true }
      );

      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Unspecified error");
    }
  }

  return (
    <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96">
      <CardHeader>
        <img src="../../../public/logo.png" width={500} />
        <h1 className="mx-auto font-bold text-gray-900">Prisijungimas</h1>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vartotojo vardas</FormLabel>
                  <FormControl>
                    <Input placeholder="Įveskite vartotojo vardą" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slaptažodis</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Įveskitę slaptažodį"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <FormMessage>{error}</FormMessage>}
            <a className="block text-sm" href="/register">
              Neturi paskyros? Spausk čia.
            </a>
            <Button type="submit">Prisijungti</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

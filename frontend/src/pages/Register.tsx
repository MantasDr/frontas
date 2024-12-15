import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Privaloma įvesti vartotojo vardą",
  }),
  password: z.string().min(1, { message: "Būtinas slaptažodis" }),
//  email: z.string().email({ message: "Netinkamas elektroninis paštas" }),
});

export default function Register() {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
  //    email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post("http://localhost:8081/users", values, { withCredentials: true });
  
      toast({
        title: "Registracija sėkminga",
        description: `Jūsų registracija buvo sėkminga su vartotojo vardu: ${values.username}. Prašome prisijungti.`,
        duration: 8000,
        className: "bg-green-200",
      });
  
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Įvyko klaida registruojantis");
    }
  }
  

  return (
    <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96">
      <CardHeader>
        <img src="../../../public/logo.png" width={500} />
        <h1 className="mx-auto font-bold text-gray-900">Registracija</h1>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elektroninis paštas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Įveskite elektroninį paštą"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
            <a className="block text-sm" href="/login">
              Jau turite paskyra? Prisijunkite.
            </a>
            <Button type="submit">Registruotis</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

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
  realname: z.string().min(1, {
    message: "Privaloma įvesti vardą",
  }),
  surname: z.string().min(1, {
    message: "Privaloma įvesti pavardę",
  }),
  birth: z.string().min(1, {
    message: "Privaloma įvesti gimimo datą",
  }),
  city: z.string().min(1, {
    message: "Privaloma įvesti miestą",
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
      realname: "",
      surname: "",
      birth: "",
      city: "",
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
    <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 mt-20">
  <CardHeader className="text-center">
    <img src="../../../public/logo.png" className="mx-auto mb-4" width={150} />
    <h1 className="font-bold text-gray-900 text-2xl">Registracija</h1>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="realname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vardas</FormLabel>
              <FormControl>
                <Input placeholder="Įveskite vardą" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pavardė</FormLabel>
              <FormControl>
                <Input placeholder="Įveskite pavardę" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gimimo data</FormLabel>
              <FormControl>
                <Input type="date" placeholder="Įveskite gimimo datą" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miestas</FormLabel>
              <FormControl>
                <Input placeholder="Įveskite gyvenamąjį miestą" {...field} />
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
                <Input type="password" placeholder="Įveskite slaptažodį" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {error && <FormMessage>{error}</FormMessage>}
        
        <a className="block text-sm text-center" href="/login">
          Jau turite paskyrą? Prisijunkite.
        </a>
        
        <Button type="submit" className="w-full">
          Registruotis
        </Button>
      </form>
    </Form>
  </CardContent>
</Card>

  );
}

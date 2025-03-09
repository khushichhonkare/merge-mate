import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~components/ui/form"
import { Input } from "~components/ui/input"
import { encryptToken } from "../utils/encryption"

const formSchema = z.object({
  access_token: z.string().min(1, { message: "Access token is required." })
})

interface AccessTokenFormProps {
  onTokenSubmit: (token: string) => void
}

export function AccessTokenForm({ onTokenSubmit }: AccessTokenFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      access_token: ""
    }
  })

  const onSubmit = (data: { access_token: string }) => {
    const encryptedToken = encryptToken(data.access_token)
    localStorage.setItem("merge-mate-access", encryptedToken)
    onTokenSubmit(data.access_token)
  }

  const accessTokenLink = "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"

  return (
    <div className="flex justify-center items-center w-[450px] min-w-[450px] p-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center space-y-8 p-4 w-full border-2 bg-gray-100 border-gray-300">
        <FormField
             control={form.control}
             name="access_token"
             render={({ field }) => (
               <FormItem className="w-full text-center">
                 <FormLabel className="text-center text-xl font-semibold">
                   Please enter your access token
                 </FormLabel>
                 <FormControl>
                   <Input
                     placeholder="ghp_abcDEFGHIJKLMNOPQRSTUVWXYZ123..."
                     {...field}
                     className="text-sm"
                   />
                 </FormControl>
                 <FormDescription className="text-center text-sm">
                   Click{" "}
                   <a
                     href={accessTokenLink}
                     target="_blank"
                     className="text-blue-500">
                     here
                   </a>{" "}
                   to see how to generate access token
                 </FormDescription>
                 <FormMessage className="text-center text-sm" />
               </FormItem>
             )}
           />
           <Button type="submit" className="mt-4 text-base">
             Submit
           </Button>
        </form>
      </Form>
    </div>
  )
} 
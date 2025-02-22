"use client"
import React from 'react'
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TooltipTrigger, Tooltip, TooltipContent} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';


const addFriendFormSchema = z.object({
    email: z.string().min(1, {message:"This field can't be empty "}).email("Please enter a valid email"),
});

const AddFriendDialogBox = () => {
    const {mutate: createRequest, pending} = useMutationState(api.request.create)
    

    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver(addFriendFormSchema),
        defaultValues: {
            email:"",
        }
    })

    const handleSubmit = async (values: z.infer<typeof addFriendFormSchema>) => {
        await createRequest({email: values.email}).then(() => {
            form.reset();
            toast.success("Friend request sent!");
        }).catch((error) => {
            toast.error(error instanceof ConvexError ? error.data : "Unexpected error occured")
        })
    };

  return (
    <Dialog>
        <Tooltip>
            <TooltipTrigger>
                <Button size="icon" variant="outline">
                    <DialogTrigger>
                        <UserPlus/>
                    </DialogTrigger>
                </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        Add Friends
                    </p>
                </TooltipContent>
            </Tooltip>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <DialogDescription>
                            Send a friend request to connect with your friends
                        </DialogDescription>
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
                        <FormField control={form.control} name="email" render = {({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='Email...'{...field}/>
                                </FormControl>
                                <FormMessage/>
                        </FormItem>)}/>
                        <DialogFooter>
                            <Button disabled={pending} type="submit">Send</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
        
  )
}

export default AddFriendDialogBox
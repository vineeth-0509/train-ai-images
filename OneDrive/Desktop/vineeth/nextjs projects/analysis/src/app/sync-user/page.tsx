import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function SyncUser(){
    const {userId} = await auth();
    if(!userId){ throw new Error ("User not found")};

    const client = await clerkClient(); //used to access the users information or session token;
    const user = await client.users.getUser(userId);
    if(!user.emailAddresses[0]?.emailAddress){ 
        return notFound();
    }
    await db.user.upsert({  //if the user exists update the information or if the the user not exists create the user.
        where:{
            emailAddress: user.emailAddresses[0]?.emailAddress ?? ""
        },
        update: {
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName:user.lastName, 
        },
        create:{
            id: userId,
            emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    })
    return redirect('/dashboard')
}
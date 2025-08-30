import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";



type props = {
    userId?: string;
}

export async function UserGender({userId }:props){ 
    const gender = await prisma.user.findUnique({
        where : { id: userId}, 
        select : { gender : true }, 
    }); 

    return gender || null;

}

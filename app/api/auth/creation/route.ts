import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";
import {unstable_noStore as noStore} from "next/cache"

export async function GET(request: Request){
    noStore();
    const {getUser} = getKindeServerSession() 

    const user = await getUser();

    if(!user || user === null || !user.id) {
        throw new Error("Oops, something went wrong. Please try again");
    }

    let dbUser = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
    });

    // Check if role is provided as a query parameter
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    
    if (!dbUser) {
        // Create user with the specified role if provided
        dbUser = await prisma.user.create({
            data: {
                email: user.email ?? "",
                firstName: user.given_name ?? "",
                lastName: user.family_name ?? "",
                id: user.id, 
                ProfileImage: user.picture ?? `https://avatar.vercel.sh/rauchg`,
                role: role === 'HOSTEL_OWNER' ? 'HOSTEL_OWNER' : 'STUDENT', // Default to STUDENT if not specified
            },
        });
    } else if (role && (role === 'STUDENT' || role === 'HOSTEL_OWNER') && dbUser.role !== role) {
        // Update existing user's role if they want to change it
        dbUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                role: role as 'STUDENT' | 'HOSTEL_OWNER',
            },
        });
    }

    return NextResponse.redirect(`https://campus-cottages.com`);
}
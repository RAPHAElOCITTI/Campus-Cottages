import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { HomeIcon, MenuIcon, BookOpenIcon, HeartIcon, LogOutIcon, UserIcon } from "lucide-react";
import {
    RegisterLink, 
    LoginLink,
    LogoutLink} 
    from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { createcampuscottagesHostel } from "../actions";
import Image from "next/image";
import { prisma } from "../lib/db";
import { Badge } from "@/components/ui/badge";

export async function UserNav(){ 
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    
    // Fetch user role from database if user exists
    let userRole = null;
    if (user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true }
        });
        userRole = dbUser?.role;
    }

    const createHostelwithId = createcampuscottagesHostel.bind(null, {
        UserId: user?.id as string,
    });
    
    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3 hover:bg-slate-100 transition-colors">
                   <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />

                   <Image 
                    src={
                    user?.picture ??
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6LXNJFTmLzCoExghcATlCWG85kI8dsnhJng&s"
                    }
                    alt="Image of the user"
                    className="rounded-full h-8 w-8 hidden lg:block"
                    width={48} height={48}
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
               {user ? (
                <>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.given_name} {user.family_name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                            {userRole && (
                                <Badge variant="outline" className="mt-1 w-fit">
                                    {userRole}
                                </Badge>
                            )}
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Quick Role Switch */}
                    <DropdownMenuLabel className="font-medium text-xs text-muted-foreground">
                        SWITCH ROLE
                    </DropdownMenuLabel>
                    <div className="flex px-2 py-1.5 gap-2">
                        <Link 
                            href="/api/auth/creation?role=STUDENT" 
                            className={`flex-1 text-xs py-1.5 px-2 rounded-md text-center font-medium ${userRole === 'STUDENT' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                        >
                            Student
                        </Link>
                        <Link 
                            href="/api/auth/creation?role=HOSTEL_OWNER" 
                            className={`flex-1 text-xs py-1.5 px-2 rounded-md text-center font-medium ${userRole === 'HOSTEL_OWNER' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                        >
                            Hostel Owner
                        </Link>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {/* Hostel Owner features */}
                    {userRole === 'HOSTEL_OWNER' && (
                        <>
                            <DropdownMenuItem className="cursor-pointer bg-green-50 hover:bg-green-100 border border-green-200 rounded-md my-1 p-0 overflow-hidden">
                                <form action={createHostelwithId} className="w-full">
                                    <button type="submit" className="w-full text-start flex items-center gap-2 text-green-700 p-2 h-full">
                                        <HomeIcon className="h-4 w-4" />
                                        <span>List your Hostel</span>
                                    </button>
                                </form>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/my-hostels" className="w-full flex items-center gap-2">
                                    <HomeIcon className="h-4 w-4" />
                                    <span>My Listings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    
                    {/* Student features */}
                    {userRole === 'STUDENT' && (
                        <>
                            <DropdownMenuItem>
                                <Link href="/bookings" className="w-full flex items-center gap-2">
                                    <BookOpenIcon className="h-4 w-4" />
                                    <span>My Bookings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    
                    {/* Common features for all users */}
                    <DropdownMenuItem>
                        <Link href="/favorites" className="w-full flex items-center gap-2">
                            <HeartIcon className="h-4 w-4" />
                            <span>My Favorites</span>
                        </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LogoutLink className="w-full flex items-center gap-2">
                            <LogOutIcon className="h-4 w-4" />
                            <span>Logout</span>
                        </LogoutLink>
                    </DropdownMenuItem>
                </>
               ) : (
                <>
                    <DropdownMenuItem>
                        <RegisterLink className="w-full flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            <span>Register</span>
                        </RegisterLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LoginLink className="w-full flex items-center gap-2">
                            <LogOutIcon className="h-4 w-4 rotate-180" />
                            <span>Login</span>
                        </LoginLink>
                    </DropdownMenuItem>
                </>
               )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
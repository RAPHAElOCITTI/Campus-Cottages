import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import {
    RegisterLink, 
    LoginLink,
    LogoutLink} 
    from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { createcampuscottagesHostel } from "../actions";
import Image from "next/image";



export async function UserNav(){ 
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    const createHostelwithId =  createcampuscottagesHostel.bind(null, {
        userId: user?.id as string,
    });
    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-centre gap-x-3">
                   <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />

                   <Image 
                    src={
                    user?.picture ??
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6LXNJFTmLzCoExghcATlCWG85kI8dsnhJng&s"
                    }
                    alt="Image of the user"
                    className="rounded-full h-8 w-8 hidden lg:block"
                    
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
               {user ? (
                <>
                <DropdownMenuItem>
                    <form action={createHostelwithId} className="w-full">
                        <button type="submit" className="w-full text-start">
                           List your Hostel 
                        </button>

                    </form>
                 </DropdownMenuItem>
                 <DropdownMenuItem>
                    <Link href="/my-hostels" className="w-full">
                    My Listings
                    </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem>
                    <Link href="/favorites" className="w-full">
                    My Favorites
                    </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem>
                    <Link href="/bookings" className="w-full">
                    My Bookings
                    </Link>
                 </DropdownMenuItem>
                <DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <LogoutLink className="w-full">
                        Logout
                    </LogoutLink>
                </DropdownMenuItem>
                </>
               ) : (
                <>
                 <DropdownMenuItem>
                    <RegisterLink className="w-full">
                        Register
                    </RegisterLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LoginLink className="w-full">
                        Login
                    </LoginLink>
                </DropdownMenuItem>
                </>
               )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
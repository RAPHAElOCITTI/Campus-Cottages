import { createCategoryPage } from "@/app/actions";
import { CreateBottomBar } from "@/app/components/CreationBottomBar";
import { SelectCategory } from "@/app/components/SelectedCategory";




export default function StructureRoute({ params }: {params: {id: string} }){
    return (
        <>
        <div className="w-3/5 mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight transition-colors ">Which of the best describes your Hostel?</h2>
        </div>

        <form action={createCategoryPage}>

            <input type="hidden" name="hostelId" value={params.id} />
            <SelectCategory />
            
            <CreateBottomBar />
            

            
        </form>
        </>
    );
}
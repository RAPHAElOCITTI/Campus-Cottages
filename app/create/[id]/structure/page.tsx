import { createCategoryPage } from "@/app/actions";
import { CreateBottomBar } from "@/app/components/CreationBottomBar";
import { SelectCategory } from "@/app/components/SelectedCategory";

export default async function StructureRoute({ params }: { params: { id: string } }) {
  try {
    console.log("Resolving params...");

    const resolvedParams = await Promise.resolve(params); // Await the promise resolution
    console.log("Params resolved:", resolvedParams);

    if (!resolvedParams?.id) {
      throw new Error("Error: ID is missing!");
    }

    return (
      <>
        <div className="w-3/5 mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight transition-colors">
            Which of the best describes your Hostel?
          </h2>
        </div>

        <form action={createCategoryPage}>
          <input type="hidden" name="hostelId" value={resolvedParams.id} />
          <SelectCategory />
          <CreateBottomBar />
        </form>
      </>
    );
}catch (error: Error | unknown) {
        let errorMessage = 'An unknown error occurred';
        
        if (typeof error === 'object' && error !== null) {
          errorMessage = 'Error: ' + (error as Error).message;
        }
      
        console.error("Error in resolving params:", error);
        return <div>{errorMessage}</div>;
      }
}

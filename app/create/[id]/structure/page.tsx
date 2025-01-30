import { createCategoryPage } from "@/app/actions";
import { CreateBottomBar } from "@/app/components/CreationBottomBar";
import { SelectCategory } from "@/app/components/SelectedCategory";

export default function StructureRoute({ params }: { params: { id: string } }) {
  return new Promise<any>((resolve, reject) => {
    console.log("Resolving params...");

    Promise.resolve(params)
      .then((resolvedParams) => {
        console.log("Params resolved:", resolvedParams);

        if (!resolvedParams?.id) {
          throw new Error("Error: ID is missing!");
        }
    resolve (
      <>
        <div className="w-3/5 mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight transition-colors">
            Which of the best describes your Hostel?
          </h2>
        </div>

        <div>Structure Route Loaded for ID: {resolvedParams.id}</div>
        
        <form action={createCategoryPage}>
          <input type="hidden" name="hostelId" value={resolvedParams.id} />
          <SelectCategory />
          <CreateBottomBar />
        </form>
      </>
    );
  }) .catch((error) => {
    console.error("Error in resolving params:", error);

    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = "Error: " + error.message;
    }

    reject(<div>{errorMessage}</div>);
  })
  .finally(() => {
    console.log("Params resolution completed.");
  });
  });
}

import { BillboardClient } from "./components/client"

const BillBoardsPage = () => {

    return (
        <>
            {/*
           
            <div className="flex justify-center text-center text-3xl absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] items-center">
                
                    I thank to Allah Almgight who has granted me the wisom and means to understand this.
                
            </div> 
            */}

            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <BillboardClient />

                </div>

            </div>
        </>
    )
}

export default BillBoardsPage
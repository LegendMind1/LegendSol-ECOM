import prismadb from "@/lib/prismadb"

//Testing
interface DashboardPageProps {
  params: {storeId: string}
}

const DashboardPage: React.FC<DashboardPageProps> = async ({params}) => {
  
    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId
      }
    })
  return (
    <>

      <div className="flex flex-col items-center">
        <div>Store Name: {store?.name}</div>
        <div>Created on: {store?.createdAt.toDateString()}</div>
        <div>Updated on: {store?.updatedAt.toDateString()}</div>
      </div>

    </>
  )
}

export default DashboardPage
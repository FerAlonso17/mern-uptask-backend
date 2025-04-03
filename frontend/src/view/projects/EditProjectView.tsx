import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"
import { getProjectById } from "../../api/ProjectAPI"
import EditProjectForm from "../../components/projects/EditProjectForm"

export default function EditProjectView() {

    const params = useParams()
    const projectId = params.projectId!

    const {data,isError,isLoading} = useQuery({
        queryKey: ['editProject',projectId],
        queryFn: ()=>getProjectById(projectId),
        retry: false // este retry lo q hace es q si no hay datos, solo lo intenta una vez y si no hay no intenta más veces
    })

    if(isLoading) return 'Loading...'
    if(isError) return <Navigate to='/404'/>
    if(data) return <EditProjectForm data={data} projectId={projectId}/>
}

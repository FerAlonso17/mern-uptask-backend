import { useQuery } from '@tanstack/react-query'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { getTaskById } from '../../api/TaskAPI'
import EditTaskModal from './EditTaskModal'

export default function EditTaskData() {

    const params = useParams()
    const projectId = params.projectId!

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('editTask')!

    const {data,isError} = useQuery({
        queryKey: ['task',taskId],
        queryFn: ()=>getTaskById({projectId,taskId}),
        enabled: !!taskId, //El doble signo de exclamación convierte a booleano, es decir verifica si tiene algo convierte a true y si no convierte a false
        retry:false //para q no haga llamados innecesarios si  no encuentra datos
    })

    if (isError) return <Navigate to={'/404'}/>
    if (data) return (<EditTaskModal data={data} taskId={taskId}/>)
}

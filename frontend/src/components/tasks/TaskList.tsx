import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { statusTranslations } from "../../locales/es"
import { Project, TaskProject, TaskStatus } from "../../types"
import DropTask from "./DropTask"
import TaskCard from "./TaskCard"
import { useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStatus } from "../../api/TaskAPI"
import { toast } from "react-toastify"

type TaskListProps = {
    tasks: TaskProject[]
    canEdit: boolean
}

type GroupedTasks = {
    [key: string]: TaskProject[]
}
const intialStatusGroups: GroupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: []
}

export const statusColors: { [key: string]: string } = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500',
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {

    const params = useParams()
    const projectId = params.projectId!

    const queryClient= useQueryClient()
    const { mutate } = useMutation({
            mutationFn: updateStatus,
            onError: (error) => {
                toast.error(error.message)
            },
            onSuccess: (data) => {
                toast.success(data)
                queryClient.invalidateQueries({ queryKey: ['project', projectId] })
                // queryClient.invalidateQueries({ queryKey: ['task'] })
            }
        })

    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, intialStatusGroups);

    const mouseSensor = useSensor(MouseSensor,{
        activationConstraint: {
            distance:10
        }
    })

    const touchSensor = useSensor(TouchSensor,{
        activationConstraint:{
            delay:250,
            tolerance:5
        }
    })

    const sensors = useSensors(mouseSensor,touchSensor)

    const handleDragEnd =(e: DragEndEvent)=>{
        const {over,active} = e

        if (over && over.id) {
            const taskId = active.id.toString()
            const status = over.id as TaskStatus

            mutate({projectId,taskId,status})

            //optimizando demora en soltar tarea
            queryClient.setQueryData(['projectId',projectId],(prevData: Project)=>{
                const updatedTasks = prevData.tasks.map((task)=>{
                    if (task._id === taskId) {
                        return{
                            ...task,
                            status
                        }
                    }
                    return task
                })
                return {
                    ...prevData,
                    tasks: updatedTasks
                }
            })
        }
    }

    return (
        <>
            <h2 className="text-3xl font-extrabold mt-10 mb-4">Tasks:</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>

                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                            <h3
                                className={`capitalize text-xl font-light border border-slate-300 ${statusColors[status]} bg-white p-3 border-t-8`}
                            >
                                {statusTranslations[status]}
                            </h3>
                            <DropTask status={status}/>
                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">There aren't tasks</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
    )
}

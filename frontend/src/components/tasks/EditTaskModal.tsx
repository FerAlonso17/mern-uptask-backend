import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task, TaskFormData } from '../../types';
import { useForm } from 'react-hook-form';
import TaskForm from './TaskForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../../api/TaskAPI';
import { toast } from 'react-toastify';

type EditTaskModalProps = {
    data: Task
    taskId:Task['_id']
}

export default function EditTaskModal({data,taskId}:EditTaskModalProps) {

    const navigate = useNavigate()

    const params = useParams()
    const projectId = params.projectId!

    const {register,handleSubmit,reset,formState:{errors}} = useForm<TaskFormData>({defaultValues:{
        name:data.name,
        description:data.description
    }})

    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn: updateTask,
        onError:(error)=>{
            toast.error(error.message)
        },
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:['project',projectId]})
            queryClient.invalidateQueries({queryKey:['task',taskId]})
            toast.success(data)
            reset()
            navigate(location.pathname, {replace:true})
        }
    })
    const handleEditTask =(formData:TaskFormData)=>{
        const data = {
            projectId,
            taskId,
            formData
        }
        mutate(data)
    }

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace:true}) }>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all px-10 py-8">
                                <DialogTitle
                                    as="h3"
                                    className="font-black text-3xl mt-2 mb-0.5"
                                >
                                    Edit Task
                                </DialogTitle>

                                <p className="text-lg font-bold">Make changes to a task in {''}
                                    <span className="text-cyan-600">this form</span>
                                </p>

                                <form
                                    className="mt-6 space-y-3"
                                    noValidate
                                    onSubmit={handleSubmit(handleEditTask)}
                                >
                                    <TaskForm
                                        register={register}
                                        errors={errors}
                                    />
                                    <input
                                        type="submit"
                                        className=" bg-cyan-700 hover:bg-cyan-800 w-full p-3  text-white font-black  text-xl cursor-pointer"
                                        value='Save changes'
                                    />
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

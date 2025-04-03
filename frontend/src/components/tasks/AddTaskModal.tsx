import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TaskForm from './TaskForm';
import { TaskFormData } from '../../types';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../../api/TaskAPI';
import { toast } from 'react-toastify';

export default function AddTaskModal() {

    const navigate = useNavigate()

    //Leer si modal existe
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalTask = queryParams.get('newTask')
    const show = modalTask ? true : false

    //obtener projectId
    const params = useParams()
    const projectId = params.projectId!

    const initialValues: TaskFormData = {
        name:'',
        description:''
    }

    
    const {register,handleSubmit,reset,formState:{errors}} = useForm({defaultValues:initialValues})
    
    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn:createTask,
        onError:(error)=>{
            toast.error(error.message)
        },
        onSuccess:(data)=>{
            queryClient.invalidateQueries({queryKey:['project', projectId]})
            toast.success(data)
            reset()
            navigate(location.pathname, {replace:true})
        }
    })

    const handleCreateTask =(formData: TaskFormData)=>{
        const data = {
            projectId,formData
        }
        mutate(data)
    }

    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
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
                                        New task
                                    </DialogTitle>

                                    <p className="text-lg font-bold">Fill out the form and create  {''}
                                        <span className="text-cyan-600">one task</span>
                                    </p>

                                    <form
                                        className='mt-6 space-y-3'
                                        onSubmit={handleSubmit(handleCreateTask)}
                                        noValidate
                                    >
                                        <TaskForm
                                            register={register}
                                            errors={errors}
                                        />

                                        <input
                                            type="submit"
                                            className=" bg-cyan-700 hover:bg-cyan-800 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                                            value='Save task'
                                        />
                                    </form>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

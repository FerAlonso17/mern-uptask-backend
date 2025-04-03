import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { CheckPasswordForm } from '../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '../../api/ProjectAPI';
import { toast } from 'react-toastify';
import { checkPassword } from '../../api/AuthAPI';

export default function DeleteProjectModal() {

    const initialValues: CheckPasswordForm = {
        password: ''
    }
    const location = useLocation()
    const navigate = useNavigate()

    const queryParams = new URLSearchParams(location.search);
    const deleteProjectId = queryParams.get('deleteProject')!;
    const show = deleteProjectId ? true : false

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const queryClient = useQueryClient()
    const checkUserPasswordMutation = useMutation({
        mutationFn: checkPassword,
        onError:(error)=>toast.error(error.message)
    })

    const deleteProjectMutation =useMutation({
        mutationFn: deleteProject,
        onError:(error)=>toast.error(error.message),
        onSuccess:(data)=>{
            toast.success(data)
            queryClient.invalidateQueries({queryKey:['projects']})
            navigate(location.pathname, { replace: true })
        }
    })

    const handleForm = async (formData:CheckPasswordForm) => {
        await checkUserPasswordMutation.mutateAsync(formData)
        await deleteProjectMutation.mutateAsync(deleteProjectId)
    }


    return (
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
                            <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all px-8 py-6">

                                <DialogTitle
                                    as="h3"
                                    className="font-black text-2xl my-2"
                                >Delete Project </DialogTitle>

                                <p className="text-lg font-bold -mt-1.5">Confirm the deletion of the project by entering your password</p>

                                <form
                                    className="mt-5 space-y-3"
                                    onSubmit={handleSubmit(handleForm)}
                                    noValidate
                                >

                                    <div className="flex flex-col gap-3">
                                        <label
                                            className="font-normal text-lg -mb-2"
                                            htmlFor="password"
                                        >Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Login password"
                                            className="w-full p-3  border-gray-300 border"
                                            {...register("password", {
                                                required: "Password required",
                                            })}
                                        />
                                        {errors.password && (
                                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                                        )}
                                    </div>

                                    <input
                                        type="submit"
                                        className=" bg-red-600 hover:bg-red-700 w-full p-2  text-white font-black  text-lg cursor-pointer"
                                        value='Delete project'
                                    />
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
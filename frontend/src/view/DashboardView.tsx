import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getProjects } from "../api/ProjectAPI";
import { useAuth } from '../hooks/useAuth';
import { isManager } from '../utils/policies';
import DeleteProjectModal from '../components/projects/DeleteProjectModal';

export default function DashboardView() {

    const navigate = useNavigate()
    const location = useLocation()
    const { data: user, isLoading: authLoading } = useAuth()
    const { data, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects
    })

    if (isLoading && authLoading) return 'Loading...'

    if (data && user) return (
        <>
            <h1 className="text-3xl font-black">My projects</h1>
            <p className="text-xl font-light text-gray-500 mt-3">Manage and administer your projects</p>

            <nav className="my-5 ">
                <Link
                    className=" bg-cyan-600 hover:bg-cyan-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    to='/projects/create'
                >New project</Link>
            </nav>
            {data.length ? (
                <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
                    {data.map((project) => (
                        <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10 hover:bg-zinc-100">
                            <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auto space-y-2">

                                    <div className='mb-2'>
                                    {isManager(project.manager, user._id) ?
                                       <p className='font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border-2 border-indigo-500 rounded-lg inline-block py-0.5 px-3'>Manager</p> :
                                       <p className='font-bold text-xs uppercase bg-green-50 text-green-500 border-2 border-green-500 rounded-lg inline-block py-0.5 px-3'>Collaborator</p>
                                     }
                                    </div>
                                    
                                    <Link to={`/projects/${project._id}`}
                                        className="text-gray-600 cursor-pointer hover:underline text-2xl font-bold"
                                    >{project.projectName}</Link>
                                    <p className="text-sm text-gray-400">
                                        Customer: {project.clientName}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-x-6">
                                <Menu as="div" className="relative flex-none">
                                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900 cursor-pointer">
                                        <span className="sr-only">options</span>
                                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                                    </MenuButton>
                                    <Transition as={Fragment} enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95">
                                        <MenuItems
                                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                                        >
                                            <MenuItem>
                                                <Link to={`/projects/${project._id}`}
                                                    className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                                                    View project
                                                </Link>
                                            </MenuItem>
                                            {project.manager === user._id && (
                                                <>
                                                    <MenuItem>
                                                        <Link to={`/projects/${project._id}/edit`}
                                                            className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                                                            Edit project
                                                        </Link>
                                                    </MenuItem>
                                                    <MenuItem>
                                                        <button
                                                            type='button'
                                                            className='block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer'
                                                            onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`)}
                                                        >
                                                            Delete project
                                                        </button>
                                                    </MenuItem>
                                                </>
                                            )}

                                        </MenuItems>
                                    </Transition>
                                </Menu>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center py-20"> There aren't projects yet {''}
                    <Link
                        to='/projects/create'
                        className=" text-fuchsia-500 font-bold"
                    >Create project</Link>
                </p>
            )}
            <DeleteProjectModal/>
        </>
    )
}

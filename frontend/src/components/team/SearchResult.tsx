import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import { TeamMember } from "../../types"
import { addUserToProject } from "../../api/TeamAPI"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SearchResult({ user, reset }: SearchResultProps) {

    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!
    
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            navigate(location.pathname, {replace: true})
            queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
        }
    })

    const handleAddUserToProject = () => {
        const data = {
            projectId,
            id: user._id
        }
        mutate(data)
    }

    return (
        <>
            <p className="mt-10 text-center font-bold mb-3">Result:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                    className="text-cyan-600 hover:bg-cyan-100 px-5 py-2 font-bold cursor-pointer rounded-4xl"
                    onClick={handleAddUserToProject}
                >Add to the project</button>
            </div>
        </>
    )
}

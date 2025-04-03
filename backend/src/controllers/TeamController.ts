import type {Request,Response} from 'express'
import User from '../models/User'
import Project from '../models/Poject'

export class TeamMemberController {
    static findMemberByEmail = async (req:Request,res:Response)=>{
        const {email} = req.body

        //Find user
        const user = await User.findOne({email}).select('id name email')
        if(!user){
            const error = new Error('User not found')
            res.status(404).json({error:error.message})
            return
        }

        res.json(user)
    }

    static getProjectTeam = async (req:Request,res:Response)=>{
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        })
        res.json(project.team)
    }

    static addMemberById = async (req:Request,res:Response)=>{
        const {id} = req.body

        //Find user
        const user = await User.findById(id).select('id')
        if(!user){
            const error = new Error('User not found')
            res.status(404).json({error:error.message})
            return
        }

        if (req.project.team.some(team=>team.toString() === user.id.toString())) {
            const error = new Error('The user already exists in the project')
            res.status(409).json({error:error.message})
            return
        }

        req.project.team.push(user.id)
        await req.project.save()

        res.send('User added correctly')
    }

    static removeMemberById = async (req:Request,res:Response)=>{
        const {userId} = req.params

        if (!req.project.team.some(team=>team.toString() === userId)) {
            const error = new Error('The user no exists in the project')
            res.status(409).json({error:error.message})
            return
        }

        req.project.team = req.project.team.filter(teamMember=>teamMember.toString() !== userId)
        await req.project.save()

        res.send('User deleted correctly')
    }
}
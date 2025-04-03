import type { Request,Response } from "express"
import Project from "../models/Poject"

export class ProjectController {
    
    static createProject = async (req: Request, res: Response)=>{
        const project = new Project(req.body)

        //asigna un manager
        project.manager = req.user.id

        try {
            await project.save()
            res.send('Project created correctly')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response)=>{
        try {
            const projects = await Project.find({
                $or: [ //Esto significa que va a mostrar los proyectos si eres manager o eres parte del team
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async(req: Request, res: Response)=>{
        const {id} = req.params
        try {
            const project = await Project.findById(id).populate('tasks')
            if (!project) {
                const error = new Error('Project not found')
                res.status(404).json({error:error.message})
                return 
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Action no valid')
                res.status(404).json({error:error.message})
                return 
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async(req: Request, res: Response)=>{

        try {
            req.project.clientName= req.body.clientName
            req.project.projectName=req.body.projectName
            req.project.description=req.body.description
            
            await req.project.save()
            res.send('Project updated')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async(req: Request, res: Response)=>{

        try {
            await req.project.deleteOne()
            res.send('Project deleted')
        } catch (error) {
            console.log(error)
        }
    }
}
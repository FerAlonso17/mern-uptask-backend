import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExist } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExist } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router()

router.use(authenticate)

router.post('/',
    body('projectName')
        .notEmpty().withMessage('Project name required'),
    body('clientName')
        .notEmpty().withMessage('Owner name required'),
    body('description')
        .notEmpty().withMessage('Description required'),
    handleInputErrors,
    ProjectController.createProject)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('Id no valid'),
    handleInputErrors,
    ProjectController.getProjectById
)


router.param('projectId', projectExist)
/** ESTE PUT Y DELETE ES DE PROJECT, PERO SE USA EL MIDDLEWARE DE PROJECTEXIST */
router.put('/:projectId',
    param('projectId').isMongoId().withMessage('Id no valid'),
    body('projectName')
        .notEmpty().withMessage('Project name required'),
    body('clientName')
        .notEmpty().withMessage('Owner name required'),
    body('description')
        .notEmpty().withMessage('Description required'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('Id no valid'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)


/**Routes for task */

router.post('/:projectId/tasks',
    hasAuthorization,
    param('projectId').isMongoId().withMessage('Id no valid'),
    body('name')
        .notEmpty().withMessage('Task name required'),
    body('description')
        .notEmpty().withMessage('Description required'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('Id no valid'),
    TaskController.getProjectTasks
)

//middlewares
router.param('taskId', taskExist)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id no valid'),
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Id no valid'),
    body('name')
        .notEmpty().withMessage('Task name required'),
    body('description')
        .notEmpty().withMessage('Description required'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Id no valid'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Id no valid'),
    body('status')
        .notEmpty().withMessage('Status required'),
    handleInputErrors,
    TaskController.updateStatus
)


/**TEAMS */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no valid'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Id no valid'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID no valid'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)


/** NOTES */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('Content required'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Id no valid'),
    handleInputErrors,
    NoteController.deleteNote
)
export default router
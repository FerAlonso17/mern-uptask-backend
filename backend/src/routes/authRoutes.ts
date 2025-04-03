import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('Name required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password required'),
    body('password_confirmation').custom((value,{req})=>{
        if (value !==req.body.password) {
            throw new Error('The passwords are not the same')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('E-mail no valid'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('The token cannot be empty'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('E-mail no valid'),
    body('password')
        .notEmpty().withMessage('The password cannot be empty'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email').
        isEmail().withMessage('E-mail no valid'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email').
        isEmail().withMessage('E-mail no valid'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('The token cannot be empty'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token no valid'),
    body('password')
        .isLength({ min: 8 }).withMessage('The password is very short, minimum 8 characters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The passwords are not the same')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)


/** Profile */
router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('Name required'),
    body('email')
        .isEmail().withMessage('E-mail no valid'),
    handleInputErrors,
    AuthController.updateProfile
)

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('Password current required'),
    body('password')
        .isLength({ min: 8 }).withMessage('The password is very short, minimum 8 characters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The passwords are not the same')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('Password required'),
    handleInputErrors,
    AuthController.checkPassword
)

export default router
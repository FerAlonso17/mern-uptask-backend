import type { Request,Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../email/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {
    static createAccount = async (req:Request,res:Response)=>{
        try {
            const {password,email} = req.body

            const userExists = await User.findOne({email})
            if (userExists) {
                const error = new Error('The user already exists')
                res.status(409).json({error:error.message})
                return 
            }

            //crear un nuevo user
            const user = new User(req.body)
            //hashear pswd
            user.password = await hashPassword(password)
            //generar token
            // const token = new Token()
            // token.token= generateToken()
            // token.user = user.id
            const token = new Token({
                token: generateToken().token,
                user: user.id,
                expiresAt: generateToken().expiresAt
            });

            //Enviar correo
            AuthEmail.sendConfirmationEmail({
                email:user.email,
                name:user.name,
                token:token.token
            })

            await Promise.allSettled([user.save(),token.save()])
            res.send('Account created, check your email to confirm')
        } catch (error) {
            res.status(500).json({error:'There was an error'})
        }
    }

    static confirmAccount = async (req:Request,res:Response) => {
        try {
            const {token} = req.body
            const tokenExists = await Token.findOne({token})
            if (!tokenExists) {
                const error = new Error('Token no valid')
                res.status(404).json({error:error.message})
                return
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed=true

            await Promise.allSettled([user.save(),tokenExists.deleteOne()])
            res.send('Account comfirmed correctly, now you can log in')
        } catch (error) {
            res.status(500).json({error:'There was an error'})
        }
    }

    static login = async (req:Request,res:Response) => {
        try {
            const {email,password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                const error = new Error('User not found')
                res.status(404).json({error:error.message})
                return
            }

            if (!user.confirmed) {
                // const token = new Token()
                // token.user = user.id
                // token.token = generateToken()
                const token = new Token({
                    token: generateToken().token,
                    user: user.id,
                    expiresAt: generateToken().expiresAt
                });
                await token.save()

                // enviar el email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('The account has not been confirmed, we have sent a confirmation email')
                res.status(401).json({ error: error.message })
                return 
            }

            //revisar password
            const isPasswordCorrect = await checkPassword(password,user.password)
            if (!isPasswordCorrect) {
                const error = new Error('Password incorrect')
                res.status(401).json({error:error.message})
                return
            }

            const token = generateJWT({id:user.id})

            res.send(token)

        } catch (error) {
            res.status(500).json({error:'There was an error'})
        }
    }

    static requestConfirmationCode = async (req:Request,res:Response)=>{
        try {
            const {email} = req.body

            const user = await User.findOne({email})
            if (!user) {
                const error = new Error('The user no registred')
                res.status(404).json({error:error.message})
                return 
            }

            if (user.confirmed) {
                const error = new Error('The user is already confirmed')
                res.status(403).json({error:error.message})
                return 
            }

            //generar token
            // const token = new Token()
            // token.token= generateToken()
            // token.user = user.id
            const token = new Token({
                token: generateToken().token,
                user: user.id,
                expiresAt: generateToken().expiresAt
            });

            //Enviar correo
            AuthEmail.sendConfirmationEmail({
                email:user.email,
                name:user.name,
                token:token.token
            })

            await Promise.allSettled([user.save(),token.save()])
            res.send('A new token was send')
        } catch (error) {
            res.status(500).json({error:'There was an error'})
        }
    }

    static forgotPassword = async (req:Request,res:Response)=>{
        try {
            const {email} = req.body

            const user = await User.findOne({email})
            if (!user) {
                const error = new Error('The user no registred')
                res.status(404).json({error:error.message})
                return 
            }

            //generar token
            // const token = new Token()
            // token.token= generateToken()
            // token.user = user.id
            const token = new Token({
                token: generateToken().token,
                user: user.id,
                expiresAt: generateToken().expiresAt
            });
            await token.save()

            //Enviar correo
            AuthEmail.sendPasswordResetToken({
                email:user.email,
                name:user.name,
                token:token.token
            })

            res.send('Check your email for instructions')
        } catch (error) {
            res.status(500).json({error:'There was an error'})
        }
    }

    static validateToken = async (req:Request,res:Response) => {
        try {
            const {token} = req.body
            const tokenExists = await Token.findOne({token})
            if (!tokenExists) {
                const error = new Error('Token no valid')
                res.status(404).json({error:error.message})
                return
            }

            res.send('Token valid, define your new password')
        } catch (error) {
            res.status(500).json({error:'There was an error'})
        }
    }
    
    static updatePasswordWithToken = async (req:Request,res:Response) => {
        try {
            const {token} = req.params
            const tokenExists = await Token.findOne({token})
            if (!tokenExists) {
                const error = new Error('Token no valid')
                res.status(404).json({error:error.message})
                return
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(req.body.password)

            await Promise.allSettled([user.save(),tokenExists.deleteOne()])
            res.send('Password modified correctly')
        } catch (error) {
            res.status(500).json({error:'There was an error'})
        }
    }

    static user = async (req:Request,res:Response)=>{
        res.json(req.user)
        return 
    }

    static updateProfile = async (req:Request,res:Response)=>{
        const { name, email } = req.body

        const userExists = await User.findOne({email})
        if(userExists && userExists.id.toString() !== req.user.id.toString() ) {
            const error = new Error('That email is already registered')
            res.status(409).json({error: error.message})
            return 
        }

        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send('Perfil updated correctly')
        } catch (error) {
            res.status(500).send('There was an error')
        }    
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Password current incorrect')
            res.status(401).json({error: error.message})
            return 
        }

        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('The Password modified correctly')
        } catch (error) {
            res.status(500).send('There was an error')
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Password incorrect')
            res.status(401).json({error: error.message})
            return 
        }

        res.send('The Password modified correctly')

    } 
}
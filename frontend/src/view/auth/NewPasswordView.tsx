import { useState } from "react"
import NewPasswordToken from "../../components/auth/NewPasswordToken"
import { ConfirmToken } from "../../types"
import NewPasswordForm from "../../components/auth/NewPasswordForm"

export default function NewPasswordView() {

    const [token,setToken] = useState<ConfirmToken['token']>('')
    const [isValidToken,setIsValidToken] = useState(false)

    return (
        <>
            <h1 className="text-4xl font-black text-white">Reestablecer Password</h1>
            <p className="text-2xl font-light text-white mt-5">
                Ingresa el código que recibiste {''}
                <span className=" text-cyan-500 font-bold">por email</span>
            </p>

            {!isValidToken ? 
                <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken}  /> : 
                <NewPasswordForm token={token} />
            }
        </>
    )
}

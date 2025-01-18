"use client"
import { useForm } from "react-hook-form";

interface FormInput{
    repoUrl:string
    projectName: string
    githubToken?: string

}
export default function createPage(){
    const {register, handleSubmit, reset} = useForm<FormInput>();
    return(
        <div className='flex items-center gap-12 h-full justify-center'>
            <img src='/code-thinking.svg' alt='Image' width={10} height={10} className='h-40 w-auto animate-bounce'/>
           
        </div>
    )
}
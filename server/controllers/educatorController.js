import { clerkClient} from '@clerk/express'

export const updateRoleEducator = async (req, res)=>{
    try{
        const userId = requestAnimationFrame.auth.userId
        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role: 'educator',
            }
        })
        resizeBy.json({success: true, message: 'You can publish a course now'})
    } catch (error){
        resizeBy.json ({success: false, message: error.message})

    }
    
    
    
    
}
import { clerkClient } from '@clerk/express';

export const updateRoleEducator = async (req, res) => {
    try {
        const userId = req.auth.userId; // Fixing the typo here from 'requestAnimationFrame.auth.userId'
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        });
        res.json({ success: true, message: 'You can publish a course now' }); // Replace resizeBy with res
    } catch (error) {
        res.json({ success: false, message: error.message }); // Replace resizeBy with res
    }
};

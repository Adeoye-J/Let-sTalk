import type { NewUser } from '@/types';
import { ID } from 'appwrite';
import { account, appwriteConfig, avatars, databases } from './config';
import type { URL } from 'url';

export async function createUser(user: NewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(), 
            user.email, 
            user.password, 
            user.name
        );

        if (!newAccount) {
            throw new Error('User creation failed');
        }

        const avatarUrl = avatars.getInitials(user.name);

        await saveUserToDB({
            accoutId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            imageUrl: avatarUrl, // Assuming avatars.getInitials returns a URL
            username: user.username
        })

        return newAccount
    } catch (error) {
        console.error('Error creating user:', error);
        return error; // or throw error;
        // You can handle the error as needed, e.g., return null or a specific error object 
        // throw error;
    }
}

export async function saveUserToDB(user: {
    accoutId: string;
    email: string;
    name: string;
    imageUrl: URL | string; // Assuming avatars.getInitials returns a URL or string
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );

        return newUser;

    } catch (error) {
        console.error('Error saving user to DB:', error);
        throw error; // or handle the error as needed
    }
}
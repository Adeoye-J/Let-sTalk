import type { NewUser } from '@/types';
import { ID, Query } from 'appwrite';
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

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            imageUrl: avatarUrl, // Assuming avatars.getInitials returns a URL
            username: user.username
        })

        return newUser
    } catch (error) {
        console.error('Error creating user:', error);
        return error; // or throw error;
        // You can handle the error as needed, e.g., return null or a specific error object 
        // throw error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
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

export async function signInUser(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    } catch (error) {
        console.error('Error signing in user:', error);
        throw error; // or handle the error as needed
    }
}

export async function getCurrentUser() {
    try {
        const currentUser = await account.get();

        if (!currentUser) {
            throw new Error('No user is currently logged in');
        }

        // Fetching additional user data from the database
        const userData = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentUser.$id)],
        ); 

        if (!userData) {
            throw new Error('User data not found in the database');
        }

        return userData.documents[0];
        
        // If you want to merge the current user data with the database data, you can do so like this:
        // const userData = userData.documents[0];
        // if (userData) {
        //     return { ...currentUser, ...userData };
        // }
        // If you want to return the current user without merging, you can simply return it:
        // return currentUser;

    } catch (error) {
        console.error('Error getting current user:', error);
        throw error; // or handle the error as needed
    }
}

export async function signOutUser() {
    try {
        const session = await account.deleteSession("current")
        return session
    } catch (error) {
        console.log(error)
    }
}
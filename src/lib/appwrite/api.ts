import type { NewPost, NewUser, UpdatePost } from '@/types';
import { ID, ImageGravity, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases, storage } from './config';
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

export async function createPost(post: NewPost) {
    try {
        // upload post to appwrite storage
        const uploadedFile = await uploadFile(post.file[0])

        if(!uploadedFile){
            console.log(uploadedFile);
            throw new Error("File upload failed")
        }

        // Get file url
        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id)
            throw new Error("Unable to get file preview")
        }

        // Convert tags into an array
        const tags = post.tags?.replace(/ /g, "").split(",") || []

        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                 creator: post.userId,
                 caption: post.caption,
                 imageUrl: fileUrl,
                 imageId: uploadedFile.$id,
                 location: post.location,
                 tags: tags
            }
        )

        if (!newPost) {
            await deleteFile(uploadedFile.$id)
            throw new Error("An error occured creating the post")
        }

        return newPost

    } catch (error) {
        console.log(error)
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )

        return uploadedFile
    } catch (error) {
        console.log(error)
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            ImageGravity.Top,
            100
        )

        return fileUrl
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFile(fileId: string) {
    try {
        
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        )

        return { status: "ok" }
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
    )

    if(!posts) {
        throw new Error("Unable to get recent posts")
    }

    return posts
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )

        if (!updatedPost) {
            throw new Error("An error occured liking the post")
        }

        return updatedPost
    } catch (error) {
        console.log(error);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId,
            }
        )

        if (!updatedPost) {
            throw new Error("An error occured saving the post")
        }

        return updatedPost
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId,
        )

        if (!statusCode) {
            throw new Error("An error occured deleting the post")
        }

        return { status: "ok" }
    } catch (error) {
        console.log(error);
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return post
    } catch (error) {
        console.log(error);
        
    }
}

export async function updatePost(post: UpdatePost) {

    const hasFileToUpdate = post.file.length > 0

    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }

        if (hasFileToUpdate) {
            // upload post to appwrite storage
            const uploadedFile = await uploadFile(post.file[0])
    
            if(!uploadedFile){
                console.log(uploadedFile);
                throw new Error("File upload failed")
            }
    
            // Get file url
            const fileUrl = getFilePreview(uploadedFile.$id);
    
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id)
                throw new Error("Unable to get file preview")
            }

            image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
        }


        // Convert tags into an array
        const tags = post.tags?.replace(/ /g, "").split(",") || []

        // Save post to database
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                 caption: post.caption,
                 imageUrl: image.imageUrl,
                 imageId: image.imageId,
                 location: post.location,
                 tags: tags
            }
        )

        if (!updatedPost) {

            if (hasFileToUpdate) {
                await deleteFile(image.imageId)
            }
            throw new Error("An error occured updating the post")
        }

        return updatedPost

    } catch (error) {
        console.log(error)
    }
}

export async function deletePost(postId: string, imageId: string) {
    if (!postId || !imageId) {
        throw new Error("An error occured deleting the post")
    }

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return { status: "ok" }
    } catch (error) {
        console.log(error);
        
    }
}

export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) {
        throw new Error("An error occured getting the post")
    }

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) {
        throw new Error("An error occured getting the posts")
    }

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export type ContextType = {
    user: User;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
}

export type NaviLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type UpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type NewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type UpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
//   imageUrl: URL;
  imageUrl: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type NewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};
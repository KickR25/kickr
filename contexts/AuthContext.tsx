
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Post, Training } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  posts: Post[];
  trainings: Training[];
  addPost: (post: Omit<Post, 'id' | 'userId' | 'userName' | 'userAvatar' | 'timestamp' | 'likes' | 'comments' | 'shares'>) => Promise<void>;
  addTraining: (training: Omit<Training, 'id' | 'userId' | 'userName' | 'userAvatar' | 'timestamp' | 'likes' | 'comments' | 'saves'>) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  commentOnPost: (postId: string, content: string) => Promise<void>;
  sharePost: (postId: string) => Promise<void>;
  likeTraining: (trainingId: string) => Promise<void>;
  saveTraining: (trainingId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: '@kickr_users',
  CURRENT_USER: '@kickr_current_user',
  POSTS: '@kickr_posts',
  TRAININGS: '@kickr_trainings',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    loadCurrentUser();
    loadPosts();
    loadTrainings();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const postsJson = await AsyncStorage.getItem(STORAGE_KEYS.POSTS);
      if (postsJson) {
        const loadedPosts = JSON.parse(postsJson);
        // Convert timestamp strings back to Date objects
        const parsedPosts = loadedPosts.map((post: any) => ({
          ...post,
          timestamp: new Date(post.timestamp),
          comments: post.comments.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp),
          })),
        }));
        setPosts(parsedPosts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadTrainings = async () => {
    try {
      const trainingsJson = await AsyncStorage.getItem(STORAGE_KEYS.TRAININGS);
      if (trainingsJson) {
        const loadedTrainings = JSON.parse(trainingsJson);
        // Convert timestamp strings back to Date objects
        const parsedTrainings = loadedTrainings.map((training: any) => ({
          ...training,
          timestamp: new Date(training.timestamp),
          comments: training.comments.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp),
          })),
        }));
        setTrainings(parsedTrainings);
      }
    } catch (error) {
      console.error('Error loading trainings:', error);
    }
  };

  const savePosts = async (newPosts: Post[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts));
      setPosts(newPosts);
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  const saveTrainings = async (newTrainings: Training[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(newTrainings));
      setTrainings(newTrainings);
    } catch (error) {
      console.error('Error saving trainings:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(foundUser));
        setUser(foundUser);
        return { success: true };
      } else {
        return { success: false, error: 'Ungültige E-Mail oder Passwort' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ein Fehler ist aufgetreten' };
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if email already exists
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'E-Mail bereits registriert' };
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: role as any,
        friends: [],
        friendRequests: [],
      };

      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Ein Fehler ist aufgetreten' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...updates };
      
      // Update in users list
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
      
      // Update current user
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const addPost = async (postData: Omit<Post, 'id' | 'userId' | 'userName' | 'userAvatar' | 'timestamp' | 'likes' | 'comments' | 'shares'>) => {
    if (!user) {
      console.error('Cannot add post: No authenticated user');
      return;
    }

    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: new Date(),
      likes: [],
      comments: [],
      shares: 0,
    };

    const updatedPosts = [newPost, ...posts];
    await savePosts(updatedPosts);
  };

  const addTraining = async (trainingData: Omit<Training, 'id' | 'userId' | 'userName' | 'userAvatar' | 'timestamp' | 'likes' | 'comments' | 'saves'>) => {
    if (!user) {
      console.error('Cannot add training: No authenticated user');
      return;
    }

    const newTraining: Training = {
      ...trainingData,
      id: `training_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: new Date(),
      likes: [],
      comments: [],
      saves: [],
    };

    const updatedTrainings = [newTraining, ...trainings];
    await saveTrainings(updatedTrainings);
  };

  const likePost = async (postId: string) => {
    if (!user) {
      console.error('Cannot like post: No authenticated user');
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.id);
        return {
          ...post,
          likes: isLiked
            ? post.likes.filter(id => id !== user.id)
            : [...post.likes, user.id],
        };
      }
      return post;
    });

    await savePosts(updatedPosts);
  };

  const commentOnPost = async (postId: string, content: string) => {
    if (!user) {
      console.error('Cannot comment on post: No authenticated user');
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `comment_${Date.now()}`,
              userId: user.id,
              userName: user.name,
              userAvatar: user.avatar,
              content,
              timestamp: new Date(),
            },
          ],
        };
      }
      return post;
    });

    await savePosts(updatedPosts);
  };

  const sharePost = async (postId: string) => {
    if (!user) {
      console.error('Cannot share post: No authenticated user');
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          shares: post.shares + 1,
        };
      }
      return post;
    });

    await savePosts(updatedPosts);
  };

  const likeTraining = async (trainingId: string) => {
    if (!user) {
      console.error('Cannot like training: No authenticated user');
      return;
    }

    const updatedTrainings = trainings.map(training => {
      if (training.id === trainingId) {
        const isLiked = training.likes.includes(user.id);
        return {
          ...training,
          likes: isLiked
            ? training.likes.filter(id => id !== user.id)
            : [...training.likes, user.id],
        };
      }
      return training;
    });

    await saveTrainings(updatedTrainings);
  };

  const saveTraining = async (trainingId: string) => {
    if (!user) {
      console.error('Cannot save training: No authenticated user');
      return;
    }

    const updatedTrainings = trainings.map(training => {
      if (training.id === trainingId) {
        const isSaved = training.saves.includes(user.id);
        return {
          ...training,
          saves: isSaved
            ? training.saves.filter(id => id !== user.id)
            : [...training.saves, user.id],
        };
      }
      return training;
    });

    await saveTrainings(updatedTrainings);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        posts,
        trainings,
        addPost,
        addTraining,
        likePost,
        commentOnPost,
        sharePost,
        likeTraining,
        saveTraining,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

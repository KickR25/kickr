
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Post, Training } from '@/types';
import { supabase } from '@/app/integrations/supabase/client';
import { Alert } from 'react-native';

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
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        const loadedUser: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          avatar: profile.avatar,
          coverImage: profile.cover_image,
          bio: profile.bio,
          location: profile.location,
          friends: [],
          friendRequests: [],
          adminLevel: profile.admin_level,
        };
        setUser(loadedUser);
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(loadedUser));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadCurrentUser = async () => {
    try {
      // Check Supabase session first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        // Fallback to local storage
        const userJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
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
      console.log('Attempting login for:', email);
      
      // Try Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        
        // Check if email is not confirmed
        if (error.message.includes('Email not confirmed')) {
          return { 
            success: false, 
            error: 'E-Mail nicht bestätigt.\n\nDeine E-Mail-Adresse muss bestätigt werden, bevor du dich anmelden kannst.\n\nBitte überprüfe deinen Posteingang (auch Spam-Ordner) und klicke auf den Bestätigungslink.\n\nFalls du keine E-Mail erhalten hast, kontaktiere bitte den Support.' 
          };
        }
        
        // Check for invalid credentials
        if (error.message.includes('Invalid login credentials')) {
          return { 
            success: false, 
            error: 'Ungültige Anmeldedaten.\n\nBitte überprüfe deine E-Mail-Adresse und dein Passwort.' 
          };
        }
        
        return { success: false, error: error.message || 'Login fehlgeschlagen' };
      }

      if (data.user) {
        console.log('Login successful, loading profile...');
        await loadUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Login fehlgeschlagen' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Ein Fehler ist aufgetreten' };
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Attempting registration for:', email);
      
      // Try Supabase registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
          emailRedirectTo: 'https://natively.dev/email-confirmed',
        },
      });

      // Handle errors
      if (error) {
        console.error('Supabase registration error:', error);
        
        // Check if user already exists
        if (error.message.includes('User already registered')) {
          return { 
            success: false, 
            error: 'Diese E-Mail-Adresse ist bereits registriert.\n\nBitte melde dich an oder verwende eine andere E-Mail-Adresse.' 
          };
        }
        
        // If it's an email sending error, we still want to proceed
        if (error.message.includes('Error sending confirmation email')) {
          console.log('Email sending failed, but user may have been created');
          
          // Show a helpful message to the user
          Alert.alert(
            'Registrierung teilweise erfolgreich',
            'Dein Account wurde möglicherweise erstellt, aber wir konnten keine Bestätigungs-E-Mail senden.\n\n' +
            '⚠️ WICHTIG: Die E-Mail-Bestätigung ist derzeit nicht konfiguriert.\n\n' +
            'Bitte kontaktiere den Administrator unter:\n' +
            'tomsc.rp@gmail.com\n\n' +
            'Der Administrator muss:\n' +
            '1. Die E-Mail-Bestätigung in Supabase deaktivieren ODER\n' +
            '2. SMTP-Einstellungen konfigurieren\n\n' +
            'Danach kannst du dich anmelden.',
            [{ text: 'OK' }]
          );
          
          return { 
            success: false, 
            error: 'E-Mail-Bestätigung fehlgeschlagen. Bitte kontaktiere den Administrator.' 
          };
        }
        
        // For other errors, return them
        return { success: false, error: error.message || 'Registrierung fehlgeschlagen' };
      }

      if (data.user) {
        console.log('User created in auth.users:', data.user.id);
        
        // Create profile in Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            role,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail registration if profile creation fails
          // The user can still complete their profile later
        } else {
          console.log('Profile created successfully');
        }

        // Check if email confirmation is required
        if (data.session) {
          // User is automatically logged in (email confirmation disabled)
          console.log('User automatically logged in - email confirmation is disabled');
          await loadUserProfile(data.user.id);
          Alert.alert(
            'Willkommen bei KickR! ⚽',
            'Dein Account wurde erfolgreich erstellt und du bist jetzt angemeldet.',
            [{ text: 'Los geht\'s!' }]
          );
        } else {
          // Email confirmation required
          console.log('Email confirmation required');
          Alert.alert(
            'Registrierung erfolgreich! 📧',
            'Bitte überprüfe deine E-Mail und bestätige deine Adresse, um dich anzumelden.\n\n' +
            '✉️ Wir haben dir eine Bestätigungs-E-Mail gesendet.\n\n' +
            '⚠️ Falls du keine E-Mail erhältst:\n' +
            '• Überprüfe deinen Spam-Ordner\n' +
            '• Kontaktiere den Support: tomsc.rp@gmail.com\n\n' +
            'Hinweis: Die E-Mail-Bestätigung muss vom Administrator konfiguriert werden.',
            [{ text: 'Verstanden' }]
          );
        }
        
        return { success: true };
      }

      return { success: false, error: 'Registrierung fehlgeschlagen' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Ein Fehler ist aufgetreten' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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
      
      // Update in Supabase if authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: updatedUser.name,
            avatar: updatedUser.avatar,
            cover_image: updatedUser.coverImage,
            bio: updatedUser.bio,
            location: updatedUser.location,
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating profile in Supabase:', error);
        }
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

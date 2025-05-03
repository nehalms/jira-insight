import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Types
interface User {
    email: string;
    client_id: string;
    client_secret: string;
    jira_url: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Helper function to get initial state from cookies
const getInitialState = (): AuthState => {
    const userCookie = Cookies.get('user');
    const jiraCredentialsCookie = Cookies.get('jira_credentials');

    return {
        user: userCookie ? JSON.parse(userCookie) : null,
        isAuthenticated: !!userCookie,
        loading: false,
        error: null,
    };
};

// Initial state
const initialState: AuthState = getInitialState();

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', credentials);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

// export const logout = createAsyncThunk(
//     'auth/logout',
//     async (_, { rejectWithValue }) => {
//         try {
//             // Clear cookies
//             Cookies.remove('user');
//             Cookies.remove('jira_credentials');
//             return null;
//         } catch (error: any) {
//             return rejectWithValue('Logout failed');
//         }
//     }
// );

// Create slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            // Clear cookies
            Cookies.remove('user');
            Cookies.remove('jira_credentials');
        }
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;

                // Store user data in cookies
                Cookies.set('user', JSON.stringify(action.payload.user), {
                    secure: true,
                    sameSite: 'strict',
                    expires: 7 // Cookie expires in 7 days
                });

                // Store Jira credentials separately
                const jiraCredentials = {
                    client_id: action.payload.user.client_id,
                    client_secret: action.payload.user.client_secret,
                    jira_url: action.payload.user.jira_url
                };
                Cookies.set('jira_credentials', JSON.stringify(jiraCredentials), {
                    secure: true,
                    sameSite: 'strict',
                    expires: 7
                });
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

        // // Logout cases
        // .addCase(logout.pending, (state) => {
        //     state.loading = true;
        // })
        // .addCase(logout.fulfilled, (state) => {
        //     state.loading = false;
        //     state.isAuthenticated = false;
        //     state.user = null;
        // })
        // .addCase(logout.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload as string;
        // });
    },
});

// Export actions and reducer
export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer; 
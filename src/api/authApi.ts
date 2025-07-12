import { apiSlice } from "@/store/apiSlice";

const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{ token: string, user: any }, { email: string, password: string }>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                data: credentials
            }),
            invalidatesTags: ["Auth"]
        }),
        register: builder.mutation<{ user_id: string }, { name: string, email: string, password: string, role: "candidate" | "recruiter" }>({
            query: (credentials) => ({
                url: "/auth/register",
                method: 'POST',
                data: credentials
            }),
            invalidatesTags: ["Auth"]
        }),
        logout: builder.mutation<void, void>({
            query: () => ({ url: "/auth/logout", method: 'POST' }),
            invalidatesTags: ["Auth"]
        })
    })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } = authApi
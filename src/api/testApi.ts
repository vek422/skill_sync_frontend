import { apiSlice } from "@/store/apiSlice";

// TypeScript interfaces for API request and response
// These match your backend API format exactly
export interface CreateTestRequest {
  test_name: string;              // Backend expects snake_case
  job_description: string;
  resume_score_threshold?: number;
  max_shortlisted_candidates?: number;
  auto_shortlist: boolean;
  total_questions?: number;
  time_limit_minutes?: number;
  total_marks?: number;
}

export interface CreateTestResponse {
  test_id: number;
  test_name: string;
  job_description: string;
  resume_score_threshold?: number;
  max_shortlisted_candidates?: number;
  auto_shortlist: boolean;
  total_questions?: number;
  time_limit_minutes?: number;
  total_marks?: number;
  created_at: string;
  updated_at: string;
  recruiter_id: number;
}

// Update the response interface to match actual API response
export interface GetTestsResponse {
  tests: Test[];
  total: number;
  page: number;
  per_page: number;
}

// Update the Test interface to match the actual server response
export interface Test {
  test_id: number;
  test_name: string;
  status: string;
  is_published: boolean;
  created_by: number;
  creator_name: string;
  created_at: string;
  scheduled_at: string | null;
  // Optional fields that might be present
  job_description?: string;
  resume_score_threshold?: number;
  max_shortlisted_candidates?: number;
  auto_shortlist?: boolean;
  total_questions?: number;
  time_limit_minutes?: number;
  total_marks?: number;
  updated_at?: string;
  recruiter_id?: number;
}

const testApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create new test mutation
    createTest: builder.mutation<CreateTestResponse, CreateTestRequest>({
      query: (testData) => ({
        url: '/tests/', 
        method: 'POST',
        data: testData
      }),
      invalidatesTags: ["Tests"]
    }),

    // Get tests created by current recruiter only - backend filters by auth token
    getTests: builder.query<Test[], { page?: number; per_page?: number }>({
      query: ({ page = 1, per_page = 100 } = {}) => ({
        url: `/tests/?skip=${(page - 1) * per_page}&limit=${per_page}`,  // Backend automatically filters by current user
        method: 'GET'
      }),
      providesTags: ["Tests"]
    }),

    // Get single test by ID (for future use)
    getTestById: builder.query<Test, number>({
      query: (testId) => ({
        url: `/tests/${testId}`,
        method: 'GET'
      }),
      providesTags: ["Tests"]
    }),

    // Update test (for future use)
    updateTest: builder.mutation<CreateTestResponse, { testId: number; testData: Partial<CreateTestRequest> }>({
      query: ({ testId, testData }) => ({
        url: `/tests/${testId}`,
        method: 'PUT',
        data: testData
      }),
      invalidatesTags: ["Tests"]
    }),


    // Update skill graph distribution
    updateSkillGraph: builder.mutation<any, { test_id: number; total_questions: number; high: number; medium: number; low: number }>({
      query: ({ test_id, total_questions, high, medium, low }) => {
        const body = { total_questions, high, medium, low };
        console.log('[updateSkillGraph] Sending body:', body);
        return {
          url: `/tests/${test_id}/update-skill-graph`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: ["Tests"]
    }),

    // Delete test mutation
    deleteTest: builder.mutation<any, number>({
      query: (testId) => ({
        url: `/tests/${testId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Tests"]
    })
  })
});

// Export hooks for use in components (follows your authApi pattern exactly)
export const { 
  useCreateTestMutation,
  useGetTestsQuery,
  useGetTestByIdQuery,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useUpdateSkillGraphMutation
} = testApi;
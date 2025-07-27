// Bulk add shortlisted candidates to assessments
export interface BulkAssessmentResponse {
  test_id: number;
  shortlisted_count: number;
  message: string;
}

import { apiSlice } from "@/store/apiSlice";

export interface AddCandidateToAssessmentRequest {
  test_id: number;
  candidate_id: number;
}

export interface AddCandidateToAssessmentResponse {
  success: boolean;
  message: string;
}

// ...existing code...



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
  assessment_deadline?: string;
  application_deadline?: string;
  parsed_job_description?: {
    question_distribution?: {
      low: number;
      medium: number;
      high: number;
    };
    [key: string]: any;
  };
  skill_graph?: {
    root_nodes?: any[];
    [key: string]: any;
  };
}

const testApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Bulk add shortlisted candidates to assessments
    bulkAddShortlistedToAssessments: builder.mutation<BulkAssessmentResponse, number>({
      query: (testId) => ({
        url: `/tests/${testId}/shortlisted/assessments`,
        method: 'POST',
      }),
      invalidatesTags: ["Candidates"],
    }),
    // Delete test by ID
    deleteTest: builder.mutation<{ success: boolean }, number>({
      query: (testId) => ({
        url: `/tests/${testId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Tests"]
    }),
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
      query: ({ testId, testData }) => {
        // Only send allowed fields for update
        const allowedFields = [
          'job_description',
          'resume_score_threshold',
          'max_shortlisted_candidates',
          'auto_shortlist'
        ];
        const filteredData: Partial<CreateTestRequest> = {};
        for (const key of allowedFields) {
          if (key in testData) filteredData[key] = testData[key];
        }
        return {
          url: `/tests/${testId}`,
          method: 'PUT',
          data: filteredData
        };
      },
      invalidatesTags: ["Tests"]
    }),


    // Update skill graph distribution
    updateSkillGraph: builder.mutation<any, { test_id: number; total_questions: number; high: number; medium: number; low: number }>({
      query: ({ test_id, total_questions, high, medium, low }) => {
        const data = { total_questions, high, medium, low };
        console.log('[updateSkillGraph] Sending data:', data);
        return {
          url: `/tests/${test_id}/update-skill-graph`,
          method: 'PUT',
          data
        };
      },
      invalidatesTags: ["Tests"]
    }),


    // Schedule test mutation
    scheduleTest: builder.mutation<any, { testId: number; data: { scheduled_at: string; application_deadline?: string; assessment_deadline?: string } }>({
      query: ({ testId, data }) => ({
        url: `/tests/${testId}/schedule`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ["Tests"]
    })
    ,
    // Add single candidate to assessment (shortlist)
    addCandidateToAssessment: builder.mutation<AddCandidateToAssessmentResponse, AddCandidateToAssessmentRequest>({
      query: ({ test_id, candidate_id }) => ({
        url: `/tests/${test_id}/assessment/add-candidate?candidate_id=${candidate_id}`,
        method: "POST",
      }),
      invalidatesTags: ["Candidates"],
    })
  })
});

// Export hooks for use in components (follows your authApi pattern exactly)
export const { 
  useCreateTestMutation,
  useGetTestsQuery,
  useGetTestByIdQuery,
  useUpdateTestMutation,
  useUpdateSkillGraphMutation,
  useScheduleTestMutation,
  useDeleteTestMutation,
  useAddCandidateToAssessmentMutation,
  useBulkAddShortlistedToAssessmentsMutation
} = testApi;
import { apiSlice } from '@/store/apiSlice';

export interface Log {
  id: number;
  timestamp: string;
  action: string;
  status: string;
  details: string;
  user: string;
  entity: string | null;
  source: string;
}

export interface FetchLogsParams {
  skip?: number;
  limit?: number;
  user?: string;
  action?: string;
  status?: string;
  entity?: string;
  source?: string;
}

const extendedLogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query<Log[], FetchLogsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });
        if (!searchParams.has('skip')) searchParams.append('skip', '0');
        if (!searchParams.has('limit')) searchParams.append('limit', '50');
        return { url: `/logs?${searchParams.toString()}`, method: 'GET' };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map((l) => ({ type: 'Logs' as const, id: l.id })),
            { type: 'Logs' as const, id: 'LIST' },
          ]
          : [{ type: 'Logs' as const, id: 'LIST' }],
    }),
  }),
});

export const { useGetLogsQuery } = extendedLogsApi;

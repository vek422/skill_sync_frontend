import React, { useState } from 'react';
import { useGetCandidatesQuery, useGetCandidateTestsQuery } from '../../api/candidatesApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CandidatesPage: React.FC = () => {
  const { data: candidates = [], isLoading } = useGetCandidatesQuery();
  const [selectedCandidate, setSelectedCandidate] = useState<null | { user_id: number; name: string }>();
  const [search, setSearch] = useState('');

  const {
    data: tests = [],
    isLoading: testsLoading,
  } = useGetCandidateTestsQuery(selectedCandidate?.user_id!, {
    skip: !selectedCandidate,
  });

  const filteredCandidates = search
    ? candidates.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      )
    : candidates;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="border-muted shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">👤 Candidates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            placeholder="🔍 Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <div className="divide-y">
            {isLoading ? (
              [...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded" />)
            ) : filteredCandidates.length === 0 ? (
              <p className="text-muted-foreground text-center mt-4">No candidates found.</p>
            ) : (
              filteredCandidates.map((candidate) => (
                <div
                  key={candidate.user_id}
                  className="flex items-center justify-between py-4 cursor-pointer hover:bg-muted/50 transition rounded"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div>
                    <div className="font-semibold text-lg">{candidate.name}</div>
                    <div className="text-muted-foreground text-sm">{candidate.email}</div>
                  </div>
                  <Badge variant="outline">{candidate.role}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tests for {selectedCandidate?.name}</DialogTitle>
          </DialogHeader>
          {testsLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
            </div>
          ) : tests.length === 0 ? (
            <p className="text-muted-foreground">No tests found for this candidate.</p>
          ) : (
            <div className="space-y-2">
              {tests.map((test) => (
                <Card key={test.test_id} className="p-3 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{test.test_name}</div>
                      <div className="text-xs text-muted-foreground">Status: {test.status}</div>
                    </div>
                    <Badge variant="secondary">{new Date(test.scheduled_at).toLocaleDateString()}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidatesPage;

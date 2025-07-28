import React, { useState } from 'react';
import { useGetLogsQuery } from '../api/logsApi';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const LogPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: logs = [], isLoading } = useGetLogsQuery({ limit: 1000 });
  React.useEffect(() => {
    console.log('Logs API response:', logs);
  }, [logs]);

  const filteredLogs = search
    ? logs.filter((log) =>
        [log.action, log.status, log.user, log.entity, log.source, log.details]
          .some((field) => {
            if (typeof field === 'string') {
              return field.toLowerCase().includes(search.toLowerCase());
            }
            return false;
          })
      )
    : logs;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card className="border-muted shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">🧾 System Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            placeholder="🔍 Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

          <div className="space-y-4">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            ) : filteredLogs.length === 0 ? (
              <p className="text-muted-foreground text-center mt-4">No logs found.</p>
            ) : (
              filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300',
                    'flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                    <h3 className="font-semibold text-lg text-primary">{log.action}</h3>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">Details:</span>{' '}
                      {log.details}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1 mt-2 sm:mt-0 text-sm">
                    <Badge variant="secondary" className="w-fit">
                      👤 User: {log.user}
                    </Badge>
                    <Badge variant="outline" className="w-fit">
                      🧾 Entity: {log.entity ?? '-'}
                    </Badge>
                    <Badge variant="outline" className="w-fit">
                      🌐 Source: {log.source}
                    </Badge>
                    <Badge
                      variant={
                        log.status.toLowerCase() === 'done'
                          ? 'destructive'
                          : 'default'
                      }
                      className="mt-1 w-fit capitalize"
                    >
                      ✅ Status: {log.status}
                    </Badge>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogPage;

import { Users } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';

const OnlineUsersIndicator = () => {
  const { onlineCount } = useOnlineUsers();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 backdrop-blur border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <Users className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">
        {onlineCount} {onlineCount === 1 ? 'visitor' : 'visitors'} online
      </span>
    </div>
  );
};

export default OnlineUsersIndicator;

import { format, formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Eye } from 'lucide-react';

interface BlogMetaProps {
  viewCount: number;
  publishedAt?: string | null;
  className?: string;
}

export function BlogMeta({ viewCount, publishedAt, className = '' }: BlogMetaProps) {
  if (!publishedAt) return null;
  
  const publishedDate = new Date(publishedAt);
  const formattedDate = format(publishedDate, 'MMM d, yyyy');
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
  const timeString = format(publishedDate, 'h:mm a');
  const fullDateTime = `${formattedDate} at ${timeString} (${timeAgo})`;

  return (
    <div className={`flex items-center gap-3 text-xs sm:text-base text-muted-foreground ${className}`}>
      {/* View Count */}
      <div className="flex items-center gap-1">
       <Eye size={16} />
        <span className="font-medium">{viewCount.toLocaleString()}</span>
      </div>
      
      {/* Published Date */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <Calendar size={16} />
              <span className="font-medium">{formattedDate}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <div className="space-y-1">
              <p>Published {fullDateTime}</p>
              <p className="text-muted-foreground">{viewCount.toLocaleString()} total views</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

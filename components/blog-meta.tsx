import { format, formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <div className={`flex items-center gap-3 text-xs text-muted-foreground ${className}`}>
      {/* View Count */}
      <div className="flex items-center gap-1">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-3 h-3 opacity-70"
        >
          <path d="M2 12s3-7.5 10-7.5 10 7.5 10 7.5-3 7.5-10 7.5S2 12 2 12Z"></path>
          <circle cx="12" cy="12" r="2.5"></circle>
        </svg>
        <span className="font-medium">{viewCount.toLocaleString()}</span>
      </div>
      
      {/* Published Date */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-3 h-3 opacity-70"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
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

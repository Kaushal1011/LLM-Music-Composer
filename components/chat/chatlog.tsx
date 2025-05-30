import { cn } from '@/lib/utils';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ChatLog({ messages, className }: { messages: any[]; className?: string }) {
	return (
		<div className={cn('space-y-2 text-sm', className)}>
			{messages.map((m, i) => (
				<p key={i} className={m.role === 'user' ? 'text-primary' : 'text-muted-foreground'}>
					<strong>{m.role === 'user' ? 'You' : 'AI'}:</strong> {m.text}
				</p>
			))}
		</div>
	);
}

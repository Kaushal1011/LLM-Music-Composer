import React from 'react';
import Link from 'next/link';

type Post = {
	id: number;
	title: string;
	url?: string;
	by: string;
	time: number;
	score: number;
	descendants: number;
	text?: string;
	comments?: Comment[];
};

type Comment = {
	id: number;
	by: string;
	time: number;
	text: string;
	kids?: Comment[];
};

function timeAgo(unix: number) {
	const diff = Math.floor((Date.now() / 1000 - unix) / 60);
	if (diff < 60) return `${diff} minutes ago`;
	if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
	return `${Math.floor(diff / 1440)} days ago`;
}

const mockPost: Post = {
	id: 123,
	title: 'Example Hacker News Post',
	url: 'https://example.com',
	by: 'user123',
	time: Math.floor(Date.now() / 1000) - 3600,
	score: 120,
	descendants: 3,
	text: 'This is an example post content.',
	comments: [
		{
			id: 1,
			by: 'commenter1',
			time: Math.floor(Date.now() / 1000) - 1800,
			text: 'Great post!',
			kids: [
				{
					id: 2,
					by: 'commenter2',
					time: Math.floor(Date.now() / 1000) - 1200,
					text: 'I agree!',
				},
			],
		},
		{
			id: 3,
			by: 'commenter3',
			time: Math.floor(Date.now() / 1000) - 900,
			text: 'Thanks for sharing.',
		},
	],
};

function CommentThread({ comment }: { comment: Comment }) {
	return (
		<div style={{ marginLeft: 16, marginTop: 8 }}>
			<div style={{ fontSize: 14, color: '#555' }}>
				<b>{comment.by}</b> {timeAgo(comment.time)}
			</div>
			<div dangerouslySetInnerHTML={{ __html: comment.text }} />
			{comment.kids && comment.kids.map((kid) => <CommentThread key={kid.id} comment={kid} />)}
		</div>
	);
}

export default function PostPage() {
	const post = mockPost;

	return (
		<main style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
			<h1 style={{ fontSize: 28, marginBottom: 8 }}>
				{post.url ? (
					<a href={post.url} target="_blank" rel="noopener noreferrer">
						{post.title}
					</a>
				) : (
					post.title
				)}
			</h1>
			<div style={{ color: '#888', fontSize: 15, marginBottom: 16 }}>
				{post.score} points by {post.by} | {timeAgo(post.time)} | <Link href="/">Back to list</Link>
			</div>
			{post.text && (
				<div
					style={{
						background: '#f6f6ef',
						padding: 16,
						borderRadius: 6,
						marginBottom: 24,
					}}
					dangerouslySetInnerHTML={{ __html: post.text }}
				/>
			)}
			<h2 style={{ fontSize: 20, marginBottom: 12 }}>{post.descendants} Comments</h2>
			<section>
				{post.comments && post.comments.length > 0 ? (
					post.comments.map((comment) => <CommentThread key={comment.id} comment={comment} />)
				) : (
					<div>No comments yet.</div>
				)}
			</section>
		</main>
	);
}

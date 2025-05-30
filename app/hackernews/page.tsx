import React from 'react';

const mockStories = [
	{
		id: 1,
		title: 'Example Story 1',
		url: '#',
		points: 120,
		author: 'alice',
		time: '1 hour ago',
		comments: 42,
	},
	{
		id: 2,
		title: 'Another Interesting Article',
		url: '#',
		points: 98,
		author: 'bob',
		time: '2 hours ago',
		comments: 30,
	},
	{
		id: 3,
		title: 'Yet Another Post',
		url: '#',
		points: 75,
		author: 'carol',
		time: '3 hours ago',
		comments: 15,
	},
];

export default function HackerNewsPage() {
	return (
		<div style={{ fontFamily: 'sans-serif', background: '#f6f6ef', minHeight: '100vh' }}>
			<header style={{ background: '#ff6600', padding: '10px 0', marginBottom: 20 }}>
				<div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
					<span
						style={{
							background: '#fff',
							color: '#ff6600',
							fontWeight: 'bold',
							padding: '2px 8px',
							borderRadius: 3,
							marginRight: 10,
							fontSize: 20,
						}}
					>
						HN
					</span>
					<span style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Hacker News (Clone)</span>
				</div>
			</header>
			<main style={{ maxWidth: 800, margin: '0 auto' }}>
				<ol style={{ padding: 0, margin: 0 }}>
					{mockStories.map((story, idx) => (
						<li
							key={idx}
							style={{
								display: 'flex',
								alignItems: 'flex-start',
								padding: '12px 0',
								borderBottom: '1px solid #eee',
								listStyle: 'decimal inside',
							}}
						>
							<div style={{ flex: 1 }}>
								<a href={story.url} style={{ fontWeight: 'bold', color: '#222', textDecoration: 'none' }}>
									{story.title}
								</a>
								<div style={{ fontSize: 13, color: '#828282', marginTop: 4 }}>
									{story.points} points by {story.author} | {story.time} | {story.comments} comments
								</div>
							</div>
						</li>
					))}
				</ol>
			</main>
		</div>
	);
}

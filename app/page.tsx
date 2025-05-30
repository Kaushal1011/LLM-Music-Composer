'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
	const router = useRouter();

	const handleGetStarted = useCallback(() => {
		router.push('/dashboard');
	}, [router]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<CardTitle className="text-3xl font-bold text-center">Welcome to LLM Composer</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-6">
					<p className="text-gray-600 text-center">
						Effortlessly compose top melodies for your music compositions using LLMs.
					</p>
					<Button size="lg" onClick={handleGetStarted} className="w-full" aria-label="Start composing">
						Get Started
					</Button>
				</CardContent>
			</Card>
			<footer className="mt-8 text-gray-400 text-sm text-center">
				© {new Date().getFullYear()} Kaushal Patil. All rights reserved.
			</footer>
		</main>
	);
}

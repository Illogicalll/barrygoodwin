import type { Project } from '$lib/types';
import { json } from '@sveltejs/kit';

async function getProjects(): Promise<Project[]> {
	let projects: Project[] = [];
	const paths = import.meta.glob('/src/projects/*/*.json', { eager: true });

	for (const path in paths) {
		const file = paths[path] as { title: string; date: string }; // Ensure the structure matches
		if (file.title && file.date) {
			projects.push({ title: file.title, date: file.date });
		}
	}

	projects = projects.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return projects;
}

export async function GET() {
	const projects = await getProjects();
	return json(projects);
}

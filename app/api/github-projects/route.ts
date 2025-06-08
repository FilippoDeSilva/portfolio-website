import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const githubUsername = 'FilippoDeSilva';
  const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`, {
    headers: {
      'Accept': 'application/vnd.github+json',
    },
  });
  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch repos' }, { status: response.status });
  }
  const data = await response.json();
  // Filter out forked repos and unwanted repos by name
  const excludedNames = [
    "Class-Unity",
    "FilippoDeSilva",
    "wlext",
    "dotfiles"
  ];
  const filtered = data.filter((repo: any) => !repo.fork && !excludedNames.includes(repo.name));
  // Map to include only relevant fields, including stars, forks, etc.
  const mapped = filtered.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    homepage: repo.homepage,
    topics: repo.topics,
    stargazers_count: repo.stargazers_count, // likes
    forks_count: repo.forks_count,
    watchers_count: repo.watchers_count,
    language: repo.language,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    owner: {
      login: repo.owner.login,
      avatar_url: repo.owner.avatar_url,
    },
  }));
  return NextResponse.json(mapped);
}

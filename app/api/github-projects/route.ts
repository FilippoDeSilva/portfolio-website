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
    "portfolio-website",
    "dotfiles",
    "Next.js-Docs"
  ];
  const filtered = data.filter((repo: any) => !repo.fork && !excludedNames.includes(repo.name));
  // Map to include only relevant fields, including stars, forks, etc.
  const mapped = filtered.map((repo: any) => {
    const isDeployed = repo.homepage && repo.homepage !== '' && repo.homepage !== '#';
    const projectImage = isDeployed
      ? `https://api.microlink.io/?url=${encodeURIComponent(repo.homepage)}&screenshot=true&meta=false&embed=screenshot.url`
      : `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`;
    console.log('[Project Mapping]', {
      name: repo.name,
      homepage: repo.homepage,
      isDeployed,
      projectImage,
      githubOgImage: `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`
    });
    return {
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
      image: projectImage,
    };
  });
  console.log('[API] Returning mapped projects:', mapped.map((p: any) => ({ name: p.name, image: p.image, homepage: p.homepage })));
  return NextResponse.json(mapped);
}

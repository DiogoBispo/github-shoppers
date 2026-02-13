import { AppError } from "./errors";

type GithubUser = {
  login: string;
};

export async function getRandomGithubLogin(): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch("https://api.github.com/users", {
      method: "GET",
      headers: {
        "User-Agent": "github-shoppers",
        Accept: "application/vnd.github+json",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new AppError({
        status: 502,
        code: "INTERNAL_ERROR",
        message: "Falha ao consultar GitHub API.",
      });
    }

    const users = (await res.json()) as GithubUser[];

    if (!Array.isArray(users) || users.length === 0) {
      throw new AppError({
        status: 502,
        code: "INTERNAL_ERROR",
        message: "GitHub API retornou lista vazia.",
      });
    }

    const idx = Math.floor(Math.random() * users.length);
    const user = users[idx];

    if (!user || !user.login) {
      throw new AppError({
        status: 502,
        code: "INTERNAL_ERROR",
        message: "GitHub API retornou usuário inválido.",
      });
    }

    return user.login;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError({
      status: 502,
      code: "INTERNAL_ERROR",
      message: "Erro ao integrar com GitHub API.",
    });
  } finally {
    clearTimeout(timeout);
  }
}

import { env } from "./config";

interface GitHubFile {
  name: string;
  path: string;
  sha?: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
}

interface GitHubUploadResponse {
  content: GitHubFile;
  commit: {
    sha: string;
    url: string;
  };
}

export class GitHubStorage {
  private owner: string;
  private repo: string;
  private token: string;
  private branch: string;

  constructor() {
    this.owner =
      ((process.env.NODE_ENV === "production"
        ? process.env.GITHUB_OWNER
        : env.GITHUB_OWNER) as string) || "";
    this.repo =
      ((process.env.NODE_ENV === "production"
        ? process.env.GITHUB_REPO
        : env.GITHUB_REPO) as string) || "";
    this.token =
      ((process.env.NODE_ENV === "production"
        ? process.env.GITHUB_TOKEN
        : env.GITHUB_TOKEN) as string) || "";
    this.branch =
      ((process.env.NODE_ENV === "production"
        ? process.env.GITHUB_BRANCH
        : env.GITHUB_BRANCH) as string) || "main";
  }

  private getApiUrl(path: string): string {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`;
    console.log(url);
    return url;
  }

  private getFileUrl(path: string): string {
    return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`;
  }

  async uploadFile(
    file: File,
    folder: string
  ): Promise<{ url: string; path: string }> {
    if (!this.token || !this.owner || !this.repo) {
      throw new Error(
        "GitHub configuration is missing. Please set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN environment variables."
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Content = Buffer.from(arrayBuffer).toString("base64");

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}.${extension}`;
    const path = `uploads/${folder}/${filename}`;

    try {
      const response = await fetch(this.getApiUrl(path), {
        method: "PUT",
        headers: {
          Authorization: `token ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload ${file.name}`,
          content: base64Content,
          branch: this.branch,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`GitHub API error: ${error.message}`);
      }

      const data: GitHubUploadResponse = await response.json();

      return {
        url: this.getFileUrl(path),
        path: path,
      };
    } catch (error) {
      console.error("GitHub upload error:", error);
      throw new Error(
        `Failed to upload file to GitHub: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.token || !this.owner || !this.repo) {
      throw new Error("GitHub configuration is missing");
    }

    try {
      // First, get the file to obtain its SHA
      const getResponse = await fetch(this.getApiUrl(path), {
        headers: {
          Authorization: `token ${this.token}`,
        },
      });

      if (!getResponse.ok) {
        throw new Error("File not found");
      }

      const fileData = await getResponse.json();

      // Delete the file
      const deleteResponse = await fetch(this.getApiUrl(path), {
        method: "DELETE",
        headers: {
          Authorization: `token ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Delete ${path}`,
          sha: fileData.sha,
          branch: this.branch,
        }),
      });

      if (!deleteResponse.ok) {
        const error = await deleteResponse.json();
        throw new Error(`GitHub API error: ${error.message}`);
      }
    } catch (error) {
      console.error("GitHub delete error:", error);
      throw new Error(
        `Failed to delete file from GitHub: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export interface GitHubReleasesStats {
    files: GitHubReleasesStatsFile[];
    versionNumber: string;
    versionName: string;
    versionBody: string;
    versionPublishedAtDate: Date;
    isDraft: boolean;
    author: GitHubReleasesStatsAuthor;
}

export interface GitHubReleasesStatsAuthor {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
}

export interface GitHubReleasesStatsFile {
    name: string;
    downloadCount: number;
    url: string;
    size: number;
    contentType: string;
}
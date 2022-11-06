import osArch from "./enum/osArch";
import osType from "./enum/osType";
import { Asset, GitHubReleasesResponse } from "./types/GithubReleasesResponse";
import { GitHubReleasesStats } from "./types/GitHubReleasesStats";
export default {
  async fetch(request: any, env: any) {
    return await handleRequest(request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  }
}

/**
 * Many more examples available at:
 *   https://developers.cloudflare.com/workers/examples
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request: any) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/download")) {
    //get os from url query
    const ua = request.headers.get("user-agent");
    const url = new URL(request.url);
    let os = url.searchParams.get("os");
    let arch = url.searchParams.get("arch");
    if (!os) {
      os = getOS(ua).toString();
    }
    if(!arch){
      arch = getArch(ua).toString();
    }
    //get latest release from github https://github.com/SPC-H-Avans/game-builds
    const response = await fetch("https://api.github.com/repos/SPC-H-Avans/game-builds/releases/latest", { headers: { "User-Agent": "SPC-H-Avans" } });
    const json = await response.json() as GitHubReleasesResponse;
    //get download url from release
    const downloadUrl = getDownloadUrl(json, os.toLowerCase(), arch.toLowerCase());

    if(!downloadUrl) {
      return new Response(`No download URL found for "${os}" with arch "${arch}".\nAdd the OS URL query parameter "${request.url.split('?')[0]}?os=[windows|linux|macos]&arch=[x64|x86|arm|arm64]" to download a build for a specific OS.\nOr visit ${request.url.split('/download')[0]}/status to see all available builds`, { status: 404 });
    }

    //redirect to download url
    return Response.redirect(downloadUrl, 302);
  }

  if (pathname.startsWith("/status")) {
    const response = await fetch("https://api.github.com/repos/SPC-H-Avans/game-builds/releases/latest", { headers: { "User-Agent": "SPC-H-Avans" } });
    const json = await response.json() as GitHubReleasesResponse;
    //get stats from latest build, download count, name etc
    let stats: GitHubReleasesStats = {
      files: json.assets.map((asset: Asset) => {
        return {
          name: asset.name,
          downloadCount: asset.download_count,
          url: asset.browser_download_url,
          size: asset.size,
          contentType: asset.content_type
        }
      }),
      versionNumber: json.tag_name,
      versionName: json.name,
      versionBody: json.body,
      versionPublishedAtDate: json.published_at,
      isDraft: json.draft,
      author: {
        login: json.author.login,
        id: json.author.id,
        avatar_url: json.author.avatar_url,
        html_url: json.author.html_url
      }

    }
    return new Response(JSON.stringify(stats), { status: 200, headers: { "content-type": "application/json" } });
  }

  else{
    return new Response("Please visit /download or /status", { status: 404 });
  }
}

function getOS(ua: string): osType {
  if (ua.indexOf("Win") != -1) return osType.Windows;
  if (ua.indexOf("Mac") != -1) return osType.MacOS;
  if (ua.indexOf("X11") != -1) return osType.UNIX;
  if (ua.indexOf("Linux") != -1) return osType.Linux;
  return osType.Unknown;
}
function getArch(ua: any): osArch {
  if (ua.indexOf("WOW64") != -1 || ua.indexOf("Win64") != -1) return osArch.x64;
  if (ua.indexOf("Win32") != -1) return osArch.x86;
  if (ua.indexOf("arm64") != -1) return osArch.arm64;
  if (ua.indexOf("arm") != -1) return osArch.arm;
  return osArch.unknown;
}

function getDownloadUrl(json: GitHubReleasesResponse, os: string, arch: string): string | undefined {
  let downloadUrl: string | undefined = undefined;
  if(arch == osArch.unknown.toString()){
    downloadUrl = json.assets.find((asset: Asset) => {
      return asset.name.toLowerCase().includes(os);
    })?.browser_download_url;
  } else {
  json.assets.forEach((asset: Asset) => {
    if (asset.name.toLowerCase().includes(os) && asset.name.toLowerCase().includes(arch)) {
      downloadUrl = asset.browser_download_url;
    }
  });
}
  return downloadUrl;
}


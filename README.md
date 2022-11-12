# Mario Game Cloudflare Worker
![afbeelding](https://user-images.githubusercontent.com/33700526/201471859-fde3095f-18a9-4f5b-b6c7-b3a2dbea1a5b.png)


This is a CloudFlare Worker that serves the built Mario Game files.

## Endpoints:
- `/download` - Download the game
- `/download?os=[windows|linux|macos]?arch=[x64|arm64]` - Download the game for a specific OS and specific arch. (Both parameters are optional)
- `/status` - Get the status of the latest release


# Development commands:
- `npx wrangler dev` - Run the worker locally
- `npx wrangler publish` - Publish the worker to CloudFlare

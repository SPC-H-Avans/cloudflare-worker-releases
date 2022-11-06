# Mario Game CloudFlare Worker

This is a CloudFlare Worker that serves the built Mario Game files.

## Endpoints:
- `/download` - Download the game
- `/download?os=[windows|linux]` - Download the game for a specific OS
- `/status` - Get the status of the latest release


# Development commands:
- `npx wrangler dev` - Run the worker locally
- `npx wrangler publish` - Publish the worker to CloudFlare

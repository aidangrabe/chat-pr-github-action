# chat-pr-github-action Send Teamwork Chat Messages for PRs

## Inputs

### `CHAT_HOOK_URL`

**Required** The webhook url for Teamwork Chat. Default `""`.

## Example usage

uses: aidangrabe/chat-pr-github-action@v1.15

with:
  CHAT_HOOK_URL: ${{ secrets.CHAT_HOOK_URL }}

## Building

Node and npm are required.

### Install the dependencies

```
npm install
```

### Run the build

```
npm run build
```

### Create a release

In order for the action to be available on Github, a new tag must be created and specified in the action.yml of the repository using this action:

```
uses: aidangrabe/chat-pr-github-action@{new github release}
```
# majeggstics.com

## dev setup

If you run into any issues or are not confident that something is working, ping
@DukeCephalopod in discord for help.

1. Install [volta][]. Ensure it's working: in this directory, `which yarn` should print
   `$HOME/.volta/bin/yarn`, not `/usr/bin/yarn` or a similar system directory.
1. Install dependencies with `yarn install`
1. Compile source with `yarn build`
1. (optional) Install git hooks with `./Taskfile install-git-hooks`

### dev server

```
yarn dev
```

A hot-reloading dev server at http://localhost:3000. To use a different port,
`yarn` passes args directly through to the underlying script, so simply
`yarn dev -p 4444` (or whatever).

### unit tests

```
yarn test
```

Unit tests are in [mocha][] + [chai][]. Don't unit test whole rendered components, just hooks
or util functions. As a general guideline, if it's in `pages/`, unit testing isn't the right
tool to reach for. For examples, look for `.spec.ts` files outside the `e2e` directory.

### e2e tests

```
yarn e2e
```

Integration & end-to-end tests are in [playwright][]. This is the right place to test
UI interactions and ensure pages are rendering correctly.

By default, `yarn e2e` runs against `http://localhost:3000`. If your dev server is
already running there, it will use the existing server; if not, it will start its own
dev server in the background. To run against a deployed instance (or if you want it to
use a dev server on another port) set the `BASE_URL` env var,

```
env BASE_URL='https://majeggstics.com' yarn e2e
```

For rapid development or focusing in on a specific test, it may be useful to run
Playwright's UI mode, with

```
yarn e2e:ui
```

`BASE_URL` is respected. Your mileage may vary on whether this launches a UI or errors
out, depending on your host OS. See `./Taskfile` for more details.

## commits & pull requests

Work should be done in a descriptively named feature branch, usually something like
`feat--responsive-guide` or `bug--min-generator-newlines`. That particular format is
not _required_ — just don't call your branch `fixes` or `<your username>` or something
unhelpful like that.

Individual commits should follow the [conventional commits][] format.

PRs that are not documentation-only changes _must_ include tests. They _should_ get at
least one review. All open comments _should_ be Resolved before merging. Any party _may_
Resolve a comment thread, but it is preferred that the original commenter make the
decision that the response fully addresses the comment, rather than the responder making
that decision.

Selecting between normal Merge, Squash, and Rebase options should be a conscious
decision: pick the one that strikes the best balance between commit cleanliness and
historical accuracy. For example, a PR with one feature commit and three followup lints
is a good candidate to be Squashed; a PR with a bugfix and a style improvement might
look nice as a Rebase, and a meaty PR with extensive time in draft is probably best left
as a normal Merge — or by rewriting the history of the feature branch to clean up the
commit history into a few tidy Rebase-able commits.

## deploying

Commits to the `stable` branch are deployed to https://majeggstics.com/ via
Cloudflare Pages. Configuration happens in the Cloudflare UI; it runs `yarn build`
to build statics and expects the results to be in `out/`.

Commits to the `main` branch are deployed to https://beta.majeggstics.com/ via Github
Pages. Deploy configuration is in `.github/workflows/deploy-beta.yaml`.

In both static build systems, `NEXT_PUBLIC_API_URL` must be set to an EI-api proto to
json forwarder.

## dns infrastructure

The domain is registered with Namecheap; DNS goes to Cloudflare nameservers.

[chai]: https://www.chaijs.com/
[conventional commits]: https://www.conventionalcommits.org/en/v1.0.0/
[mocha]: https://mochajs.org/
[playwright]: http://playwright.dev/
[volta]: https://docs.volta.sh/guide/getting-started

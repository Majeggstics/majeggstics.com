# majeggstics.com

## dev setup

If you run into any issues or are not confident that something is working, ping
@DukeCephalopod in discord for help.

1. Install [volta][]. Ensure it's working: in this directory, `which yarn` should print
   `$HOME/.volta/bin/yarn`, not `/usr/bin/yarn` or a similar system directory.
1. Install dependencies with `yarn install`
1. Compile source with `yarn build`

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

[chai]: https://www.chaijs.com/
[mocha]: https://mochajs.org/
[playwright]: http://playwright.dev/
[volta]: https://docs.volta.sh/guide/getting-started

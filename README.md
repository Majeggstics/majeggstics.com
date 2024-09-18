# majeggstics.com

## dev setup
If you run into any issues or are not confident that something is working, ping
@DukeCephalopod in discord for help.

1. Install [volta][]. Ensure it's working: in this directory, `which yarn` should print
   `$HOME/.volta/bin/yarn`, not `/usr/bin/yarn` or a similar system directory.
1. Install dependencies with `yarn install`
1. Compile source with `yarn build`

### dev server

Start a dev server with `yarn dev`. This will launch a hot-reloading dev server at 
http://localhost:3000. To use a different port, `yarn` passes args directly through
to the underlying script, so simply `yarn dev -p 4444` (or whatever).


[volta]: https://docs.volta.sh/guide/getting-started

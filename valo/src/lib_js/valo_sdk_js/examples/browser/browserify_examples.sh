BROWSERIFY="../../../../../../node_modules/.bin/browserify"

$BROWSERIFY ../streams.js -o streams_browser.js -t [babelify]
$BROWSERIFY ../contributors.js -o contributors_browser.js -t [babelify]
$BROWSERIFY ../queries.js -o queries_browser.js -t [babelify]

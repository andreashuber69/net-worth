<h1 align="center">
  <img width="128" src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/icon.svg?sanitize=true">
</h1>
<p align="center">
  <a href="https://github.com/andreashuber69/net-worth/releases/latest">
    <img src="https://img.shields.io/github/release/andreashuber69/net-worth.svg" alt="Version">
  </a>
  <a href="https://github.com/andreashuber69/net-worth/releases/latest">
    <img src="https://img.shields.io/github/release-date/andreashuber69/net-worth.svg" alt="Release Date">
  </a>
  <a href="https://travis-ci.org/andreashuber69/net-worth">
    <img src="https://img.shields.io/travis/andreashuber69/net-worth.svg" alt="Build">
  </a>
  <a href="https://github.com/andreashuber69/net-worth/issues">
    <img src="https://img.shields.io/github/issues-raw/andreashuber69/net-worth.svg" alt="Issues">
  </a>
  <a href="https://codebeat.co/projects/github-com-andreashuber69-net-worth-master">
    <img src="https://codebeat.co/badges/1a2c6713-5e60-40d9-b569-0df30f7033a3" alt="Codebeat">
  </a>
  <a href="https://codeclimate.com/github/andreashuber69/net-worth/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/465f61b456d66d77375e/maintainability" alt="Code Climate"/>
  </a>
  <a href="https://github.com/andreashuber69/net-worth/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/andreashuber69/net-worth.svg" alt="License">
  </a>
</p>

<h1 align="center">Net Worth</h1>

Gain a quick overview of your precious metal and crypto assets!

If you primarily store your wealth in 'unconventional' assets like precious metals and cryptocurrencies, it seems
difficult to get an overview of your current financial situation.

Net Worth aims to make this a little easier. In a nutshell, the application presents your precious metal and
cryptocurrency holdings in a groupable and sortable table, which allows you to quickly see how your net worth is spread
among the different asset types and locations.

## Getting Started

### Installation

Net Worth runs in your internet browser but works and feels much like a conventional desktop application. There are
no logins, no passwords and your data is only ever stored locally on your computer.

While the application should work in most recent internet browsers, for privacy reasons it is recommended to
install either **Chromium** or **Firefox** and point it to <https://andreashuber69.github.io/net-worth>.

Alternatively, you can also
[install a desktop variant of Net Worth](https://github.com/andreashuber69/net-worth-desktop/blob/master/README.md#installation).
The usage is identical for all variants, the desktop ones just don't have the internet browser controls, like e.g. the
address bar.

### [Usage](https://github.com/andreashuber69/net-worth-desktop/blob/master/README.md#usage)

### [Privacy](https://github.com/andreashuber69/net-worth-desktop/blob/master/README.md#privacy)

## [Features](https://github.com/andreashuber69/net-worth-desktop/blob/master/README.md#features)

## [Known Issues / Feedback](https://github.com/andreashuber69/net-worth-desktop/blob/master/README.md#known-issues--feedback)

## [Source Code](https://github.com/andreashuber69/net-worth-desktop/blob/master/README.md#source-code)

## Rationale

Net Worth was created because no other freely available site/tool seemed to support both precious metals and crypto
currencies and I was fed up with maintaining an increasingly complex set of Excel sheets.

Net Worth is a so-called Progressive Web Application (PWA). PWAs can be used exactly like conventional web applications
but at the same time are automatically cached locally such that they still load in seconds if the network is slow or even
down. On an increasing number of browsers, especially on mobile platforms, PWAs can now also be added to the home screen
such that they look and feel much like a locally installed app.

The PWA model was chosen due to the following advantages over conventional desktop applications:

- PWAs work on most popular platforms/browsers.
- No installation is required, just surf to <https://andreashuber69.github.io/net-worth> and let your browser handle the
  rest.
- Distribution is straight-forward.

Of course, there are also some (minor) disadvantages:

- It is impossible to overwrite a local file from within a browser without user involvement. The **Save** menu item
  will therefore always create a new file rather than overwrite the originally loaded one. Since browsers typically
  store files in a special Download folder, the user usually needs to manually copy the newly saved file over the one
  she loaded. For an application like Net Worth this should not result in too much of an inconvenience, because files
  are typically changed rarely.
- If a web site attempts to open a new browser window, pop-up blockers sometimes get in the way. Most browsers allow the
  user to authorize exceptions.

## Technologies & Packages

<p>
  <a href="https://www.npmjs.com/">
    <img
      src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/npm.png"
      alt="npm" title="npm" height="50">
  </a>
  <img src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/spacer.svg?sanitize=true" height="50">
  <a href="http://typescriptlang.org">
    <img
      src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/typescript.png"
      alt="Typescript" title="Typescript" height="50">
  </a>
  <img src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/spacer.svg?sanitize=true" height="50">
  <a href="https://vuetifyjs.com">
    <img
      src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/vuetify.svg?sanitize=true"
      alt="Vuetify" title="Vuetify" height="50">
  </a>
  <img src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/spacer.svg?sanitize=true" height="50">
  <a href="https://vuejs.org">
    <img
      src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/vuejs.png"
      alt="Vue.js" title="Vue.js" height="50">
  </a>
  <img src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/spacer.svg?sanitize=true" height="50">
  <a href="https://webpack.js.org/">
    <img
      src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/webpack.svg?sanitize=true"
      alt="webpack" title="webpack" height="50">
  </a>
  <img src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/spacer.svg?sanitize=true" height="50">
  <a href="https://www.npmjs.com/package/offline-plugin">
    <img
      src="https://raw.githubusercontent.com/andreashuber69/net-worth/master/doc/offline-plugin.svg?sanitize=true"
      alt="offline-plugin" title="offline-plugin" height="50">
  </a>
</p>

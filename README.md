# Asset Manager

## Introduction

If you primarily store your wealth in "unconventional" assets like precious metals and crypto currencies, it seems there
are almost no tools that would help you get an overview of your current financial situation.

Asset Manager aims to change that. In a nutshell, the application presents your precious metal and crypto currency
holdings in a groupable and sortable table, which allows you to quickly see how your net worth is spread among the
different asset types and locations.

## Usage

### Getting Started

Asset Manager runs in your internet browser but works and feels much like a conventional desktop application. There are
no logins, no passwords and your data is only ever stored locally on your computer.

While the application should work in most recent internet browsers, for privacy reasons it is recommended to
install either **Chromium** or **Firefox** and point it to <https://andreashuber69.github.io/asset-manager>. Note that I
only rarely test the application on other browsers.

![Screenshot](screenshot.png)

In the top toolbar on the left there's a menu with the usual suspects **New**, **Open...**, **Save** and **Save As...**.
On the right, you'll find a button to add a new asset and controls to change the asset grouping and the valuation
currency.

In the table, clicking on a row representing an asset group will expand/collapse it. For example, in the screenshot
above, the **Silver** group is expanded, such that the grouped assets become visible. Individual assets can be edited
and deleted with the triple-dot menu at the end of each row. Some columns can be sorted by clicking on their headers.

### Privacy

- **Data Storage**: The data you enter into Asset Manager is only ever stored locally in your browser and can be saved
  to a file on your hard drive. Browser data sync services should not be used, as anything these can synchronize they
  can potentially also leak.
- **Queries**: In general, the application only makes queries about precious metal prices and currency exchange rates
  (quandl.com) plus crypto currency prices (coinmarketcap.com). For crypto currencies, you have the option to also track
   your balance. If you choose to do so, the application will also send your public address to an online service like
   e.g. blockchain.info.
- **Encryption**: All queries are always encrypted (https), but of course the owners of the respective services will
  have access to the contents of your query (which can be attributed to you via your IP address). If you have concerns
  about that, you should use a reputable VPN provider or even TOR.

## Known Issues / Feedback

I'd love to hear your thoughts! Please use the
[GitHub Issue Tracker](https://github.com/andreashuber69/asset-manager/issues) to see the known issues, ask your
questions, report problems or suggest improvements. Thank you!

## Source Code

The source code and full change history is available at <https://github.com/andreashuber69/asset-manager>. Map files are
deployed with the production code, so you can also review the code with the browser developer tools while your browser
is directed to <https://andreashuber69.github.io/asset-manager>.

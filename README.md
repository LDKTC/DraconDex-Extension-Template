# DraconDex-Extension-Template

Starter template for building a [DraconDex](https://github.com/LDKTC/App-DraconDex)
extension. Use this repo as a base: fork/use-as-template it, edit the
manifest and the files it lists, then install straight from your GitHub repo.

DraconDex extensions are **not** scripts running inside the main app. Each
extension opens in its own sandboxed window with **no access to the main
app's data or `window.api`** — only to the SQLite table(s) it declares for
itself, through `window.extApi`. For the full architecture and the honest
list of what this sandboxing does and doesn't protect against, see
[App-DraconDex's `docs/EXTENSIONS.md`](https://github.com/LDKTC/App-DraconDex/blob/main/docs/EXTENSIONS.md).

## Structure

| File | Purpose |
| --- | --- |
| `dracondex-extension.json` | Manifest: id, name, version, entry point, files, and table schema. |
| `index.html` | Entry point (must be listed in `files` and match `entry`). |
| `app.js` | Extension logic. Talks to its own table via `window.extApi.table.*`. |
| `style.css` | Optional styling. |

You can rename/add files freely as long as every file the extension loads is
listed in the manifest's `files` array.

## Manifest (`dracondex-extension.json`)

```json
{
  "id": "example_extension",
  "name": "Example Extension",
  "version": "0.1.0",
  "entry": "index.html",
  "files": ["index.html", "app.js", "style.css"],
  "tables": [
    {
      "name": "notes",
      "columns": [
        { "name": "title", "type": "TEXT" },
        { "name": "rating", "type": "INTEGER" }
      ]
    }
  ]
}
```

Rules the app enforces on install (see `validateManifest` in App-DraconDex's
`src/db/extension.js`):

- `id` — lowercase `a-z0-9_` only, max 20 characters. This becomes part of
  the extension's real DB table names, so pick it deliberately.
- `name` — string, max 80 characters.
- `version` — optional string, max 40 characters.
- `entry` — an HTML file, and it must also appear in `files`.
- `files` — 1 to 30 relative paths (no `..`, no leading `/`, no `\`), each
  fetched individually from GitHub and capped at 2 MB. The app does not
  crawl your repo — only files listed here are downloaded.
- `tables` — up to 10 tables, each with 1 to 25 columns. Column names must
  match `^[a-z][a-z0-9_]{0,29}$` and cannot be `id`, `rowid`, `oid`, or
  `_rowid_`. Column `type` is limited to `TEXT`, `INTEGER`, or `REAL` — no
  `DEFAULT`, `CHECK`, or `FOREIGN KEY` support.

## The `window.extApi` surface

Inside the extension window there is **no `window.api`** — only:

```js
window.extApi.table.getSchema(localName)
window.extApi.table.query(localName, filter)
window.extApi.table.insert(localName, row)
window.extApi.table.update(localName, id, row)
window.extApi.table.delete(localName, id)
```

`localName` is the `name` you declared under `tables` in the manifest (e.g.
`"notes"`), not the internal DB table name. Every call is scoped to tables
*this* extension declared — there is no way to reach another extension's
data or the main app's data from here.

## Installing your extension for testing

In the DraconDex app: **Settings → Extension**, enter your GitHub repo's
owner and name (and optionally a branch/ref — defaults to `main`), then
install. The app fetches `dracondex-extension.json` from your repo's root
and validates it before writing anything to disk.

## License

MIT, see [LICENSE](LICENSE).

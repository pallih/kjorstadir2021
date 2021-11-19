# Kjörstaðir 2021

A tiled vector map showing isochrone walking distances to polling places used in the [2021 Icelandic parliamentary election](https://en.wikipedia.org/wiki/2021_Icelandic_parliamentary_election). Uses [MapLibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/) to display the map, [Tegola](https://tegola.io/) to render the tiles, and [GDAL/OGR](https://gdal.org/) to import the data into a [PostGIS](https://postgis.net/) database. To run the map locally:

1. [Install Tegola](https://tegola.io/documentation/getting-started/#1-download-tegola)
2. [Install GDAL/OGR](https://ljvmiranda921.github.io/notebook/2019/04/13/install-gdal/)
3. [Install PostgreSQL](https://www.postgresqltutorial.com/install-postgresql/) and the [PostGIS extension](https://postgis.net/docs/postgis_installation.html), or have a remote PostgreSQL/PostGIS database available
4. From the `map/` subdirectory, run `make`
5. Run `make server` to run the Tegola tile server
6. In another terminal window, run `make static` from within the `map/` subdirectory to serve the static HTML

Now you can visit <http://localhost:8000/> in your browser to see the map.

## Environment variables

You can set several environment variables to tell Make about your database.

- `PGDATABASE`: database name (default to `election2021`)
- `PGHOST`: PostgreSQL database host (defaults to `localhost`)
- `PGPORT`: port to use on the database host to connect to PostgreSQL (defaults to `5432`)
- `PGUSER`: user to use to connect to the PostgreSQL database (defaults to `election2021`)
- `PGSUPERUSER`: privileged user used to create the database and user (defaults to `postgres`)

## Troubleshooting

If you see an error like this when you run `make`:

```
dropdb: error: could not connect to database template1: FATAL:  role "postgres" does not exist
```

It means your root database user (required to create the `election2021` database) isn't named `postgres`. Find out what your PostgreSQL root user is called and then run:

```sh
PGSUPERUSER=foo make
```

Where `foo` is the root username.

PGDATABASE ?= election2021
PGHOST ?= localhost
PGPORT ?= 5432
PGUSER ?= election2021
PGSUPERUSER ?= postgres
OGR_DSN ?= PG:"dbname='$(PGDATABASE)' host='$(PGHOST)' port='$(PGPORT)' user='$(PGUSER)' password='$(PGPASSWORD)'"
PG_DRIVER_OPTIONS ?= -f PostgreSQL -t_srs epsg:3857 -makevalid -overwrite -lco FID=id -lco PRECISION=NO -lco GEOMETRY_NAME=geom

all: clean database clear_cache clear_data_cache clear_tile_cache cache data_cache db_tables
.PHONY: all

##### CACHE ############################################################################

.PHONY: clean
clean: clear_cache
	dropdb --if-exists --host ${PGHOST} --port ${PGPORT} --user ${PGSUPERUSER} ${PGDATABASE}
	dropuser --if-exists --host ${PGHOST} --port ${PGPORT} --user ${PGSUPERUSER} ${PGUSER}

cache:
	mkdir -p cache/data
.PHONY: cache

clear_cache:
	rm -rf cache
.PHONY: clear_cache

clear_data_cache:
	rm -rf cache/data
.PHONY: clear_data_cache

clear_tile_cache:
	rm -rf cache/tiles
.PHONY: clear_tile_cache

data_cache: cache/data/coastline.gpkg cache/data/roads.gpkg cache/data/constituencies.gpkg
.PHONY: data_cache

cache/data/coastline.gpkg:
	curl --silent https://atlas.lmi.is/heikir/downloadData/is_50v_strandlina_isn2016_lambert_2016_gpkg.zip | funzip > cache/data/coastline.gpkg

cache/data/roads.gpkg:
	curl --silent https://atlas.lmi.is/heikir/downloadData/is_50v_samgongur_isn2016_lambert_2016_gpkg.zip | funzip > cache/data/roads.gpkg

cache/data/constituencies.gpkg:
	curl --silent https://atlas.lmi.is/heikir/downloadData/is_50v_mork_isn2016_lambert_2016_gpkg.zip | funzip > cache/data/constituencies.gpkg

##### DATABASE #########################################################################

.PHONY: database
database:
	createuser --host ${PGHOST} --port ${PGPORT} --user ${PGSUPERUSER} ${PGUSER}
	createdb --owner ${PGUSER} --host ${PGHOST} --port ${PGPORT} --user ${PGSUPERUSER} ${PGDATABASE}
	psql  --host ${PGHOST} --port ${PGPORT} --user ${PGSUPERUSER} ${PGDATABASE} --command "CREATE EXTENSION IF NOT EXISTS postgis"

db_tables: coastline_db_table roads_db_table isochrones_db_table polling_places_db_table districts_db_table constituencies_db_table
.PHONY: db_tables

coastline_db_table: cache/data/coastline.gpkg
	ogr2ogr ${PG_DRIVER_OPTIONS} ${OGR_DSN} cache/data/coastline.gpkg -nln coastline strandlina_flakar
.PHONY: coastline_db_table

roads_db_table: cache/data/roads.gpkg
	ogr2ogr ${PG_DRIVER_OPTIONS} ${OGR_DSN} cache/data/roads.gpkg -nln roads samgongur_linur
.PHONY: roads_db_table

constituencies_db_table: cache/data/constituencies.gpkg
	ogr2ogr ${PG_DRIVER_OPTIONS} ${OGR_DSN} cache/data/constituencies.gpkg -nln constituencies mork_kjordaemi
.PHONY: constituencies_db_table

isochrones_db_table:
	ogr2ogr ${PG_DRIVER_OPTIONS} ${OGR_DSN} ../isochrones/isochrones_clipped.geojson -nln isochrones
.PHONY: isochrones_db_table

polling_places_db_table:
	ogr2ogr ${PG_DRIVER_OPTIONS} ${OGR_DSN} ../docs/kjorstadir2021.json -nln polling_places -s_srs EPSG:4326
.PHONY: polling_places_db_table

districts_db_table:
	ogr2ogr ${PG_DRIVER_OPTIONS} ${OGR_DSN} ../sveitarfélög/sveitarfelog.geojson -nln districts
.PHONY: districts_db_table

##### TILESERVER #######################################################################

server:
	tegola serve --config=election2021.toml
.PHONY: server

tile_cache:
	tegola cache seed --config=election2021.toml --min-zoom 5 --max-zoom 12
.PHONY: tile_cache

static:
	python3 -m http.server 8090
.PHONY: static

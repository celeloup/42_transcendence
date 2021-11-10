#!/bin/bash

set -e
set -u

function create_user_and_database() {
	echo " database '$1'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE DATABASE $1;
	    GRANT ALL PRIVILEGES ON DATABASE $1 TO $POSTGRES_USER;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $POSTGRES_MULTIPLE_DATABASES; do
		create_user_and_database $db
	done
	echo "Multiple databases created"
fi
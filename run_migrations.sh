#!/bin/bash

# Stop on error
set -e

DB_HOST="51.222.142.148"
DB_PORT="5432"
DB_USER="monarksurvey"
DB_NAME="monarksurvey"

MIGRATIONS_DIR="./migrations"
LOG_FILE="./migration.log"

echo "=== MonarkSurvey Migration Runner ==="
echo "Démarrage à $(date)" | tee -a "$LOG_FILE"

if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "❌ Dossier migrations introuvable : $MIGRATIONS_DIR"
  exit 1
fi

# shellcheck disable=SC2012
for file in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
  echo "➡️  Exécution : $file" | tee -a "$LOG_FILE"

  psql "postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME" \
    -v ON_ERROR_STOP=1 \
    -f "$file"

  echo "✔️  Terminé : $file" | tee -a "$LOG_FILE"
done

echo "=== Migrations terminées avec succès ==="
echo "Fin à $(date)" | tee -a "$LOG_FILE"

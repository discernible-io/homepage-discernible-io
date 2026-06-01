#!/bin/bash
# Deployment script for discernible.io website
# This script copies files from the git repo to the Apache document root

set -e # Exit on error
set -u # Exit on undefined variable
set -o pipefail # Exit on pipe failure

SOURCE_DIR="/home/icarus40/homepage-discernible-io/public"
DEST_DIR="/var/www/domains/discernible.io/public_html"
LOG_FILE="/home/icarus40/homepage-discernible-io/deploy.log"

# Validate source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
 echo "ERROR: Source directory $SOURCE_DIR does not exist" | tee -a "$LOG_FILE"
 exit 1
fi

echo "$(date): Starting deployment..." | tee -a "$LOG_FILE"

# Copy files to Apache document root
sudo cp -r "$SOURCE_DIR"/* "$DEST_DIR/" 2>&1 | tee -a "$LOG_FILE"

# Set proper permissions
sudo chown -R www-data:www-data "$DEST_DIR" 2>&1 | tee -a "$LOG_FILE"
sudo chmod -R 755 "$DEST_DIR" 2>&1 | tee -a "$LOG_FILE"

# Reload Apache to clear any server-side cache
sudo systemctl reload apache2 2>&1 | tee -a "$LOG_FILE"

echo "$(date): Deployment completed successfully!" | tee -a "$LOG_FILE"

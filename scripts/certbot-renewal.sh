#!/bin/bash
# ========================================
# Certbot SSL Certificate Auto-Renewal Script
# ========================================
# Add to crontab: 0 0 * * * /app/scripts/certbot-renewal.sh
# ========================================

set -e

echo "========================================"
echo "Cremy Docs - SSL Certificate Renewal"
echo "========================================"
echo "Started at: $(date)"

# Certificate paths
CERT_DIR="/etc/nginx/ssl"
WEBROOT="/var/www/html"

# Check if certificates exist
if [ ! -d "$CERT_DIR" ]; then
    echo "ERROR: Certificate directory not found at $CERT_DIR"
    echo "Please run initial certbot command first:"
    echo "  certbot certonly --webroot -w $WEBROOT -d yourdomain.com"
    exit 1
fi

# Run certbot renewal (dry-run first to verify)
echo "Checking certificate renewal..."
certbot renew --dry-run --non-interactive

if [ $? -eq 0 ]; then
    echo "Dry-run successful. Proceeding with actual renewal..."
    
    # Run actual renewal
    certbot renew --non-interactive --webroot -w $WEBROOT
    
    if [ $? -eq 0 ]; then
        echo "Certificate renewed successfully!"
        
        # Reload nginx to pick up new certificates
        echo "Reloading nginx..."
        nginx -s reload
        
        if [ $? -eq 0 ]; then
            echo "Nginx reloaded successfully!"
        else
            echo "ERROR: Failed to reload nginx"
            exit 1
        fi
    else
        echo "ERROR: Certificate renewal failed"
        exit 1
    fi
else
    echo "WARNING: Dry-run failed. Skipping renewal this time."
    exit 0
fi

echo "========================================"
echo "Renewal completed at: $(date)"
echo "========================================"

# Cleanup old certificates (optional)
echo "Cleaning up old certificate archives..."
certbot delete --non-interactive --cert-name yourdomain.com 2>/dev/null || true

exit 0

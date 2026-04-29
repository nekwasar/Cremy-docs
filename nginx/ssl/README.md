# ========================================
# SSL Certificates Placeholder
# ========================================
# 
# Place your SSL certificates here for HTTPS support:
# - cert.pem (SSL certificate)
# - key.pem (Private key)
#
# You can generate self-signed certificates for testing:
# openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#   -keyout nginx/ssl/key.pem \
#   -out nginx/ssl/cert.pem
#
# Or use Let's Encrypt for free certificates in production.

# For development/testing without SSL, the HTTP server will work.
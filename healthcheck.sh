#!/bin/sh
# Health check script for the application

# Check if the server is responding
wget --quiet --tries=1 --spider http://localhost:5000/ || exit 1

exit 0

#!/bin/bash
# deploy.sh

echo "Deploying Legal Document Management System..."

# Build and start services
docker-compose -f docker-compose.yml -f monitoring/docker-compose.monitoring.yml up -d

# Wait for services to be ready
sleep 30

# Run health checks
curl -f http://localhost:3000/health || exit 1

# Run Postman tests
newman run postman/Legal-Document-Management.postman_collection.json \
  --environment postman/test-environment.json

echo "Deployment completed successfully!"

#!/bin/bash

echo "🧹 Removing stopped containers..."
docker container prune -f

echo "🧼 Removing dangling images..."
docker image prune -f

echo "🗑️ Removing dangling volumes..."
docker volume prune -f

echo "📦 Removing volumes older than 1 day..."
docker volume ls -q | while read volume; do
  created=$(docker volume inspect --format '{{ .CreatedAt }}' "$volume")
  if [[ $(date -d "$created" +%s) -lt $(date -d "1 day ago" +%s) ]]; then
    echo "Removing volume: $volume (created at $created)"
    docker volume rm "$volume"
  fi
done

echo "✅ Docker cleanup complete!"

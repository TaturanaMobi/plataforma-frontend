dev:
	@COMPOSE_HTTP_TIMEOUT=6000 docker-compose up mongo redis fake-smtp traefik images mongo-express

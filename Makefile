NAME := transcendance
DC := docker-compose

all: up logs

up:
	#if [ -d "postgres_data" ]; then mkdir postgres_data; fi
	$(DC) --project-name $(NAME) up --detach
logs:
	$(DC) --project-name $(NAME) logs --follow
front.logs:
	$(DC) --project-name $(NAME) logs --follow front
front.shell:
	$(DC) --project-name $(NAME) exec front sh
back.logs:
	$(DC) --project-name $(NAME) logs --follow back
back.shell:
	$(DC) --project-name $(NAME) exec back sh
back.test:
	$(DC) --project-name $(NAME) exec back npm run test
stop:
	$(DC) --project-name $(NAME) stop
down:
	$(DC) --project-name $(NAME) down
ps:
	$(DC) --project-name $(NAME) ps
clean:
	$(DC) --project-name $(NAME) down --rmi all --volumes
	rm -fr ./nestjs_back/dist
	rm -fr ./nestjs_back/node_modules
	rm -fr ./front/dist
	rm -fr ./front/node_modules
	rm -fr ./websocket_client/node_modules
	rm -fr ./postgres_data

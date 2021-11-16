NAME := transcendance
DC := docker-compose
DS := docker stack

all: up logs

up:
	if [ ! -d "postgres_data" ]; then mkdir postgres_data; fi
	$(DC) --project-name $(NAME) up -d --build postgres front back 
logs:
	$(DC) --project-name $(NAME) logs --follow back postgres front
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
clean.linux:
	$(DC) --project-name $(NAME) down --rmi all --volumes
	sudo rm -fr ./back/dist
	sudo rm -fr ./back/node_modules
	sudo rm -fr ./back/avatars
	sudo rm -fr ./front/dist
	sudo rm -fr ./front/node_modules
	sudo rm -fr ./postgres_data
clean:
	$(DC) --project-name $(NAME) down --rmi all --volumes
	rm -fr ./back/dist
	rm -fr ./back/node_modules
	rm -fr ./back/avatars
	rm -fr ./front/dist
	rm -fr ./front/node_modules
	rm -fr ./postgres_data
# ONLINE VERSION RULES - WIP
stack.up:
	if [ ! -d "postgres_data" ]; then mkdir postgres_data; fi
	docker build -f ./back/Dockerfile -t transcendance:back ./back
	docker build -f ./back/Dockerfile -t transcendance:front ./front
	$(DS) deploy -c stack.yml $(NAME)
stack.rm:
	$(DS) remove $(NAME)
stack.ps:
	$(DS) ps $(NAME) --no-trunc
stack.logs.front:
	docker service logs -f $(NAME)_front
stack.logs.back:
	docker service logs -f $(NAME)_back
stack.logs.db:
	docker service logs -f $(NAME)_postgres
stack.clean:
	docker image rm transcendance:back
	docker image rm transcendance:front
	sudo rm -fr ./back/dist
	sudo rm -fr ./back/node_modules
	sudo rm -fr ./back/avatars
	sudo rm -fr ./front/dist
	sudo rm -fr ./front/node_modules
	sudo rm -fr ./postgres_data


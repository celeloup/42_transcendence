NAME := transcendance
DC := docker-compose

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
	sudo rm -fr ./front/dist
	sudo rm -fr ./front/node_modules
	sudo rm -fr ./postgres_data
clean:
	$(DC) --project-name $(NAME) down --rmi all --volumes
	rm -fr ./nestjs/dist
	rm -fr ./nestjs/node_modules
	rm -fr ./front/dist
	rm -fr ./front/node_modules
	rm -fr ./postgres_data

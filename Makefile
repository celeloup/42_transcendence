NAME := transcendance
DC := docker-compose

up:
	[[ -d postgres_data ]] || mkdir postgres_data
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
	rm -fr ./nuxt_front_test/dist
	rm -fr ./nuxt_front_test/.nuxt
	sudo rm -fr ./postgres_data

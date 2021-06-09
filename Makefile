APP_NAME=generic-services-api
# Figure out a way to put all of this in package.json

run:
	npm start

test:
	npm run test

install:
	npm install

push:
	git add --all
	git commit
	git push -u origin master
	
pull:
	git pull -v origin master

update:
	make pull
	make restart

pm2-start:
	pm2 start --name $(APP_NAME) bin/www

stop:
	pm2 stop $(APP_NAME)

restart:
	pm2 restart $(APP_NAME)

logs:
	pm2 logs $(APP_NAME)

# Database.
db:
	npm run db

# Builds
docker-build:
	npm run build:docker

# Deployments
deploy:
	npm run deploy

deploy-appengine:
	npm run deploy:appengine


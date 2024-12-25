#!/usr/bin/env bash
# exit on error
set -o errexit

# Add build commands for front end
rm -rf public
npm install --prefix manage-pr-app && npm run build --prefix manage-pr-app
cp -a manage-pr-app/build/. public/

bundle install
bundle exec rake db:migrate
bundle exec rails db:seed
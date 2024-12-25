# demo-ruby-react-app
Demo app using ruby on rails and react

The project is deployed to Render.
API is built using Rails, uses postgres db.
UI is built using React.

Production build for react is done via npm run build --prefix manage-pr-app
move built file to public folder using  rsync -av --ignore-existing manage-pr-app/build/ public/

every change in UI should be built and committed so it is served in Render.
Update service in https://dashboard.render.com/web/srv-ctlpha52ng1s73b86ctg/deploys/dep-ctlq3mrtq21c73f4kmh0 
Render app -> https://demo-ruby-react-app.onrender.com/ 


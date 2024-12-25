# demo-ruby-react-app
Demo app using ruby on rails and react

The project is deployed to Render.<br>
API is built using Rails, uses postgres db.<br>
UI is built using React.<br>

Production build for react is done via npm run build --prefix manage-pr-app <br>
move built file to public folder using  rsync -av --ignore-existing manage-pr-app/build/ public/ <br>
`npm run build --prefix manage-pr-app && rsync -av --ignore-existing manage-pr-app/build/ public/`

to generate tailwind css, run the below command and copy the generated content to index.css
This is because tailewind build is not natively added into static files
`npx tailwindcss build src/index.css -o dist/tailwind.css`

every change in UI should be built and committed so it is served in Render.<br>
Update service in https://dashboard.render.com/web/srv-ctlpha52ng1s73b86ctg/deploys/dep-ctlq3mrtq21c73f4kmh0 <br>
Render app -> https://demo-ruby-react-app.onrender.com/ 


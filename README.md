# Manage Purchase Requisition
Manage Purchase Requisition application that enable users to View, Create and Update requisitions.

**Technical Details:**

- Backend: Rails 
- Database: Postgres
- Frontend: ReactJs
- Styling:  UI5 web components for React

**Deployment Strategy:**

This app is deployed to [Render](https://render.com/), a cloud application platform which provides a free database instance.

**Features:**

- Upon opening the app, user views the list of Purchase Requisitions, From this page, user can

  - Create a new Requisition

  - Delete an existing Requisition

  - Search the requisitions

  - Navigate to details of requisition

- Users can add items to the new items to existing Requisitions

- **Validations:**

  - If user tries to create a requisition with Description less than 10 characters then an error is thrown and field is highlighted
  - If user tries to create a requisition with type 'ZNB' then an authorization error is shown.

- **Determinations:**

  - Based on requisition type, the description is determined and saved in DB
  - Based on quantity and unit price, the total price is calculated.

**Architecture**

![architecture](ArchitectureFlow.jpg)

**Note for contribution:**

- Before merging to main, below command should be executed to build the react application. The initial route from rails will load the index page of react app.

  `npm run build --prefix manage-pr-app && rsync -av --ignore-existing manage-pr-app/build/ public/`

- The changes merged to main will automatically trigger the deployment on render.

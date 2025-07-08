# Steps to create this project

### level 1 :

1. Initialized an empty turborepo
2. Deleted the docs app
3. added http-server , ws-server folder
4. added package.json in both the places
5. Added tsconfig.json in both the pieces, and imported it from @repo/typescript—config/base.json
6. Added @repo/typescript-config as a dependency in both ws-server and http-server

7. Added a build, dev and start script to both the projects
8. Update the turbo-config in both the projects (optional)
9. Initialize a http server , Initialize a websocket server

### Level 2:

10. Write the signup, signin, create-room endpoint

11. Write the middlewares that decode the token and gate the create-room ep

12. Decode the token in the websocket server as well. Send the token to the
    websocket server in a query param for now

13. Initilize a new db package where you write the schema of the project

14. import the db package in the http layer and atrt outting things in the DB

15. Add a common package where we add the zod schema and the JWT SECERT

16. Defining the schema in schema.prisma


## Level 3:




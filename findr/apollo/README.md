## Apollo Graphql
Apollo GraphQL is a powerful and efficient tool for building and managing your GraphQL API, enabling seamless data aggregation from multiple sources. 
It simplifies app development by allowing you to fetch required data with a single query. For a deeper understanding, explore how 

- Apollo Graphql works - https://www.apollographql.com/docs/

- Apollo Federation works - https://www.apollographql.com/docs/federation

## __Prerequisites__
Install Homebrew 
    
  Follow the instructions from https://brew.sh/

Restart the terminal and follow below instructions

## __Local Setup__
1. Clone the repo
  ```console
  git clone git@github.com:DISHDevEx/findr.git
  cd findr
  ```
2. Install Node
  ```console
  brew install node
  node -v
  npm -v
  ```
3. Disable local certs
  ```console
  npm config set strict-ssl false
  ```
4. Dependency cleanup
  ```console
  rm -rf dist node_modules package-lock.json
  ```
5. Install dependencies and Compile code
  ```console
  npm install
  npm run compile
  ```
6. Start Service
  ```console
  node dist/apollo/index.js
  ```
  Apollo Server ready at http://localhost:4001/graphql 🚀

7. Start Gateway
  ```console
  node dist/gateway.js
  ```
  Apollo Gateway ready at http://localhost:4000/graphql 🚀


## __Querying GraphQL Endpoints__

## __Using cURL__
1. Open terminal 
2. Make sure Service and Gateway servers are running
3. Run below Command
  ```console
  curl -X POST -H "Content-Type: application/json" -d '{"query":"{ spacexLaunches { id capsules { id land_landings last_update reuse_count serial status type } rocket { company country description cost_per_launch success_rate_pct type wikipedia } } }"}' http://localhost:4000/graphql
  ```
4. Returns JSON response

## __Using Postman__
1. Launch the Postman application
2. Make sure Service and Gateway servers are running
3. Set Request Details
    1. Choose the request method as POST
    2. Enter http://localhost:4000/graphql URL in the request URL field

4. Add a Content-Type header to specify that you're sending a GraphQL request as JSON.
    1. Click on the "Headers" tab
    2. Click "Add Row"
    3. Enter Content-Type in the "Key" field
    4. Enter application/json in the "Value" field

5. Add Graphql Query in the "Body" section
    1. Select the "raw" option.
    2. Choose "JSON" as the data format.
    3. Enter your GraphQL query as a JSON object. For example:
    ```console
    {"query":"{ spacexLaunches { id capsules { id land_landings last_update reuse_count serial status type } rocket { company country description cost_per_launch success_rate_pct type wikipedia } } }"}
    ```
6. Hit Send and View Response
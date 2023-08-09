# FINDR - Federated IOT Network Device Registry

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
  rm -rf dist
  rm -rf node_modules
  ```
5. Install dependencies and Compile code
  ```console
  npm install
  npm run compile
  ```
6. Start Service
  ```console
  node dist/spacex/spacex.js
  ```
  Apollo Server ready at http://localhost:4001/graphql

7. Start Gateway
  ```console
  node dist/gateway.js
  ```
  Apollo Gateway ready at http://localhost:4000/graphql

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
3. disable local certs
  ```console
  npm config set strict-ssl false
  ```
4. Install Dependencies
  ```console
  npm install --save-dev typescript @types/node
  npm install @apollo/server graphql
  ```
5. Start Service
  ```console
  npm install && npm start
  ```

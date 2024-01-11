# Oracle.ts - Findr Back-End API

Oracle.ts is the sophisticated back-end API for FINDR, designed to seamlessly handle API requests from the FINDR UI. This powerhouse not only processes Vault validation but also orchestrates the establishment of connections between FINDR adapters and IoT devices.

## repo structure:
```
findr/
│
├── oracle/
│   ├── oracle.ts
│   │
│   ├── vault-client.ts
│   │
│   ├── harbor-client.ts    
│   │
│   ├── orchestrator-client.ts   
│    

```

## Features

- **Vault Validation:** oracle.ts rigorously verifies requests against the sacred Vault, ensuring only the worthy proceed.

- **Connection Building:** Upon successfully passing Vault validation, oracle.ts collaborates with the FINDR Orchestrator to construct a robust bridge between FINDR adapters and a constellation of IoT devices.

- **Error Handling:** In the event of unsuccessful Vault validation, oracle.ts gracefully communicates detailed error messages back to the FINDR UI.

## Usage

To harness the power of oracle.ts, simply make API requests from the FINDR UI. oracle.ts will work its magic, validating the Vault, facilitating connections via orchestrator-client.ts, and delivering responses promptly.

## Functionalities Flow

1. Receive device info from UI
2. Validate device info
3. Register device info in Vault
4. Pass all info to Orchestrator
5. Send response back to UI

## Installation

```bash
npm run compile && node ./dist/oracle.js

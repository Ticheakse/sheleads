# SheLeads Smart Contract

## Overview

The `SheLeads` smart contract is a decentralized platform designed to manage professional profiles, recommendations, and action plans. It leverages Chainlink's Functions and OpenZeppelin's Counters for ID management, providing a secure and transparent way for users to create and track their professional development.

## Features

- **Professional Profile Management**: Users can create and update their professional profiles.
- **Recommendations**: Users can receive recommendations linked to their profiles.
- **Action Plans**: Users can develop action plans based on received recommendations.
- **Chainlink Integration**: The contract integrates with Chainlink Functions for secure off-chain computations.
- **Event Logging**: The contract emits events for key actions like profile creation, recommendation addition, and action plan updates.

## Contract Structure

### State Variables

- **Counters**
  - `professionalProfileId`: Counter for tracking professional profile IDs.
  - `recommendationId`: Counter for tracking recommendation IDs.
  - `actionPlanId`: Counter for tracking action plan IDs.

- **Mappings**
  - `userProfessionalProfile`: Maps a user's address to their latest professional profile ID.
  - `userProfessionalProfileHistory`: Maps a user's address to their historical profile IDs.
  - `professionalProfile`: Maps a professional profile ID to its corresponding `ProfessionalProfile` struct.
  - `recommendation`: Maps a professional profile ID to its corresponding `Recommendation` struct.
  - `actionPlan`: Maps a recommendation ID to its corresponding action plan ID.
  - `actionPlanById`: Maps an action plan ID to its corresponding `ActionPlan` struct.
  - `userActionPlan`: Maps a user's address to their latest action plan.

- **Chainlink Specific**
  - `s_lastRequestId`: Stores the ID of the last Chainlink request.
  - `s_lastResponse`: Stores the last response from Chainlink.
  - `s_lastError`: Stores the last error from Chainlink.

### Structs

- `ProfessionalProfile`: Stores the ID, content, and creation timestamp of a professional profile.
- `Recommendation`: Stores the ID, content, and creation timestamp of a recommendation.
- `ActionPlan`: Stores the ID, content, and creation timestamp of an action plan.

### Events

- `AddProfessionalProfile(address indexed userAddress)`: Emitted when a user adds a new professional profile.
- `AddRecommendation(address indexed userAddress)`: Emitted when a user adds a recommendation.
- `AddActionPlan(address indexed userAddress)`: Emitted when a user adds an action plan.
- `AddRecommendationActionPlan(address indexed userAddress)`: Emitted when a user adds both a recommendation and an action plan.
- `Response(bytes32 indexed requestId, string result, bytes response, bytes err)`: Emitted when a Chainlink function request is fulfilled.

### Functions

- `sendRequest`: Sends a request to Chainlink Functions with the provided subscription ID, encrypted secrets, and arguments.
- `fulfillRequest`: Handles the response from Chainlink, updating the contract state and emitting a `Response` event.
- `addProfessionalProfile`: Allows a user to create a new professional profile.
- `getProfessionalProfile`: Retrieves the latest professional profile of the caller.
- `addRecommendation`: Allows a user to add a recommendation to a specific professional profile.
- `getRecommendation`: Retrieves the recommendation for a specified professional profile.
- `addActionPlan`: Allows a user to add an action plan based on a specific recommendation.
- `getActionPlan`: Retrieves an action plan based on a recommendation ID.
- `getMyActionPlan`: Retrieves the latest action plan of the caller.
- `addRecommendationActionPlan`: Allows a user to add both a recommendation and an action plan at once.
- `getRecommendations`: Retrieves all recommendations for the caller based on their profile history.

## Deployment

1. Clone the repository.
2. Install the necessary dependencies with `npm install`.
3. Deploy the contract to your desired network using Hardhat or Truffle.

## Usage

### Adding a Professional Profile

To add a professional profile:

```solidity
SheLeads.addProfessionalProfile("My professional profile content");
```

### Adding a Recommendation

To add a recommendation:

```solidity
SheLeads.addRecommendation(profileId, "This is a recommendation content");
```

### Adding an Action Plan

To add an action plan:

```solidity
SheLeads.addActionPlan(recommendationId, "This is an action plan content");
```

### Chainlink Functions Integration

The contract interacts with Chainlink Functions to process off-chain computations. Ensure you have the necessary setup and Chainlink credentials before deploying.

## License

This project is licensed under the MIT License.
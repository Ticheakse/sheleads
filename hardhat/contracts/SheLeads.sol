// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract SheLeads is FunctionsClient, ConfirmedOwner {
  using FunctionsRequest for FunctionsRequest.Request;
  using Counters for Counters.Counter;

  /// @dev Professional Profile id counter
  Counters.Counter professionalProfileId;

  /// @dev Recommendation id counter
  Counters.Counter recommendationId;

  /// @dev Action Plan id counter
  Counters.Counter actionPlanId;

  // State variables to store the last request ID, response, and error
  bytes32 public s_lastRequestId;
  bytes public s_lastResponse;
  bytes public s_lastError;

  // Custom error type
  error UnexpectedRequestID(bytes32 requestId);

  struct ProfessionalProfile {
    uint256 id;
    string content;
    uint256 createdAt;
  }

  struct Recommendation {
    uint256 id;
    string content;
    uint256 createdAt;
  }

  struct ActionPlan {
    uint256 id;
    string content;
    uint256 createdAt;
  }

  /// @dev mapping address to professionalProfileId
  mapping(address => uint256) userProfessionalProfile;

  /// @dev mapping address to professionalProfileId array -- to propone a history of profiles
  mapping(address => uint256[]) userProfessionalProfileHistory;

  /// @dev mapping professionalProfileId to Professional Profile Struct
  mapping(uint256 => ProfessionalProfile) professionalProfile;

  /// @dev mapping professionalProfileId to Recommendation
  mapping(uint256 => Recommendation) recommendation;

  /// @dev mapping recomendationId to action plan id
  mapping(uint256 => uint256) actionPlan;

  /// @dev mapping action plan id to ActionPlan
  mapping(uint256 => ActionPlan) actionPlanById;

  /// @dev mapping address to ActionPlan
  mapping(address => ActionPlan) userActionPlan;

  /// @dev Events
  event AddProfessionalProfile(address indexed userAddress);
  event AddRecommendation(address indexed userAddress);
  event AddActionPlan(address indexed userAddress);
  event AddRecommendationActionPlan(address indexed userAddress);
  event Response(
    bytes32 indexed requestId,
    string result,
    bytes response,
    bytes err
  );
  /**
   * @dev Chainlink Functions
   */
  address router = 0xf9B8fc078197181C841c296C876945aaa425B278;

  string source =
    "const prompt = args[0]"
    "if ("
    "!secrets.openAiKey"
    ") {"
    "throw Error("
    "'Need to set OPENAI_KEY environment variable'"
    ")"
    "}"
    "const openAIRequest = Functions.makeHttpRequest({"
    "url: 'https://api.openai.com/v1/chat/completions',"
    "method: 'POST',"
    "headers: {"
    "'Authorization': `Bearer ${secrets.openAiKey}`,"
    "'Content-Type': 'application/json'"
    "},"
    "data: {"
    "'model': 'gpt-4o-mini', 'messages': [{"
    "'role': 'user', 'content': prompt"
    "}]"
    "}"
    "})"
    "const [openAiResponse] = await Promise.all(["
    "openAIRequest"
    "])"
    "let result = openAiResponse.data.choices[0].message.content"
    "result = result.replaceAll('```json', '')"
    "result = result.replaceAll('```', '')"
    "return Functions.encodeString(JSON.parse(result).finalResult)";

  uint32 gasLimit = 300000;

  bytes32 donID =
    0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000;

  string public result;

  constructor() FunctionsClient(router) ConfirmedOwner(msg.sender) {}

  function sendRequest(
    uint64 subscriptionId,
    bytes memory encryptedSecrets,
    string[] calldata args
  ) external returns (bytes32 requestId) {
    FunctionsRequest.Request memory req;
    req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code
    if (args.length > 0) req.setArgs(args); // Set the arguments for the request
    if (encryptedSecrets.length > 0) req.addSecretsReference(encryptedSecrets);

    // Send the request and store the request ID
    s_lastRequestId = _sendRequest(
      req.encodeCBOR(),
      subscriptionId,
      gasLimit,
      donID
    );

    return s_lastRequestId;
  }

  function fulfillRequest(
    bytes32 requestId,
    bytes memory response,
    bytes memory err
  ) internal override {
    if (s_lastRequestId != requestId) {
      revert UnexpectedRequestID(requestId); // Check if request IDs match
    }
    // Update the contract's state variables with the response and any errors
    s_lastResponse = response;
    result = string(response);
    s_lastError = err;

    // Emit an event to log the response
    emit Response(requestId, result, s_lastResponse, s_lastError);
  }

  function addProfessionalProfile(string memory _content) public {
    uint256 id = professionalProfileId.current();

    userProfessionalProfile[msg.sender] = id;
    userProfessionalProfileHistory[msg.sender].push(id);
    professionalProfile[id] = ProfessionalProfile({
      id: id,
      content: _content,
      createdAt: block.timestamp
    });

    professionalProfileId.increment();

    emit AddProfessionalProfile(msg.sender);
  }

  function getProfessionalProfile()
    public
    view
    returns (ProfessionalProfile memory)
  {
    uint256 ppID = userProfessionalProfile[msg.sender];

    return professionalProfile[ppID];
  }

  function addRecommendation(
    uint256 _professionalProfileId,
    string memory _content
  ) public {
    uint256 id = recommendationId.current();

    recommendation[_professionalProfileId] = Recommendation({
      id: id,
      content: _content,
      createdAt: block.timestamp
    });

    recommendationId.increment();

    emit AddRecommendation(msg.sender);
  }

  function getRecommendation(
    uint _professionalProfile
  ) public view returns (Recommendation memory) {
    return recommendation[_professionalProfile];
  }

  function addActionPlan(
    uint256 _recommendationId,
    string memory _content
  ) public {
    uint256 id = actionPlanId.current();

    actionPlan[_recommendationId] = id;
    userActionPlan[msg.sender] = ActionPlan({
      id: id,
      content: _content,
      createdAt: block.timestamp
    });

    actionPlanById[id] = ActionPlan({
      id: id,
      content: _content,
      createdAt: block.timestamp
    });

    actionPlanId.increment();

    emit AddActionPlan(msg.sender);
  }

  function getActionPlan(
    uint256 _recommendationId
  ) public view returns (ActionPlan memory) {
    uint256 apId = actionPlan[_recommendationId];

    return actionPlanById[apId];
  }

  function getMyActionPlan() public view returns (ActionPlan memory) {
    return userActionPlan[msg.sender];
  }

  function addRecommendationActionPlan(
    uint256 _professionalProfileId,
    string memory _contentRecommendation,
    string memory _contentActionPlan
  ) public {
    uint256 id = recommendationId.current();

    recommendation[_professionalProfileId] = Recommendation({
      id: id,
      content: _contentRecommendation,
      createdAt: block.timestamp
    });

    uint256 idAP = actionPlanId.current();

    actionPlan[id] = idAP;
    userActionPlan[msg.sender] = ActionPlan({
      id: idAP,
      content: _contentActionPlan,
      createdAt: block.timestamp
    });

    actionPlanById[idAP] = ActionPlan({
      id: idAP,
      content: _contentActionPlan,
      createdAt: block.timestamp
    });

    actionPlanId.increment();
    recommendationId.increment();

    emit AddRecommendationActionPlan(msg.sender);
  }

  function getRecommendations() public view returns (Recommendation[] memory) {
    uint256[] memory upHistory = userProfessionalProfileHistory[msg.sender];
    uint256 countRec = 0;

    for (uint256 i = 0; i < upHistory.length; i++) {
      if (
        keccak256(bytes(recommendation[upHistory[i]].content)) !=
        keccak256(bytes(""))
      ) {
        countRec++;
      }
    }

    Recommendation[] memory rec = new Recommendation[](countRec);
    uint256 sumRec = 0;

    for (uint256 i = 0; i < upHistory.length; i++) {
      if (
        keccak256(bytes(recommendation[upHistory[i]].content)) !=
        keccak256(bytes(""))
      ) {
        rec[sumRec] = recommendation[upHistory[i]];
        sumRec++;
      }
    }

    return rec;
  }
}

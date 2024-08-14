// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

contract SheLeads {
  using Counters for Counters.Counter;

  /// @dev Professional Profile id counter
  Counters.Counter professionalProfileId;

  /// @dev Recommendation id counter
  Counters.Counter recommendationId;

  /// @dev Action Plan id counter
  Counters.Counter actionPlanId;

  struct ProfessionalProfile {
    uint256 id;
    string content;
  }

  struct Recommendation {
    uint256 id;
    string content;
  }

  struct ActionPlan {
    uint256 id;
    string content;
  }

  /// @dev mapping address to professionalProfileId
  mapping(address => uint256) userProfessionalProfile;

  /// @dev mapping address to professionalProfileId array -- to propone a history of profiles
  mapping(address => uint256[]) userProfessionalProfileHistory;

  /// @dev mapping professionalProfileId to Professional Profile Struct
  mapping(uint256 => ProfessionalProfile) professionalProfile;

  /// @dev mapping professionalProfileId to Recommendation
  mapping(uint256 => Recommendation) recommendation;

  /// @dev mapping recomendationId to ActionPlan
  mapping(uint256 => ActionPlan) actionPlan;

  /// @dev Events
  event AddProfessionalProfile(address indexed userAddress);
  event AddRecommendation(address indexed userAddress);
  event AddActionPlan(address indexed userAddress);

  constructor() {}

  function addProfessionalProfile(string memory _content) public {
    uint256 id = recommendationId.current();

    userProfessionalProfile[msg.sender] = id;
    userProfessionalProfileHistory[msg.sender].push(id);
    professionalProfile[id] = ProfessionalProfile({id: id, content: _content});

    recommendationId.increment();

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
    uint256 id = professionalProfileId.current();

    recommendation[_professionalProfileId] = Recommendation({
      id: id,
      content: _content
    });

    professionalProfileId.increment();

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

    actionPlan[_recommendationId] = ActionPlan({id: id, content: _content});

    actionPlanId.increment();

    emit AddActionPlan(msg.sender);
  }

  function getActionPlan(
    uint256 _recommendationId
  ) public view returns (ActionPlan memory) {
    return actionPlan[_recommendationId];
  }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PunnyPower.sol";

/**
 * @title QuestRegistry
 * @dev Admin-managed quest registry. Owner can add quests and mark users eligible.
 * Users can claim rewards for eligible quests which mints `PunnyPower` tokens to them.
 */
contract QuestRegistry is Ownable {
    PunnyPower public immutable token;

    struct Quest {
        uint256 id;
        string title;
        uint256 reward; // token amount in base units (e.g., whole tokens will be multiplied by 1e18 by convention in mint calls)
        bool active;
    }

    uint256 public nextQuestId = 1;
    mapping(uint256 => Quest) public quests;

    // eligibility and claimed state
    mapping(address => mapping(uint256 => bool)) public eligible;
    mapping(address => mapping(uint256 => bool)) public claimed;

    event QuestAdded(uint256 indexed id, string title, uint256 reward);
    event QuestUpdated(uint256 indexed id, bool active);
    event EligibleSet(address indexed user, uint256 indexed questId);
    event Claimed(address indexed user, uint256 indexed questId, uint256 reward);
    event Awarded(address indexed user, uint256 indexed questId, uint256 reward);

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "QuestRegistry: token address is zero");
        token = PunnyPower(tokenAddress);
    }

    /**
     * @dev Add a new quest. Reward is expressed in whole tokens (not wei) to keep the API simple.
     */
    function addQuest(string calldata title, uint256 rewardWholeTokens) external onlyOwner {
        uint256 id = nextQuestId++;
        quests[id] = Quest({ id: id, title: title, reward: rewardWholeTokens, active: true });
        emit QuestAdded(id, title, rewardWholeTokens);
    }

    function setQuestActive(uint256 questId, bool active) external onlyOwner {
        Quest storage q = quests[questId];
        q.active = active;
        emit QuestUpdated(questId, active);
    }

    /**
     * @dev Mark a user eligible for a quest (to be called by off-chain verifier / admin)
     */
    function setEligible(address user, uint256 questId) external onlyOwner {
        eligible[user][questId] = true;
        emit EligibleSet(user, questId);
    }

    /**
     * @dev User claims an eligible quest reward. Token minting amount uses 1e18 multiplier.
     */
    function claim(uint256 questId) external {
        require(eligible[msg.sender][questId], "QuestRegistry: not eligible");
        require(!claimed[msg.sender][questId], "QuestRegistry: already claimed");

        Quest storage q = quests[questId];
        require(q.active, "QuestRegistry: quest not active");

        claimed[msg.sender][questId] = true;
        eligible[msg.sender][questId] = false;

        uint256 amount = q.reward * (10 ** 18);
        token.mint(msg.sender, amount);

        emit Claimed(msg.sender, questId, q.reward);
    }

    /**
     * @dev Owner can directly award tokens for a quest to a user (bypasses eligible/claim).
     */
    function award(address user, uint256 questId) external onlyOwner {
        Quest storage q = quests[questId];
        require(q.active, "QuestRegistry: quest not active");
        uint256 amount = q.reward * (10 ** 18);
        token.mint(user, amount);
        claimed[user][questId] = true;
        emit Awarded(user, questId, q.reward);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Minimal interface for the PunnyPower token contract used for rewards.
interface IPunnyPower {
    function mint(address to, uint256 amount) external;
}

/**
 * @title JokeVoting
 * @notice Store jokes on-chain, allow voting (+1/-1) with per-user vote tracking,
 *         and optionally reward authors with PunnyPower tokens when thresholds are reached.
 */
contract JokeVoting is Ownable {
    struct Joke {
        uint256 id;
        address author;
        string content;
        string imageUrl;
        int256 votes;
        bool exists;
        bool rewardClaimed;
    }

    mapping(uint256 => Joke) private _jokes;
    mapping(uint256 => mapping(address => int8)) public userVote;

    uint256 public nextId = 1;
    IPunnyPower public punnyToken;

    uint256 public rewardThreshold = 10;
    uint256 public rewardAmount = 1 ether;

    event JokeAdded(uint256 indexed id, address indexed author, string content, string imageUrl);
    event Voted(uint256 indexed id, address indexed voter, int8 vote, int256 totalVotes);
    event RewardClaimed(uint256 indexed id, address indexed author, uint256 amount);
    event PunnyTokenUpdated(address indexed token);
    event RewardParamsUpdated(uint256 threshold, uint256 amount);

    constructor(address _punnyToken) {
        if (_punnyToken != address(0)) {
            punnyToken = IPunnyPower(_punnyToken);
        }
    }

    function setPunnyToken(address _token) external onlyOwner {
        punnyToken = IPunnyPower(_token);
        emit PunnyTokenUpdated(_token);
    }

    function setRewardParams(uint256 _threshold, uint256 _amount) external onlyOwner {
        rewardThreshold = _threshold;
        rewardAmount = _amount;
        emit RewardParamsUpdated(_threshold, _amount);
    }

    function addJoke(string calldata content, string calldata imageUrl) external returns (uint256) {
        require(bytes(content).length > 0, "JokeVoting: content empty");
        uint256 id = nextId++;
        _jokes[id] = Joke({
            id: id,
            author: msg.sender,
            content: content,
            imageUrl: imageUrl,
            votes: 0,
            exists: true,
            rewardClaimed: false
        });
        emit JokeAdded(id, msg.sender, content, imageUrl);
        return id;
    }

    function vote(uint256 id, int8 voteType) external {
        require(voteType == int8(1) || voteType == int8(-1), "JokeVoting: invalid vote");
        Joke storage j = _jokes[id];
        require(j.exists, "JokeVoting: joke not found");

        int8 previous = userVote[id][msg.sender];

        if (previous == voteType) {
            userVote[id][msg.sender] = 0;
            j.votes -= voteType;
            emit Voted(id, msg.sender, 0, j.votes);
            return;
        }

        if (previous != 0) {
            j.votes = j.votes - previous + voteType;
        } else {
            j.votes = j.votes + voteType;
        }

        userVote[id][msg.sender] = voteType;
        emit Voted(id, msg.sender, voteType, j.votes);
    }

    function claimReward(uint256 id) external {
        Joke storage j = _jokes[id];
        require(j.exists, "JokeVoting: joke not found");
        require(j.author == msg.sender, "JokeVoting: only author");
        require(!j.rewardClaimed, "JokeVoting: already claimed");
        require(j.votes >= int256(rewardThreshold), "JokeVoting: threshold not met");
        require(address(punnyToken) != address(0), "JokeVoting: token not set");

        j.rewardClaimed = true;
        punnyToken.mint(msg.sender, rewardAmount);
        emit RewardClaimed(id, msg.sender, rewardAmount);
    }

    function getJoke(uint256 id) external view returns (
        uint256, address, string memory, string memory, int256, bool
    ) {
        Joke storage j = _jokes[id];
        require(j.exists, "JokeVoting: joke not found");
        return (j.id, j.author, j.content, j.imageUrl, j.votes, j.rewardClaimed);
    }

    function totalJokes() external view returns (uint256) {
        return nextId - 1;
    }
}

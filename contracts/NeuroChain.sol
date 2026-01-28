// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NeuroChain {
    struct Model {
        string name;
        string author;
        string modelHash;
        uint256 timestamp;
        address sender;
    }

    mapping(string => bool) public hashExists;
    Model[] public models;

    event ModelRegistered(string indexed modelHash, string name, address indexed author);

    function registerModel(string memory _name, string memory _author, string memory _modelHash) public {
        require(!hashExists[_modelHash], "Model already registered!");

        Model memory newModel = Model({
            name: _name,
            author: _author,
            modelHash: _modelHash,
            timestamp: block.timestamp,
            sender: msg.sender
        });

        models.push(newModel);
        hashExists[_modelHash] = true;

        emit ModelRegistered(_modelHash, _name, msg.sender);
    }

    function getModels() public view returns (Model[] memory) {
        return models;
    }
}

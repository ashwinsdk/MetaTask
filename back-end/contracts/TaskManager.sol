// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TaskManager is Ownable {
    uint256 private taskCounter;

    struct Task {
        uint256 id;
        string title;
        string description;
        bool isCompleted;
        address owner;
    }

    mapping(uint256 => Task) private tasks;
    mapping(address => uint256[]) private userTasks;
    mapping(address => uint256) public userTaskCount; // New mapping to track task count per user

    event TaskCreated(uint256 taskId, address owner, string title);
    event TaskCompleted(uint256 taskId);
    event TaskUpdated(
        uint256 taskId,
        string title,
        string description,
        bool isCompleted
    );
    event TaskDeleted(uint256 taskId);

    modifier onlyTaskOwner(uint256 taskId) {
        require(tasks[taskId].owner == msg.sender, "Not the task owner");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function addTask(
        string memory _title,
        string memory _description
    ) external {
        taskCounter++;
        tasks[taskCounter] = Task(
            taskCounter,
            _title,
            _description,
            false,
            msg.sender
        );
        userTasks[msg.sender].push(taskCounter);
        userTaskCount[msg.sender]++; // Increase task count for the user

        emit TaskCreated(taskCounter, msg.sender, _title);
    }

    function markTaskCompleted(uint256 _taskId) external {
        require(tasks[_taskId].owner == msg.sender, "Not the task owner");
        tasks[_taskId].isCompleted = true;

        emit TaskCompleted(_taskId);
    }

    function editTask(
        uint256 _taskId,
        string memory _newTitle,
        string memory _newDescription
    ) external {
        require(tasks[_taskId].owner == msg.sender, "Not the task owner");

        tasks[_taskId].title = _newTitle;
        tasks[_taskId].description = _newDescription;

        emit TaskUpdated(
            _taskId,
            _newTitle,
            _newDescription,
            tasks[_taskId].isCompleted
        );
    }

    function deleteTask(uint256 _taskId) external {
        require(tasks[_taskId].owner == msg.sender, "Not the task owner");

        uint256[] storage userTaskList = userTasks[msg.sender];
        for (uint256 i = 0; i < userTaskList.length; i++) {
            if (userTaskList[i] == _taskId) {
                userTaskList[i] = userTaskList[userTaskList.length - 1];
                userTaskList.pop();
                break;
            }
        }

        delete tasks[_taskId];
        userTaskCount[msg.sender]--; // Decrease task count for the user

        emit TaskDeleted(_taskId);
    }

    function getUserTasks() external view returns (Task[] memory) {
        uint256[] memory taskIds = userTasks[msg.sender];
        uint256 validCount = 0;

        // Count valid tasks first
        for (uint256 i = 0; i < taskIds.length; i++) {
            if (tasks[taskIds[i]].owner != address(0)) {
                validCount++;
            }
        }

        Task[] memory result = new Task[](validCount);
        uint256 index = 0;

        // Store only valid tasks
        for (uint256 i = 0; i < taskIds.length; i++) {
            if (tasks[taskIds[i]].owner != address(0)) {
                result[index] = tasks[taskIds[i]];
                index++;
            }
        }

        return result;
    }
}

import React, { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import transfer from "./contracts/TaskManager.json";

const TaskManagerABI = transfer.abi;
const CONTRACT_ADDRESS = "0x017c0108d7E2BECbD4D08056d8AC42f9EF7E72B5";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (contract) fetchTasks();
  }, [contract]);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
      setContract(new ethers.Contract(CONTRACT_ADDRESS, TaskManagerABI, signer));
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet.");
    }
  }

  function disconnectWallet() {
    setAccount(null);
    setContract(null);
    setTasks([]);
  }

  async function fetchTasks() {
    if (!contract) return;
    try {
      const tasksData = await contract.getUserTasks();
      setTasks(tasksData.map((task, index) => ({
        id: Number(task.id) || index,
        title: task.title,
        description: task.description,
        isCompleted: task.isCompleted,
        owner: task.owner,
      })));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function addTask() {
    if (!contract || !title.trim()) return alert("Task title is required.");
    setLoading(true);
    try {
      const tx = await contract.addTask(title, description);
      await tx.wait();
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
    setLoading(false);
  }

  async function markCompleted(taskId) {
    if (!contract) return;
    try {
      const tx = await contract.markTaskCompleted(taskId);
      await tx.wait();
      fetchTasks();
    } catch (error) {
      console.error("Error marking task completed:", error);
    }
  }

  async function deleteTask(id) {
    if (!contract) return;
    try {
      await contract.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id)); // Remove task from UI
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  function startEditing(task) {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  }

  async function saveEdit() {
    if (!contract || !editingTask) return;
    try {
      const tx = await contract.editTask(editingTask.id, editTitle, editDescription);
      await tx.wait();
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error modifying task:", error);
    }
  }

  return (
    <div className="app-container">
      {/* MetaTask Title and Connect Wallet Section */}
      {!account ? (
        <div className="landing">
          <h1 className="app-title">MetaTask</h1>
          <p className="tagline">A Decentralized Task Manager with Blockchain Security</p>
          <button className="btn connect" onClick={connectWallet}>Connect Wallet</button>
        </div>
      ) : (
        <div className="content">
          <h1 className="app-title">MetaTask</h1>
          <div className="wallet-section">
            <button className="btn disconnect" onClick={disconnectWallet}>Disconnect Wallet</button>
            <p className="wallet-info">Connected Wallet: {account}</p>
          </div>

          <div className="task-input">
            <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button className="btn add-task" onClick={addTask} disabled={loading}>
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>

          <h2 className="subtitle">Your Tasks</h2>

          {tasks.length > 0 ? (
            <div className="task-list">
              {tasks.filter(task => task.title.trim() !== "").map((task) => (
                <div className={`task-card ${task.isCompleted ? "completed" : ""}`} key={task.id}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p className="status">{task.isCompleted ? "✅ Completed" : "⏳ Pending"}</p>
                  {account === task.owner && (
                    <div className="task-actions">
                      <button className="btn complete" onClick={() => markCompleted(task.id)} disabled={task.isCompleted}>{loading ? "Completing..." : "Complete"}</button>
                      <button className="btn delete" onClick={() => deleteTask(task.id)}>{loading ? "Deleting..." : "Delete"}</button>
                      <button className="btn modify" onClick={() => startEditing(task)} disabled={task.isCompleted}>{loading ? "Modifying..." : "Modify"}</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-tasks">No tasks found.</p>
          )}

          {editingTask && (
            <div className="task-list">
              <h3>Modify Task</h3>
              <div className="task-input">
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                <button className="btn complete" onClick={saveEdit}>{loading ? "Saving..." : "Save"}</button>
                <button className="btn delete" onClick={() => setEditingTask(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );


}

export default App;

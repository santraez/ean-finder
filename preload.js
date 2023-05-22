const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTask: (task) => ipcRenderer.send('new-task', task),
    onTaskReply: (callback) => ipcRenderer.on('new-task-reply', (event, args) => callback(args))
});

const taskForm = document.querySelector("#task-form");
const taskCodes = document.querySelector("#task-codes");
const taskResult = document.querySelector("#task-result");
const taskTable = document.querySelector("#task-table");
const submitButton = document.querySelector("#submit-button");
const copyButton = document.querySelector("#copy-button");
const pasteButton = document.querySelector("#paste-button");
const spinner = document.querySelector("#spinner");
const start = document.querySelector("#start");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskCodesValues = taskCodes.value;
  const inputSplit = Array.from(taskCodesValues.split("\n"));
  const inputFilter = inputSplit.filter((item) => item !== '');
  if (taskCodesValues === '') {
    return taskResult.innerHTML = '( vacio )';
  } else if (!checkArray(inputFilter)) {
    return taskResult.innerHTML = '( solo numeros )';
  } else {
    start.style.display = 'none';
    spinner.style.display = 'block';
    taskResult.innerHTML = '( buscando... )';
    clearRows();
    window.electronAPI.setTask(inputFilter);
    return taskForm.reset();
  };
});

submitButton.addEventListener("click", () => {
  const event = new Event("submit");
  taskForm.dispatchEvent(event);
});

pasteButton.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const clipboard = await navigator.clipboard.readText();
    taskCodes.value = clipboard;
    taskResult.innerHTML = '( pegado )';
  } catch (err) {
    console.log(err);
  };
});

copyButton.addEventListener("click", async (e) => {
  try {
    const tableRows = Array.from(taskTable.rows);
    const tableValues = tableRows.map((row) => {
      const rowValues = Array.from(row.cells).map((cell) => cell.innerText);
      return rowValues.join('\t');
    });
    const tableString = tableValues.join('\n');
    await navigator.clipboard.writeText(tableString);
    taskResult.innerHTML = '( copiado )';
  } catch (err) {
    console.log(err);
  };
});

const clearRows = () => {
  while (taskTable.rows.length > 0) {
    taskTable.deleteRow(-1);
  };
};

const checkArray = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (isNaN(arr[i])) {
      return false;
    };
  };
  return true;
};


window.electronAPI.onTaskReply((args) => {
  if (args.length > 0) {
    const [codes, prices] = args;
    codes.map((code, index) => {
      return taskTable.insertRow(-1).innerHTML = `<td style="width: 64.5%">${code}</td><td style="width: 35.5%">${prices[index]}</td>`;
    });
    spinner.style.display = 'none';
    taskResult.innerHTML = '( listo!! )';
  };
});

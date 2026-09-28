const input = document.getElementById('entry');
const submit = document.getElementById('submit');
const entries = document.getElementById('entries');

async function loadEntries() {
  const res = await fetch('/entries');
  const data = await res.json();

  entries.innerHTML = '';
  data.slice().reverse().forEach((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    entries.appendChild(li);
  });
}

async function addEntry() {
  const value = input.value.trim();
  if (!value) return;

  await fetch('/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: value }),
  });

  input.value = '';
  input.focus();
  loadEntries();
}

submit.addEventListener('click', addEntry);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addEntry();
});

loadEntries();

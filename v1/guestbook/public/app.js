const input = document.getElementById('entry');
const submit = document.getElementById('submit');
const entries = document.getElementById('entries');

function addEntry() {
  const value = input.value.trim();
  if (!value) return;

  const li = document.createElement('li');
  li.textContent = value;
  entries.prepend(li);

  input.value = '';
  input.focus();
}

submit.addEventListener('click', addEntry);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addEntry();
});

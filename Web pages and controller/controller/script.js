const ws = new WebSocket('ws://ip_address');

function showVirtualKeyboard(inputElement) {
  const keyboardContainer = document.createElement('div');
  keyboardContainer.id = 'virtualKeyboard';

  const keyboardLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    ['Backspace', 'Shift', '', 'Enter'], 
  ];

  keyboardLayout.forEach(row => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('keyboard-row');

    row.forEach(key => {
      const keyElement = document.createElement('button');
      keyElement.classList.add('keyboard-key');
      keyElement.textContent = key;

      keyElement.onclick = () => {
        if (key === 'Backspace') {
          inputElement.value = inputElement.value.slice(0, -1);
        } else if (key === 'Shift') {
        } else if (key === 'Enter') {
          submitName(); 
        } else {
          inputElement.value += key;
        }
      };

      rowElement.appendChild(keyElement);
    });

    keyboardContainer.appendChild(rowElement);
  });

  document.body.appendChild(keyboardContainer);
}

document.getElementById('start').onclick = () => {
  document.getElementById('home').style.display = 'none';
  document.getElementById('form').style.display = 'block';

  const nameInput = document.getElementById('nameInput');
  showVirtualKeyboard(nameInput);
  nameInput.focus(); 
};

document.getElementById('submitName').onclick = () => {
  const name = document.getElementById('nameInput').value;
  if (name.trim()) {
    ws.send(`Visitor:${name}`);
    document.getElementById('form').style.display = 'none';
    document.getElementById('buttons').style.display = 'block';

    document.getElementById('virtualKeyboard').remove();
  } else {
    alert("Please enter a name.");
  }
};

document.querySelectorAll('.videoBtn').forEach(button => {
  button.onclick = () => {
    const video = button.getAttribute('data-video');
    ws.send(video);
  };
});

document.getElementById('back').onclick = () => {
  document.getElementById('buttons').style.display = 'none';
  document.getElementById('home').style.display = 'block';
};

const slider = document.createElement('input');
slider.type = 'range';
slider.min = 0;
slider.max = 100;
slider.value = 0;
slider.classList.add('video-slider');

const videoContainer = document.getElementById('videoContainer');
videoContainer.appendChild(slider);

slider.addEventListener('input', (event) => {
  const videoPlayer = document.getElementById('videoPlayer');
  videoPlayer.currentTime = (videoPlayer.duration / 100) * event.target.value;
});

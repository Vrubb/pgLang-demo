document.addEventListener('DOMContentLoaded', () => {
  const LETTERS = "KEOENHXYZLRTBAWQMSD";
  const TILE_ROWS = 10;
  const TILE_COLS = 10;
  const TILE_SIZE = 60;
  const WRAP = 3; // Repeat 3x in each direction

  const grid = document.getElementById('grid');
  const popup = document.getElementById('popup');
  const closePopup = document.querySelector('.close-popup');

  let isDragging = false;
  let startX = 0, startY = 0;
  let offsetX = 0, offsetY = 0;
  let velocityX = 0, velocityY = 0;

  // Create base tile (10x10)
  const baseTile = [];
  for (let r = 0; r < TILE_ROWS; r++) {
    const row = [];
    for (let c = 0; c < TILE_COLS; c++) {
      const char = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      row.push(char);
    }
    baseTile.push(row);
  }

  // Create wrapped grid (3x3 tile repeats = 30x30 letters)
  const totalRows = TILE_ROWS * WRAP;
  const totalCols = TILE_COLS * WRAP;

  for (let r = 0; r < totalRows; r++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    rowDiv.dataset.depth = r % WRAP;

    for (let c = 0; c < totalCols; c++) {
      const letter = document.createElement('div');
      letter.className = 'letter';
      const baseChar = baseTile[r % TILE_ROWS][c % TILE_COLS];
      letter.textContent = baseChar;

      if (baseChar === 'G') {
        letter.style.opacity = '1';
        letter.addEventListener('click', e => {
          e.stopPropagation();
          popup.classList.add('active');
        });
      }

      rowDiv.appendChild(letter);
    }
    grid.appendChild(rowDiv);
  }

  function animate() {
    // Slow scroll easing
    offsetX += velocityX;
    offsetY += velocityY;
    velocityX *= 0.9;
    velocityY *= 0.9;

    // Wrap scroll to loop forever
    const maxX = TILE_SIZE * totalCols;
    const maxY = TILE_SIZE * totalRows;
    const wrappedX = ((offsetX % maxX) + maxX) % maxX;
    const wrappedY = ((offsetY % maxY) + maxY) % maxY;

    const rows = grid.children;
    for (let i = 0; i < rows.length; i++) {
      const depth = parseInt(rows[i].dataset.depth);
      const parallax = 1 + depth * 0.05; // stair effect
      rows[i].style.transform = `translate(
        ${-wrappedX}px,
        ${-wrappedY * parallax}px
      )`;
    }

    requestAnimationFrame(animate);
  }

  // Drag handling
  document.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    velocityX = (startX - e.clientX) * 0.2;
    velocityY = (startY - e.clientY) * 0.2;
    startX = e.clientX;
    startY = e.clientY;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  document.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  closePopup.addEventListener('click', () => popup.classList.remove('active'));

  animate();
});

document.addEventListener('DOMContentLoaded', function () {
    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const GRID_SIZE = 10;
    const LETTER_SIZE = 100;
    const PARALLAX_VARIATION = 0.3;
    const SCROLL_EASING = 0.1;
    const gridContainer = document.getElementById('gridContainer');
    const grid = document.getElementById('grid');
    const popup = document.getElementById('popup');
    const closePopup = document.querySelector('.close-popup');
    let virtualScrollX = 0;
    let virtualScrollY = 0;
    let targetScrollX = 0;
    let targetScrollY = 0;
    let isDragging = false;
    let startX, startY;
    let tiles = [];
    function getRandomLetter() {
        return LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }

    function createGrid() {
        grid.innerHTML = '';
        grid.style.width = `${GRID_SIZE * LETTER_SIZE}px`;
        grid.style.height = `${GRID_SIZE * LETTER_SIZE}px`;

        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                const letter = document.createElement('div');
                letter.className = 'letter';
                letter.textContent = getRandomLetter();
                if (letter.textContent === 'G') {
                    letter.style.opacity = '1';
                    letter.addEventListener('click', function (e) {
                        e.stopPropagation();
                        popup.classList.add('active');
                    });
                }

                grid.appendChild(letter);
                tiles.push({
                    element: letter,
                    baseX: x,
                    baseY: y,
                    parallaxOffset: Math.random() * PARALLAX_VARIATION,
                });
            }
        }
    }

    function animate() {
        virtualScrollX += (targetScrollX - virtualScrollX) * SCROLL_EASING;
        virtualScrollY += (targetScrollY - virtualScrollY) * SCROLL_EASING;
        const gridWidth = GRID_SIZE * LETTER_SIZE;
        const gridHeight = GRID_SIZE * LETTER_SIZE;
        tiles.forEach(tile => {
            let x = tile.baseX * LETTER_SIZE;
            let y = tile.baseY * LETTER_SIZE;
            let offsetX = ((x - virtualScrollX) % gridWidth + gridWidth) % gridWidth;
            let offsetY = ((y - virtualScrollY * (1 + tile.parallaxOffset)) % gridHeight + gridHeight) % gridHeight;
            tile.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });

        requestAnimationFrame(animate);
    }

    function handleMouseDown(e) {
        isDragging = true;
        startX = e.clientX - targetScrollX;
        startY = e.clientY - targetScrollY;
        document.body.style.cursor = 'grabbing';
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        targetScrollX = e.clientX - startX;
        targetScrollY = e.clientY - startY;
    }

    function handleMouseUp() {
        isDragging = false;
        document.body.style.cursor = 'grab';
    }

    function init() {
        createGrid();
        gridContainer.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);
        closePopup.addEventListener('click', () => popup.classList.remove('active'));
        animate();
    }

    init();
});

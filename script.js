document.addEventListener('DOMContentLoaded', function () {
    // Configuration
    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const ROW_COUNT = 100;
    const COLUMN_COUNT = 100;
    const SCROLL_SPEED = 0.08;
    const LETTER_SIZE = 60;
    const PARALLAX_RANGE = 0.3;

    // DOM Elements
    const gridContainer = document.getElementById('gridContainer');
    const grid = document.getElementById('grid');
    const popup = document.getElementById('popup');
    const closePopup = document.querySelector('.close-popup');

    // State
    let scrollX = 0;
    let scrollY = 0;
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let startX = 0, startY = 0;
    let animationId = null;

    // Generate random letter
    function getRandomLetter() {
        return LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }

    // Create the grid
    function createGrid() {
        grid.innerHTML = '';
        grid.style.width = `${COLUMN_COUNT * LETTER_SIZE}px`;
        grid.style.height = `${ROW_COUNT * LETTER_SIZE}px`;

        for (let r = 0; r < ROW_COUNT; r++) {
            const row = document.createElement('div');
            row.className = 'row';

            for (let c = 0; c < COLUMN_COUNT; c++) {
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

                row.appendChild(letter);
            }

            grid.appendChild(row);
        }
    }

    // Main animation loop
    function animate() {
        scrollX += (targetX - scrollX) * SCROLL_SPEED;
        scrollY += (targetY - scrollY) * SCROLL_SPEED;

        const maxX = grid.offsetWidth - gridContainer.offsetWidth;
        const maxY = grid.offsetHeight - gridContainer.offsetHeight;

        // Wrap scroll for infinite feel
        if (scrollX > 0) scrollX = -maxX;
        if (scrollX < -maxX) scrollX = 0;
        if (scrollY > 0) scrollY = -maxY;
        if (scrollY < -maxY) scrollY = 0;

        // Apply main grid transform
        grid.style.transform = `translate(${scrollX}px, ${scrollY}px)`;

        // Apply vertical parallax to each row
        const rows = document.querySelectorAll('.row');
        rows.forEach((row, i) => {
            const offset = (i / ROW_COUNT - 0.5) * PARALLAX_RANGE * scrollY;
            row.style.transform = `translateY(${offset}px)`;
        });

        animationId = requestAnimationFrame(animate);
    }

    // Mouse event handlers
    function handleMouseDown(e) {
        if (popup.classList.contains('active')) return; // Don't allow drag when popup is open
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        document.body.style.cursor = 'grabbing';
    }

    function handleMouseMove(e) {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        targetX += dx;
        targetY += dy;

        startX = e.clientX;
        startY = e.clientY;
    }

    function handleMouseUp() {
        isDragging = false;
        document.body.style.cursor = 'grab';
    }

    // Initialization
    function init() {
        createGrid();

        gridContainer.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);

        closePopup.addEventListener('click', () => {
            popup.classList.remove('active');
        });

        animate();
    }

    init();
});

document.addEventListener('DOMContentLoaded', function () {
    const LETTERS = "KEOENHXYZLRTBAWQMSD"; // Randomized alphabet
    const ROW_COUNT = 20;
    const COLUMN_COUNT = 20;
    const LETTER_SIZE = 60;
    const PARALLAX_DEPTH = 10; // Number of layers of depth
    const PARALLAX_STEP = 0.03; // Parallax difference between layers
    const SCROLL_EASING = 0.1;

    const gridContainer = document.getElementById('gridContainer');
    const grid = document.getElementById('grid');
    const popup = document.getElementById('popup');
    const closePopup = document.querySelector('.close-popup');

    let scrollX = 0;
    let scrollY = 0;
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let startX, startY;
    let offsetX = 0;
    let offsetY = 0;

    function createGrid() {
        grid.innerHTML = '';
        grid.style.width = `${COLUMN_COUNT * LETTER_SIZE}px`;
        grid.style.height = `${ROW_COUNT * LETTER_SIZE}px`;

        for (let r = 0; r < ROW_COUNT; r++) {
            const row = document.createElement('div');
            row.className = 'row';
            row.dataset.depth = (r % PARALLAX_DEPTH); // Assign depth layer

            for (let c = 0; c < COLUMN_COUNT; c++) {
                const letter = document.createElement('div');
                letter.className = 'letter';

                const randomChar = LETTERS[Math.floor(Math.random() * LETTERS.length)];
                letter.textContent = randomChar;

                if (randomChar === 'G') {
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

    function animate() {
        scrollX += (targetX - scrollX) * SCROLL_EASING;
        scrollY += (targetY - scrollY) * SCROLL_EASING;

        const modX = scrollX % (COLUMN_COUNT * LETTER_SIZE);
        const modY = scrollY % (ROW_COUNT * LETTER_SIZE);

        [...grid.children].forEach(row => {
            const depth = parseInt(row.dataset.depth);
            const parallaxOffset = depth * PARALLAX_STEP;

            const transformX = modX;
            const transformY = modY * (1 + parallaxOffset);

            row.style.transform = `translate(${transformX}px, ${transformY}px)`;
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    function handleMouseDown(e) {
        isDragging = true;
        startX = e.clientX - targetX;
        startY = e.clientY - targetY;
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        targetX = e.clientX - startX;
        targetY = e.clientY - startY;
        e.preventDefault();
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


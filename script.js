document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const ROW_COUNT = 100;
    const COLUMN_COUNT = 100;
    const SCROLL_SPEED = 0.08;
    const LETTER_SIZE = 60;
    const PARALLAX_INTENSITY = 0.3; // Added parallax control
    
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
    let startX, startY;
    let animationId = null;
    
    // Create grid with randomized letters
    function createGrid() {
        grid.innerHTML = '';
        grid.style.width = `${COLUMN_COUNT * LETTER_SIZE}px`;
        grid.style.height = `${ROW_COUNT * LETTER_SIZE}px`;
        
        // Create rows (vertical)
        for (let r = 0; r < ROW_COUNT; r++) {
            const row = document.createElement('div');
            row.className = 'row';
            
            // Create columns (horizontal)
            for (let c = 0; c < COLUMN_COUNT; c++) {
                const letter = document.createElement('div');
                letter.className = 'letter';
                // Random letter generation
                const randomIndex = Math.floor(Math.random() * LETTERS.length);
                letter.textContent = LETTERS[randomIndex];
                
                // Add parallax data attributes
                letter.dataset.parallaxX = (Math.sin(r/10 + c/10) * PARALLAX_INTENSITY).toFixed(2);
                letter.dataset.parallaxY = (Math.cos(r/10 + c/10) * PARALLAX_INTENSITY).toFixed(2);

                // Make "G" interactive
                if (letter.textContent === 'G') {
                    letter.style.opacity = '1';
                    letter.addEventListener('click', function(e) {
                        e.stopPropagation();
                        popup.classList.add('active');
                    });
                }
                
                row.appendChild(letter);
            }
            
            grid.appendChild(row);
        }
    }

    // Animation loop with parallax
    function animate() {
        // Apply easing
        scrollX += (targetX - scrollX) * SCROLL_SPEED;
        scrollY += (targetY - scrollY) * SCROLL_SPEED;
        
        // Apply parallax transformation
        const letters = document.getElementsByClassName('letter');
        for(let letter of letters) {
            const px = parseFloat(letter.dataset.parallaxX);
            const py = parseFloat(letter.dataset.parallaxY);
            letter.style.transform = `translate(
                ${scrollX * px}px,
                ${scrollY * py}px
            )`;
        }

        // Infinite scroll wrapping
        const maxX = grid.offsetWidth - gridContainer.offsetWidth;
        const maxY = grid.offsetHeight - gridContainer.offsetHeight;
        
        if (scrollX > maxX) scrollX -= maxX;
        if (scrollX < -maxX) scrollX += maxX;
        if (scrollY > maxY) scrollY -= maxY;
        if (scrollY < -maxY) scrollY += maxY;

        // Apply main scroll transform
        grid.style.transform = `translate(
            ${scrollX}px,
            ${scrollY}px
        )`;

        animationId = requestAnimationFrame(animate);
    }

    // Improved drag handling
    function handleMouseDown(e) {
        isDragging = true;
        startX = e.clientX - scrollX;
        startY = e.clientY - scrollY;
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        
        // Smoother drag calculation
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        targetX = deltaX * 0.8; // Reduced speed multiplier
        targetY = deltaY * 0.8;
        
        e.preventDefault();
    }

    // Rest of the code remains the same...
    // Keep all other existing functions and initialization code
});
    }
    
    init();
});

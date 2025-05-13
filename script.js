document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const ROW_COUNT = 100;   // Rows (vertical)
    const COLUMN_COUNT = 100; // Columns (horizontal)
    const SCROLL_SPEED = 0.08;
    const LETTER_SIZE = 60;   // px
    
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
    
    // Create grid
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
                const letterIndex = (r + c) % LETTERS.length;
                letter.textContent = LETTERS[letterIndex];
                
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
    
    // Animation loop
    function animate() {
        // Apply easing
        scrollX += (targetX - scrollX) * SCROLL_SPEED;
        scrollY += (targetY - scrollY) * SCROLL_SPEED;
        
        // Infinite scroll wrapping
        const maxX = grid.offsetWidth - gridContainer.offsetWidth;
        const maxY = grid.offsetHeight - gridContainer.offsetHeight;
        
        if (scrollX > 0) scrollX = -maxX;
        if (scrollX < -maxX) scrollX = 0;
        if (scrollY > 0) scrollY = -maxY;
        if (scrollY < -maxY) scrollY = 0;
        
        // Apply transform
        grid.style.transform = `translate(${scrollX}px, ${scrollY}px)`;
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Event handlers
    function handleMouseDown(e) {
        isDragging = true;
        startX = e.clientX - scrollX;
        startY = e.clientY - scrollY;
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
    
    // Initialize
    function init() {
        createGrid();
        
        // Event listeners
        gridContainer.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);
        
        closePopup.addEventListener('click', function() {
            popup.classList.remove('active');
        });
        
        animate();
    }
    
    init();
});

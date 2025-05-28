document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const currentSlideNumEl = document.getElementById('currentSlideNum');
    const totalSlideNumEl = document.getElementById('totalSlideNum');

    let currentSlide = 0;

    if (!slides.length) {
        console.error("No slides found. Deck cannot operate.");
        return;
    }
    
    totalSlideNumEl.textContent = slides.length;

    function updateSlideIndicator() {
        currentSlideNumEl.textContent = currentSlide + 1;
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i === index) {
                slide.classList.add('active');
            } else if (i < index) {
                // slide.classList.add('prev'); // Optional: Keep previous slides to the left
            }
        });
        currentSlide = index;
        updateSlideIndicator();

        // Disable/enable buttons
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === slides.length - 1;
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            slides[currentSlide].classList.remove('active'); // Current slide starts to move out
            slides[currentSlide].classList.add('prev');     // Mark as previous to slide left
            
            currentSlide++;
            slides[currentSlide].classList.add('active'); // New slide becomes active and slides in
            updateSlideIndicator();
        }
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === slides.length - 1;
    }

    function prevSlide() {
        if (currentSlide > 0) {
            slides[currentSlide].classList.remove('active'); // Current slide moves out (to right by default)
            // No need to add 'prev' to current, it's moving out to become next effectively
            
            currentSlide--;
            slides[currentSlide].classList.remove('prev'); // Ensure it's not marked as 'prev'
            slides[currentSlide].classList.add('active');  // New active slide
            updateSlideIndicator();
        }
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === slides.length - 1;
    }

    // Event Listeners
    if(prevButton) prevButton.addEventListener('click', prevSlide);
    if(nextButton) nextButton.addEventListener('click', nextSlide);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
            if (currentSlide < slides.length - 1) {
                nextSlide();
            }
        } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
            if (currentSlide > 0) {
                prevSlide();
            }
        } else if (event.key === 'Home') {
            showSlide(0);
        } else if (event.key === 'End') {
            showSlide(slides.length - 1);
        }
    });

    // Initial setup
    if (slides.length > 0) {
        showSlide(0); // Show the first slide initially
    }
});
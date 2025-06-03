// Slideshow functionality for HidroSafe site

let slideIndex = 1;

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    showSlides(slideIndex);
    
    // Auto advance slides every 5 seconds
    setInterval(function() {
        changeSlide(1);
    }, 5000);
});

// Next/previous controls
function changeSlide(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    if (!slides.length) return;
    
    // Loop back to first slide if at the end
    if (n > slides.length) {
        slideIndex = 1;
    }
    
    // Go to last slide if going back from first slide
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    // Hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Show current slide and activate corresponding dot
    slides[slideIndex-1].style.display = "block";
    if (dots.length > 0) {
        dots[slideIndex-1].className += " active";
    }
}
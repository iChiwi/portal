document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-content .nav-links');
  
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-content')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    navLinks.querySelectorAll('.nav-button').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    const scrollButton = document.querySelector('.scroll-top');
    
    const toggleScrollButton = () => {
        if (window.scrollY > 0) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleScrollButton);
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

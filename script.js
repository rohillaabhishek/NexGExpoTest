// --- Mobile Menu Logic ---
        const mobileMenu = document.getElementById('mobile-menu');
        const openButton = document.getElementById('mobile-menu-open-button');
        const closeButton = document.getElementById('mobile-menu-close-button');

        openButton.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });

        closeButton.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });


        // --- Multi-Page Form Logic ---
        let currentPage = 1;
        const totalPages = 4;
        const form = document.getElementById('surveyForm');
        const formContainer = document.getElementById('formContainer');
        const thankYouMessage = document.getElementById('thankYouMessage');
        const nextButton = document.getElementById('nextButton');
        const backButton = document.getElementById('backButton');
        const submitButton = document.getElementById('submitButton');
        const pageCurrent = document.getElementById('page-current');
        const pageTotal = document.getElementById('page-total');
        const progressBar = document.getElementById('progress-bar');

        document.addEventListener('DOMContentLoaded', () => {
            showPage(1); // Show the first page on load
            pageTotal.textContent = totalPages;
        });

        function showPage(pageNumber) {
            // Hide all pages
            document.querySelectorAll('.form-page').forEach(page => {
                page.classList.remove('active');
            });

            // Show the requested page
            const activePage = document.getElementById(`page-${pageNumber}`);
            if (activePage) {
                activePage.classList.add('active');
            }

            // Update state
            currentPage = pageNumber;

            // Update UI elements
            pageCurrent.textContent = currentPage;
            progressBar.style.width = `${(currentPage / totalPages) * 100}%`;

            // Update button visibility
            backButton.style.display = (currentPage === 1) ? 'none' : 'inline-flex';
            nextButton.style.display = (currentPage === totalPages) ? 'none' : 'inline-flex';
            
            // Show submit button only on the last page
            // and hide the 'next' button.
            if (currentPage === totalPages) {
                submitButton.style.display = 'inline-flex';
                nextButton.style.display = 'none';
            } else {
                submitButton.style.display = 'none';
                nextButton.style.display = 'inline-flex';
            }
            
            // Scroll to the top of the form
            document.getElementById('survey-section').scrollIntoView({ behavior: 'smooth' });
        }

        function validatePage(pageNumber) {
            const page = document.getElementById(`page-${pageNumber}`);
            const errorMsg = document.getElementById(`page-${pageNumber}-error`);
            let isValid = true;
            
            // Find all 'required' inputs on the current page
            const requiredInputs = page.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                input.classList.remove('validation-error'); // Clear previous errors
                let fieldset = input.closest('fieldset');
                if (fieldset) fieldset.classList.remove('validation-error');
                
                let isFilled = false;
                if (input.type === 'radio' || input.type === 'checkbox') {
                    const groupName = input.name;
                    if (form.querySelector(`input[name="${groupName}"]:checked`)) {
                        isFilled = true;
                    }
                } else if (input.value.trim() !== '') {
                    isFilled = true;
                }

                if (!isFilled) {
                    isValid = false;
                    input.classList.add('validation-error');
                    // For radio/checkbox groups, highlight the container
                    if(fieldset) {
                        fieldset.classList.add('validation-error');
                    }
                }
            });

            if (!isValid && errorMsg) {
                errorMsg.style.display = 'block';
            } else if (errorMsg) {
                errorMsg.style.display = 'none';
            }

            return isValid;
        }

        nextButton.addEventListener('click', () => {
            // Validate required fields on Page 1
            if (currentPage === 1 && !validatePage(1)) {
                return; // Stop if validation fails
            }
            
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
            }
        });

        backButton.addEventListener('click', () => {
            if (currentPage > 1) {
                showPage(currentPage - 1);
            }
        });

        // --- Form Submission Logic ---
        form.addEventListener('submit', handleSubmit);

        async function handleSubmit(event) {
            event.preventDefault();
            
            // Final validation for the last page
            if (!validatePage(totalPages)) {
                 return; 
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            const formActionURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdAlLA2cKAfSEpg4owVsSeLPEr_xzwlalrZi80aRtcO8zhuiw/formResponse';
            const formData = new FormData(form);

            try {
                await fetch(formActionURL, {
                    method: 'POST',
                    mode: 'no-cors', 
                    body: formData,
                });
                
                // This is the "Thank You" screen logic
                formContainer.style.display = 'none';
                thankYouMessage.style.display = 'block';

                // Scroll to the top of the thank you message
                thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Error submitting form:', error);
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Feedback';
                // Do not use alert()
                const errorMsg = document.getElementById(`page-${totalPages}-error`);
                if(errorMsg) {
                    errorMsg.textContent = 'There was an error submitting your form. Please try again.';
                    errorMsg.style.display = 'block';
                }
            }
        }

        // --- Smooth Scroll for Hero Button ---
        document.getElementById('heroSurveyButton').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('survey-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        // --- Smooth Scroll for Nav Link ---
        document.querySelectorAll('a[href="#survey-section"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.getElementById('survey-section').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
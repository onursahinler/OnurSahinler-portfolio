// Portfolio Navigation and Interactions
// Prevent browser from restoring scroll position
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Scroll to top on page load/refresh
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
    // Force scroll after a small delay to ensure everything is rendered
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 0);
});

document.addEventListener('DOMContentLoaded', function() {
    // Scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Navigation elements
    const navItems = document.querySelectorAll('.nav-item');
    const nextBtn = document.querySelector('.next-btn');
    const generateBtn = document.querySelector('.generate-btn');
    const ctaButton = document.querySelector('.cta-button');
    
    // Mobile navigation elements
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Current section tracking
    let currentSection = 0;
    const sections = ['about', 'experience', 'projects', 'education', 'skills', 'certificates', 'hobbies', 'contact'];
    
    // Initialize (without scrolling)
    updateActiveSection(0, false);
    
    // Navigation click handlers
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSection = index;
            // Check if mobile menu is open
            const isMobile = window.innerWidth <= 768;
            const menuOpen = sidebar && sidebar.classList.contains('mobile-open');
            
            if (isMobile && menuOpen) {
                // Close mobile menu first
                sidebar.classList.remove('mobile-open');
                sidebarOverlay.classList.remove('mobile-open');
                document.body.style.overflow = '';
                // Scroll with delay for menu close animation
                updateActiveSection(index, true, 350);
            } else {
                // Normal scroll
                updateActiveSection(index, true);
            }
        });
    });
    
    // Next button handler
    nextBtn.addEventListener('click', () => {
        if (currentSection < sections.length - 1) {
            currentSection++;
            updateActiveSection(currentSection, true);
        } else if (currentSection === sections.length - 1) {
            // If on contact page, scroll to surprise button and show popup
            scrollToSurpriseButton();
        }
    });
    
    // Generate button handler
    generateBtn.addEventListener('click', () => {
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        generateBtn.disabled = true;
        
        setTimeout(() => {
            generateBtn.innerHTML = '<i class="fas fa-sync"></i> Update';
            generateBtn.disabled = false;
            showNotification('Information updated!', 'success');
        }, 1500);
    });
    
    // CTA Button handler
    ctaButton.addEventListener('click', () => {
        // Open CV in new window
        ctaButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        ctaButton.disabled = true;
        
        // Open CV in new tab
        const cvWindow = window.open('Onur_Sahinler_CompEngineer_CV.pdf', '_blank');
        
        // Reset button after opening
        setTimeout(() => {
            ctaButton.innerHTML = '<i class="fas fa-download"></i> Download CV';
            ctaButton.disabled = false;
            showNotification('CV opened in new tab! You can download it from there.', 'success');
        }, 1000);
        
        // Check if popup was blocked
        if (!cvWindow || cvWindow.closed || typeof cvWindow.closed == 'undefined') {
            setTimeout(() => {
                ctaButton.innerHTML = '<i class="fas fa-download"></i> Download CV';
                ctaButton.disabled = false;
                showNotification('Popup blocked! Please allow popups and try again.', 'error');
            }, 1000);
        }
    });
    
    // Option buttons handler
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const group = button.parentElement;
            const buttons = group.querySelectorAll('.option-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Mobile navigation handlers
    if (mobileNavToggle && sidebar && sidebarOverlay) {
        mobileNavToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
            sidebarOverlay.classList.toggle('mobile-open');
            document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
        });
        
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('mobile-open');
            document.body.style.overflow = '';
        });
        
        
        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('mobile-open');
                sidebarOverlay.classList.remove('mobile-open');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Update active section
    function updateActiveSection(index, shouldScroll = true, scrollDelay = 100) {
        // Update navigation
        navItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        // Update section content
        updateSectionContent(index);
        
        // Update next button
        if (index === sections.length - 1) {
            nextBtn.innerHTML = '<span>Complete</span><i class="fas fa-check"></i>';
        } else {
            nextBtn.innerHTML = '<span>Next Section</span><i class="fas fa-arrow-right"></i>';
        }
        
        // Scroll to top of main section after content update (only if shouldScroll is true)
        if (shouldScroll) {
            setTimeout(() => {
                const mainSection = document.querySelector('.main-section');
                if (mainSection) {
                    // Get the absolute position of main-section
                    const mainSectionRect = mainSection.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const targetY = mainSectionRect.top + scrollTop - 20; // 20px padding from top
                    
                    // Fast, smooth scroll - single continuous motion
                    const startY = window.pageYOffset;
                    const distance = targetY - startY;
                    // Faster duration - 400-600ms for smooth but quick scroll
                    const duration = Math.min(Math.max(Math.abs(distance) * 0.4, 400), 600);
                    let start = null;
                    
                    // Smooth ease-out-quart for fluid motion
                    function easeOutQuart(t) {
                        return 1 - Math.pow(1 - t, 4);
                    }
                    
                    function step(timestamp) {
                        if (!start) start = timestamp;
                        
                        const elapsed = timestamp - start;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Apply smooth easing
                        const eased = easeOutQuart(progress);
                        const currentY = startY + distance * eased;
                        
                        window.scrollTo(0, currentY);
                        
                        // Continue until complete
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        }
                    }
                    
                    requestAnimationFrame(step);
                }
            }, scrollDelay); // Delay to ensure content is rendered (longer for mobile menu close)
        }
    }
    
    // Initialize scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); // Stagger animation
                }
            });
        }, observerOptions);
        
        // Observe elements that should animate on scroll
        const animatedElements = document.querySelectorAll('.experience-item, .project-item, .skill-category, .certificate-item, .hobby-item, .contact-item, .education-item, .about-content');
        animatedElements.forEach(el => {
            if (!el.classList.contains('fade-in')) {
                el.classList.add('fade-in');
                observer.observe(el);
            }
        });
    }
    
    // Update section content based on current section
    function updateSectionContent(index) {
        const sectionTitle = document.querySelector('.section-title');
        const formContainer = document.querySelector('.form-container');
        
        // Add fade out animation
        if (formContainer) {
            formContainer.style.opacity = '0';
            formContainer.style.transform = 'translateY(20px)';
            formContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }
        
        setTimeout(() => {
            const sectionData = {
            0: {
                title: 'ABOUT',
                content: getAboutContent()
            },
            1: {
                title: 'EXPERIENCE',
                content: getExperienceContent()
            },
            2: {
                title: 'PROJECTS',
                content: getProjectsContent()
            },
            3: {
                title: 'EDUCATION',
                content: getEducationContent()
            },
            4: {
                title: 'SKILLS',
                content: getSkillsContent()
            },
            5: {
                title: 'CERTIFICATES & AWARDS',
                content: getCertificatesContent()
            },
            6: {
                title: 'HOBBIES',
                content: getHobbiesContent()
            },
            7: {
                title: 'CONTACT',
                content: getContactContent()
            }
        };
        
            const currentData = sectionData[index];
            sectionTitle.textContent = currentData.title;
            formContainer.innerHTML = currentData.content;
            
            // Re-initialize scroll animations for new content
            setTimeout(() => {
                initScrollAnimations();
            }, 100);
            
            // Fade in animation
            formContainer.style.opacity = '1';
            formContainer.style.transform = 'translateY(0)';
            
            // Re-attach event listeners for new content
            attachEventListeners();
        }, 300);
    }
    
    // Get about section content
    function getAboutContent() {
        return `
            <div class="form-group">
                <div class="about-content">
                    <div class="about-intro">
                        <h3>Hello! I'm Onur Şahinler</h3>
                        <p class="about-subtitle">Computer Engineering graduate passionate about Software Testing!</p>
                    </div>
                    
                    <div class="about-paragraph">
                        <p>The main reason I chose computer engineering was my passion for computers and electronic devices from an early age.</p>
                    </div>
                    
                    <div class="about-paragraph">
                        <p>Seeing how technology shapes our lives and the idea of being part of this transformation provides me with great motivation. In the software development process, I want to develop projects that benefit humanity by utilizing both my analytical thinking skills and my ability to approach problems from different perspectives.</p>
                    </div>
                    
                    <div class="about-paragraph">
                        <p>I prefer working with a team rather than working alone. Being in dialogue with people, developing projects through discussion and debate has always made me feel better.</p>
                    </div>
                    
                    <div class="about-location">
                        <p><i class="fas fa-map-marker-alt"></i> By the way, I was born and raised in İzmir, Türkiye :)</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Get experience section content
    function getExperienceContent() {
        // Calculate current experience duration
        const currentJobStart = new Date('2025-09-01'); // September 2025
        const now = new Date();
        const currentJobMonths = Math.max(1, (now.getFullYear() - currentJobStart.getFullYear()) * 12 + (now.getMonth() - currentJobStart.getMonth()) + 1);
        
        return `
            <div class="form-group">
                <div class="experience-content">
                    
                    <!-- Experience 1: Current Job -->
                    <div class="experience-item">
                        <div class="experience-header">
                            <h3>Full Stack Developer (Erasmus+ Traineeship)</h3>
                            <span class="experience-duration">September 2025 - Present · ${currentJobMonths} months</span>
                        </div>
                        <div class="experience-org">
                            <strong><a href="https://www.maastrichtuniversity.nl/research/institute-data-science" target="_blank" rel="noopener noreferrer">Maastricht University Institute of Data Science</a></strong> · Intern
                        </div>
                        <div class="experience-location">
                            <i class="fas fa-map-marker-alt"></i> Maastricht, Limburg, Netherlands · Office-based Work
                        </div>
                        <div class="experience-description">
                            <p>Working under the guidance of Asst. Prof. Chang Sun to predict cardiovascular disease risks in leukemia patients.</p>
                            <div class="experience-achievements">
                                <h4>Key Contributions:</h4>
                                <ul>
                                    <li>Built a responsive Next.js + TypeScript + Tailwind CSS web app with a clinician-friendly interface</li>
                                    <li>Developed an AI-powered cardiovascular risk assessment tool for CML patients </li>
                                    <li>Designed a secure doctor authentication system and intuitive multi-step patient workflow</li>
                                    <li>Integrated Explainable AI with clinical guidelines through LLMs</li>
                                    <li>Created a multi-agent system for early cardiovascular risk detection</li>
                                    <li>Performed software testing to ensure reliability, performance, and cross-platform compatibility</li>
                                </ul>
                                <p><strong>Project Goal:</strong> Bridges AI and healthcare, empowering clinicians with a transparent and reliable tool for early cardiovascular risk detection.</p>
                            </div>
                        </div>
                        <div class="experience-skills">
                            <i class="fas fa-gem"></i> Next.js, TypeScript, React, Tailwind CSS, Authentication, Healthcare Data Processing, Machine Learning Integration, Software Testing
                        </div>
                    </div>

                    <!-- Experience 2: QA Intern -->
                    <div class="experience-item">
                        <div class="experience-header">
                            <h3>Software QA Engineer Intern</h3>
                            <span class="experience-duration">June 2024 - October 2024 · 5 months</span>
                        </div>
                        <div class="experience-org">
                            <strong><a href="https://www.beforesunset.ai" target="_blank" rel="noopener noreferrer">BeforeSunset AI</a></strong> · Intern
                        </div>
                        <div class="experience-location">
                            <i class="fas fa-map-marker-alt"></i> İzmir, Turkey · Hybrid
                        </div>
                        <div class="experience-description">
                            <p>Internship where contributions were made to improving product quality and reliability.</p>
                            <div class="experience-achievements">
                                <h4>Responsibilities:</h4>
                                <p>Conducted functional, design, and performance testing; identified and reported bugs; collaborated with developers to resolve issues.</p>
                                <h4>Achievements:</h4>
                                <p>Optimized database queries to enhance application performance; gained hands-on experience in test automation, debugging, and QA best practices within an agile environment.</p>
                            </div>
                        </div>
                        <div class="experience-skills">
                            <i class="fas fa-gem"></i> Software Testing, Manual Testing, Test Planning, API Testing with Postman, SQL, Databases, Scenario Testing
                        </div>
                    </div>

                    <!-- Experience 3: Test Camp -->
                    <div class="experience-item">
                        <div class="experience-header">
                            <h3>Test Camp Participant</h3>
                            <span class="experience-duration">April 2025 - May 2025 · 2 months</span>
                        </div>
                        <div class="experience-org">
                            <strong><a href="https://www.commencis.com" target="_blank" rel="noopener noreferrer">Commencis</a></strong> · Part-time
                        </div>
                        <div class="experience-location">
                            <i class="fas fa-map-marker-alt"></i> Remote
                        </div>
                        <div class="experience-description">
                            <p>An online training program where hands-on experience in software testing was gained with guidance from experienced QA professionals.</p>
                            <div class="experience-achievements">
                                <h4>Learned/Worked on:</h4>
                                <ul>
                                    <li>Fundamentals of software testing and its role in the SDLC</li>
                                    <li>Test process and the importance of static testing</li>
                                    <li>Black-box and white-box test techniques</li>
                                    <li>Basics of test management and related tools</li>
                                    <li>Test automation frameworks and practices</li>
                                    <li>CI/CD integration, performance, and security testing</li>
                                </ul>
                            </div>
                        </div>
                        <div class="experience-skills">
                            <i class="fas fa-gem"></i> Software Test Engineering, Software Quality Assurance, QA Engineering
                        </div>
                    </div>

                    <!-- Experience 4: Co-Founder -->
                    <div class="experience-item">
                        <div class="experience-header">
                            <h3>Co-Founder and Former Board Member</h3>
                            <span class="experience-duration">October 2024 - July 2025 · 10 months</span>
                        </div>
                        <div class="experience-org">
                            <strong><a href="https://www.instagram.com/iytefayda/" target="_blank" rel="noopener noreferrer">IZTECH Fayda Society</a></strong> · Volunteer Work
                        </div>
                        <div class="experience-location">
                            <i class="fas fa-map-marker-alt"></i> Urla, İzmir, Turkey · Remote
                        </div>
                        <div class="experience-description">
                            <p>Co-founder and former board member of the Lösev Fayda Community at IZTECH. Served as Sponsorship Coordinator and Treasurer. Actively organized events and initiatives to support children with leukemia, while fostering social responsibility and community engagement among students.</p>
                        </div>
                        <div class="experience-skills">
                            <i class="fas fa-gem"></i> Project Management, Sponsorship Coordination, Project Planning, Account Management
                        </div>
                    </div>

                </div>
            </div>
        `;
    }
    
    // Get projects section content
    function getProjectsContent() {
        return `
            <div class="form-group">
                <div class="projects-content">
                    
                    <!-- Project 1: Clinical Decision Support Tool -->
                    <div class="project-item">
                        <div class="project-header">
                            <h3>AI-Powered Clinical Decision Support Tool for Cardiovascular Risk Assessment</h3>
                            <span class="project-duration">September 2025 - Present</span>
                        </div>
                        <div class="project-description">
                            <p>I am working as a Full Stack Developer under the guidance of Asst. Prof. Chang Sun to predict cardiovascular disease risks in leukemia patients. In this project, I am building an advanced clinical decision support system that combines machine learning predictions with large language model–powered explanations and interventions, creating a transparent and actionable tool for clinicians.</p>
                            <p>My work bridges AI and healthcare by empowering clinicians with a comprehensive multi-agent system for early cardiovascular risk detection. The system uses a Random Forest model with SHAP (SHapley Additive exPlanations) for interpretable predictions, enhanced by a sophisticated multi-agent architecture that includes:</p>
                            <ul>
                                <li>a Prediction Agent for risk scoring,</li>
                                <li>an Explanation Agent that converts SHAP values into natural language explanations using LLMs,</li>
                                <li>an Intervention Agent that provides evidence-based treatment recommendations, and</li>
                                <li>a Knowledge Agent that answers clinical questions about features, CML, and CVD.</li>
                            </ul>
                            <p>The platform also includes a modern Next.js web interface with interactive SHAP visualizations, real-time what-if scenario analysis, and an AI-powered chatbot that intelligently routes queries to specialized agents. By integrating explainable AI with clinical guidelines through LLMs, I aim to significantly enhance the system's explainability, transparency, and practical utility for supporting patient care decisions.</p>
                        </div>
                        <div class="project-technologies">
                            <i class="fas fa-gem"></i> Next.js, TypeScript, Tailwind CSS, Machine Learning, Random Forest, SHAP, Large Language Models (LLMs), Multi-Agent Systems, AI Integration
                        </div>
                        <div class="project-skills">
                            <i class="fas fa-code"></i> Full Stack Development, AI/ML Integration, Healthcare Technology, Software Testing, Clinical Decision Support Systems
                        </div>
                    </div>


                    <!-- Project 2: Charge Mate -->
                    <div class="project-item">
                        <div class="project-header">
                            <h3>Real-Time Electric Vehicles (EV) Charging Station Locator and Reservation System</h3>
                            <span class="project-duration">October 2024 - June 2025</span>
                        </div>
                        <div class="project-description">
                            <p>I developed “Charge Mate,” a mobile web application designed to help electric vehicle (EV) users locate and reserve charging stations in real time. The app dynamically recommends optimal stations and routes by considering user preferences, traffic conditions, weather, and energy costs.</p>
                            <p>Key features include both manual and AI-assisted reservation options, route suggestions based on live traffic and departure time, personalized filtering and smart recommendations, secure authentication with Firebase, and a QR code–based check-in system. This project demonstrates my ability to build a practical and scalable solution for EV infrastructure and sustainable transportation.</p>
                        </div>
                        <div class="project-technologies">
                            <i class="fas fa-gem"></i> Flutter, Firebase, Real-time Data Processing, QR Code Integration, AI Integration
                        </div>
                        <div class="project-skills">
                            <i class="fas fa-code"></i> Project Leadership, Software Project Management, Flutter, Front-End Development, Test Engineering
                        </div>
                    </div>


                    <!-- Project 3: AGO BinVert -->
                    <div class="project-item">
                        <div class="project-header">
                            <h3>AGO BinVert</h3>
                            <span class="project-duration">February 2025 - June 2025</span>
                        </div>
                        <div class="project-description">
                            <p>This project addresses urban waste management challenges by developing a cost-effective smart trash bin monitoring system. The system, built with Arduino-based hardware, uses dual ultrasonic sensors for improved measurement accuracy, LED indicators for visual alerts, and Bluetooth communication to sync with a custom-developed Flutter mobile application.</p>
                            <p>A working prototype achieved over 90% measurement accuracy across different waste types and demonstrated Bluetooth reliability above 95% within a 5-meter range. The mobile app provides real-time updates, interactive mapping of bin locations, and push notifications when bins approach capacity, aiming for more efficient and proactive waste collection.</p>
                        </div>
                        <div class="project-technologies">
                            <i class="fas fa-gem"></i> Arduino, ESP32, Ultrasonic Sensors, HC-05 Bluetooth Module, LED Indicators, Firebase, Flutter
                        </div>
                        <div class="project-skills">
                            <i class="fas fa-code"></i> Software Project Management, UI/UX Design, Flutter
                        </div>
                    </div>

                    <!-- Project 3: BuildYourself -->
                    <div class="project-item">
                        <div class="project-header">
                            <h3>Build Yourself</h3>
                            <span class="project-duration">January 2024 - June 2024</span>
                        </div>
                        <div class="project-description">
                            <p>A mobile application that revolutionizes the reservation process at gyms. Users can select the body part they plan to train on a human silhouette and view equipment availability and other users' workout plans during their selected time slots.</p>
                            <p>By scanning a QR code upon entry, users are automatically assigned a locker for the duration of their reservation. The app aims to enhance the gym experience by optimizing time management and convenience for its users.</p>
                        </div>
                        <div class="project-technologies">
                            <i class="fas fa-gem"></i> Flutter, QR Code Scanner, Real-time Database, Mobile UI/UX
                        </div>
                        <div class="project-skills">
                            <i class="fas fa-code"></i> Mobile Application Development, Flutter, UI/UX Design, Project Leadership
                        </div>
                    </div>

                    <!-- Project 4: Online Internship Management System -->
                    <div class="project-item">
                        <div class="project-header">
                            <h3>Online Internship Management System</h3>
                            <span class="project-duration">October 2023 - June 2024</span>
                        </div>
                        <div class="project-description">
                            <p>A platform designed to simplify the internship process for students of the Computer Engineering department. It allows students to access internship postings by companies and automates documentation tasks before, during, and after the internship period.</p>
                            <p>With a user-friendly interface and efficient data management, the platform reduces the workload on students and provides a more streamlined experience for managing internship applications and documentation.</p>
                        </div>
                        <div class="project-technologies">
                            <i class="fas fa-gem"></i> React.js, HTML, CSS, JavaScript, Database Management
                        </div>
                        <div class="project-skills">
                            <i class="fas fa-code"></i> Project Management, React.js, HTML, CSS, Software Project Management
                        </div>
                    </div>

                </div>
            </div>
        `;
    }
    
    // Get skills section content
    function getSkillsContent() {
        return `
            <div class="form-group">
                <div class="skills-categories">
                    
                    <!-- Testing & Quality Assurance -->
                    <div class="skill-category">
                        <div class="category-header">
                            <i class="fas fa-check-circle"></i>
                            <h3>Testing & Quality Assurance</h3>
                        </div>
                        <div class="skill-tags">
                            <span class="skill-tag">Software Testing</span>
                            <span class="skill-tag">Mobile Testing</span>
                            <span class="skill-tag">Test Automation</span>
                            <span class="skill-tag">API Testing</span>
                            <span class="skill-tag">Performance Testing</span>
                            <span class="skill-tag">Information Security</span>
                        </div>
                    </div>

                    <!-- Programming & Development -->
                    <div class="skill-category">
                        <div class="category-header">
                            <i class="fas fa-laptop-code"></i>
                            <h3>Programming & Development</h3>
                        </div>
                        <div class="skill-tags">
                            <span class="skill-tag">Python</span>
                            <span class="skill-tag">JavaScript</span>
                            <span class="skill-tag">TypeScript</span>
                            <span class="skill-tag">Next.js</span>
                            <span class="skill-tag">React</span>
                            <span class="skill-tag">HTML/CSS</span>
                            <span class="skill-tag">Flutter</span>
                            <span class="skill-tag">Dart</span>
                            <span class="skill-tag">SQL</span>
                        </div>
                    </div>

                    <!-- Advanced Technologies -->
                    <div class="skill-category">
                        <div class="category-header">
                            <i class="fas fa-robot"></i>
                            <h3>Advanced Technologies</h3>
                        </div>
                        <div class="skill-tags">
                            <span class="skill-tag">Machine Learning</span>
                            <span class="skill-tag">Deep Learning</span>
                            <span class="skill-tag">AI Integration</span>
                            <span class="skill-tag">Embedded Systems</span>
                            <span class="skill-tag">Arduino</span>
                            <span class="skill-tag">ESP32</span>
                            <span class="skill-tag">UI/UX Design</span>
                            <span class="skill-tag">Firebase</span>
                        </div>
                    </div>

                    <!-- Soft Skills & Management -->
                    <div class="skill-category">
                        <div class="category-header">
                            <i class="fas fa-users"></i>
                            <h3>Soft Skills & Management</h3>
                        </div>
                        <div class="skill-tags">
                            <span class="skill-tag">Project Management</span>
                            <span class="skill-tag">Team Leadership</span>
                            <span class="skill-tag">Agile Methodologies</span>
                            <span class="skill-tag">Problem Solving</span>
                            <span class="skill-tag">Communication</span>
                            <span class="skill-tag">Mentoring</span>
                            <span class="skill-tag">Cross-functional Collaboration</span>
                        </div>
                    </div>

                    <!-- Languages -->
                    <div class="skill-category">
                        <div class="category-header">
                            <i class="fas fa-globe"></i>
                            <h3>Languages</h3>
                        </div>
                        <div class="skill-tags">
                            <span class="skill-tag language-native">Turkish (Native)</span>
                            <span class="skill-tag language-advanced">English (B2-C1)</span>
                            <span class="skill-tag language-basic">German (A1)</span>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }
    
    // Get education section content
    function getEducationContent() {
        return `
            <div class="education-content">
                <div class="education-item">
                    <h3>İzmir Institute of Technology (IZTECH)</h3>
                    <div class="education-duration">2020 - 2025</div>
                    <div class="education-degree">Bachelor’s degree in Computer Engineering</div>
                    <div class="education-details">
                        <p><strong>Honors Student</strong> - Graduated with distinction</p>
                        <p><strong>GPA:</strong> 3.01/4.0</p>
                        <p><strong>Final Year Project:</strong> Real-Time Electric Vehicles (EV) Charging Station Locator and Reservation System</p>
                    </div>
                </div>
                
                <div class="education-item">
                    <h3>High School</h3>
                    <div class="education-duration">2016 - 2020</div>
                    <div class="education-degree">Science and Mathematics</div>
                    <div class="education-details">
                        <p><strong>Focus Areas:</strong> Mathematics, Physics, Chemistry, Biology</p>
                        <p><strong>Sports Achievements:</strong></p>
                        <ul class="achievement-list">
                            <li>🏆 <strong>Football Team:</strong> Provincial 3rd place medal</li>
                            <li>🏆 <strong>Basketball Team:</strong> District 2nd place medal</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Get certificates section content
    function getCertificatesContent() {
        return `
            <div class="certificates-content">
                <!-- Professional Certifications -->
                <div class="certificate-group">
                    <h4 class="group-title">Professional Certifications</h4>
                    <div class="certificate-item" onclick="window.open('https://app.diplomasafe.com/en-US/certificates/dae480d73a66cd0efbc3c68341fbbb157640eaeca', '_blank')">
                        <div class="certificate-header">
                            <h3>ISTQB Foundation Level Certificate</h3>
                            <i class="fas fa-external-link-alt" style="margin-left: 10px; opacity: 0.7;"></i>
                        </div>
                        <div class="certificate-duration">2025</div>
                        <div class="certificate-description">
                            Internationally recognized certification in software testing fundamentals, covering test design techniques, test management, and quality assurance best practices. This certification validates expertise in black-box testing, white-box testing, test planning, and risk-based testing methodologies.
                        </div>
                    </div>
                </div>

                <!-- Awards & Recognition -->
                <div class="certificate-group">
                    <h4 class="group-title">Awards & Recognition</h4>
                    <div class="certificate-item" onclick="window.open('https://www.linkedin.com/posts/onur-%C5%9Fahinler-b39bb9224_5-aral%C4%B1k-d%C3%BCnya-g%C3%B6n%C3%BCll%C3%BCler-g%C3%BCn%C3%BC-kapsam%C4%B1nda-activity-7270833580006653953-2oe9?utm_source=share&utm_medium=member_desktop&rcm=ACoAADhrQh0Bf6x2uAyQmvIIs_Qrd4hO4QZcAtQ', '_blank')">
                        <div class="certificate-header">
                            <h3>Fayda (Benefit) Community of the Year Award</h3>
                            <i class="fas fa-external-link-alt" style="margin-left: 10px; opacity: 0.7;"></i>
                        </div>
                        <div class="certificate-duration">December 5th, 2024 - International Volunteer Day</div>
                        <div class="certificate-description">
                            Our community was recognized as the FAYDA Community of the Year by the Foundation for Children with Leukemia (LÖSEV) for outstanding contributions to volunteerism and social responsibility among all FAYDA communities.
                        </div>
                    </div>
                </div>

                <!-- Leadership & Social Responsibility -->
                <div class="certificate-group">
                    <h4 class="group-title">Leadership & Social Responsibility</h4>
                    <div class="certificate-item" onclick="window.open('https://www.linkedin.com/posts/onur-%C5%9Fahinler-b39bb9224_i%CC%87zmir-y%C3%BCksek-teknoloji-enstit%C3%BCs%C3%BC-lisans-activity-7364637306844069889-BrB8?utm_source=share&utm_medium=member_desktop&rcm=ACoAADhrQh0Bf6x2uAyQmvIIs_Qrd4hO4QZcAtQ', '_blank')">
                        <div class="certificate-header">
                            <h3>Social Awareness and Leadership Certificate</h3>
                            <i class="fas fa-external-link-alt" style="margin-left: 10px; opacity: 0.7;"></i>
                        </div>
                        <div class="certificate-duration">2025</div>
                        <div class="certificate-description">
                            Recognition for outstanding leadership and social responsibility initiatives, demonstrating commitment to community development and positive social impact through innovative projects and collaborative efforts.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Get hobbies section content
    function getHobbiesContent() {
        return `
            <div class="hobbies-content">
                <div class="hobby-item">
                    <h3>Football</h3>
                    <p>I've been playing football since I can remember. I played in the youth teams of Bucaspor and Altay until high school, and I continue to play as a hobby.</p>
                </div>
                
                <div class="hobby-item">
                    <h3>Bodybuilding</h3>
                    <p>I've been actively involved in bodybuilding for the past 3 years. This is definitely one of the best decisions I've made in my life regarding discipline. I want to continue this as long as I can.</p>
                </div>
                
                <div class="hobby-item">
                    <h3>Traveling</h3>
                    <p>Traveling abroad to see different cultures and meet different people is truly enjoyable. Despite my young age, I've visited 18 countries outside of Turkey, and I want to see as many places as possible in my lifetime.</p>
                </div>
                
                <div class="hobby-item">
                    <h3>Lego Collection</h3>
                    <p>For the past 2 years, I've been building a Lego collection. It's relaxing to sit quietly and build collections in my free time.</p>
                </div>
                
                <div class="hobby-item">
                    <h3>Sports Following</h3>
                    <p>While I may not actively play all sports, I follow various sports with great interest. Some of these include basketball, tennis, and snooker.</p>
                </div>
            </div>
        `;
    }
    
    // Get contact section content
    function getContactContent() {
        return `
            <div class="contact-content">
                <div class="contact-intro">
                    <p>Feel free to reach out - projects, advice, experience sharing... I'm open to chatting about anything!</p>
                </div>
                
                <div class="contact-methods">
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Email</h3>
                            <a href="mailto:sahinleronur9@gmail.com" class="contact-link">sahinleronur9@gmail.com</a>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fab fa-linkedin"></i>
                        </div>
                        <div class="contact-details">
                            <h3>LinkedIn</h3>
                            <a href="https://linkedin.com/in/onur-şahinler-b39bb9224/" target="_blank" rel="noopener noreferrer" class="contact-link">linkedin.com/in/onur-şahinler-b39bb9224/</a>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fab fa-github"></i>
                        </div>
                        <div class="contact-details">
                            <h3>GitHub</h3>
                            <a href="https://github.com/onursahinler/" target="_blank" rel="noopener noreferrer" class="contact-link">github.com/onursahinler/</a>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fab fa-instagram"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Instagram</h3>
                            <a href="https://instagram.com/onurshnlr7" target="_blank" rel="noopener noreferrer" class="contact-link">@onurshnlr7</a>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Location</h3>
                            <span class="contact-text">Buca, İzmir, Türkiye</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Attach event listeners to dynamically created content
    function attachEventListeners() {
        // Option buttons
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const group = button.parentElement;
                const buttons = group.querySelectorAll('.option-btn');
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
        
        // Generate buttons
        const generateButtons = document.querySelectorAll('.generate-btn');
        generateButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.innerHTML = button.innerHTML.replace('Processing...', 'Completed');
                    setTimeout(() => {
                        button.innerHTML = button.innerHTML.replace('fa-spinner fa-spin', 'fa-check');
                        button.innerHTML = button.innerHTML.replace('Completed', 'Success');
                        button.disabled = false;
                        showNotification('Operation completed successfully!', 'success');
                    }, 500);
                }, 1500);
            });
        });
    }
    
    // Scroll to surprise button and show popup
    function scrollToSurpriseButton() {
        const surpriseBtn = document.getElementById('surpriseBtn');
        if (surpriseBtn) {
            // Get button position
            const buttonRect = surpriseBtn.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetY = buttonRect.top + scrollTop - (window.innerHeight / 2) + (buttonRect.height / 2);
            
            // Fast, smooth scroll - single continuous motion
            const startY = window.pageYOffset;
            const distance = targetY - startY;
            // Faster duration - 500-800ms
            const duration = Math.min(Math.max(Math.abs(distance) * 0.4, 500), 800);
            let start = null;
            
            // Smooth ease-out-quart for fluid motion
            function easeOutQuart(t) {
                return 1 - Math.pow(1 - t, 4);
            }
            
            function step(timestamp) {
                if (!start) start = timestamp;
                
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // Apply smooth easing
                const eased = easeOutQuart(progress);
                const currentY = startY + distance * eased;
                
                window.scrollTo(0, currentY);
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    // Show popup after scroll completes
                    setTimeout(() => {
                        showSurprisePopup();
                    }, 200);
                }
            }
            
            requestAnimationFrame(step);
        }
    }
    
    // Show surprise popup
    function showSurprisePopup() {
        // Prevent body scroll but maintain scrollbar to avoid layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollbarWidth + 'px';
        document.body.style.overflow = 'hidden';
        
        const popup = document.createElement('div');
        popup.className = 'surprise-popup';
        popup.innerHTML = `
            <div class="surprise-popup-content">
                <div class="surprise-popup-icon">
                    <i class="fas fa-gift"></i>
                </div>
                <h3>🎉 Congratulations! You've completed the portfolio!</h3>
                <p>But wait, there's a surprise here! Don't leave this page without clicking the gift button above! 😊</p>
                <p><strong>This surprise is the most special part of my portfolio!</strong></p>
                <button class="surprise-popup-btn">
                    <i class="fas fa-check"></i>
                    Got it, I'll check the surprise!
                </button>
            </div>
        `;
        
        // Add popup styles
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        `;
        
        // Close on background click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.remove();
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }
        });
        
        // Add content styles
        const content = popup.querySelector('.surprise-popup-content');
        content.style.cssText = `
            background: linear-gradient(135deg, #1e293b, #334155);
            border-radius: 20px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            border: 2px solid #ff6b6b;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            animation: scaleIn 0.3s ease;
        `;
        
        // Add icon styles
        const icon = popup.querySelector('.surprise-popup-icon');
        icon.style.cssText = `
            font-size: 3rem;
            color: #ff6b6b;
            margin-bottom: 1rem;
            animation: bounce 1s infinite;
        `;
        
        // Add title styles
        const title = popup.querySelector('h3');
        title.style.cssText = `
            color: #ff6b6b;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        `;
        
        // Add text styles
        const texts = popup.querySelectorAll('p');
        texts.forEach(p => {
            p.style.cssText = `
                color: #e5e7eb;
                line-height: 1.6;
                margin-bottom: 1rem;
                font-size: 1rem;
            `;
        });
        
        // Add button styles
        const button = popup.querySelector('.surprise-popup-btn');
        button.style.cssText = `
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 12px;
            padding: 1rem 2rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0 auto;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = '#ff5252';
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = '#ff6b6b';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
        });
        
        // Close handler
        const closePopup = () => {
            popup.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                popup.remove();
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }, 300);
        };
        
        button.addEventListener('click', closePopup);
        
        document.body.appendChild(popup);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add CSS for notifications and new sections
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .skills-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .skill-item {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .skill-name {
            min-width: 100px;
            font-weight: 500;
        }
        
        .skill-bar {
            flex: 1;
            height: 8px;
            background: #475569;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .skill-progress {
            height: 100%;
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
            border-radius: 4px;
            transition: width 1s ease;
        }
        
        .skill-percentage {
            min-width: 40px;
            text-align: right;
            font-weight: 600;
            color: #4f46e5;
        }
        
        .about-content {
            background: rgba(71, 85, 105, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform-style: preserve-3d;
        }
        
        .about-content::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%);
            transition: transform 0.6s ease;
            transform: scale(0);
        }
        
        .about-content:hover::before {
            transform: scale(1);
        }
        
        .about-content:hover {
            border-color: rgba(79, 70, 229, 0.5);
            background: rgba(100, 116, 139, 0.5);
            transform: translateY(-5px) translateZ(10px);
            box-shadow: 0 20px 60px rgba(79, 70, 229, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .about-intro {
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .about-intro h3 {
            font-size: 1.8rem;
            font-weight: 700;
            color: #8b5cf6;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .about-subtitle {
            font-size: 1.1rem;
            color: #f1f5f9;
            font-weight: 500;
            opacity: 0.9;
        }
        
        .about-paragraph {
            margin-bottom: 1.2rem;
            line-height: 1.7;
            transition: transform 0.3s ease;
        }
        
        .about-content:hover .about-paragraph {
            transform: translateX(5px);
        }
        
        .about-paragraph p {
            color: #e2e8f0;
            font-size: 1rem;
            margin: 0;
        }
        
        .about-location {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 2px solid #4f46e5;
            text-align: center;
        }
        
        .about-location p {
            color: #94a3b8;
            font-style: italic;
            font-size: 1rem;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .about-location i {
            color: #4f46e5;
            font-size: 1.1rem;
        }
        
        .certificates-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .certificate-item {
            background: #475569;
            border-radius: 12px;
            padding: 1.5rem;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .certificate-item:hover {
            border-color: #4f46e5;
            background: #64748b;
        }
        
        .certificate-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .certificate-header h4 {
            color: #f1f5f9;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
        }
        
        .certificate-date {
            color: #4f46e5;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .certificate-issuer {
            color: #94a3b8;
            font-size: 0.9rem;
            margin: 0;
        }
        
        .hobbies-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .hobby-item {
            background: #475569;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .hobby-item:hover {
            border-color: #4f46e5;
            background: #64748b;
            transform: translateY(-2px);
        }
        
        .hobby-item i {
            font-size: 2rem;
            color: #4f46e5;
            margin-bottom: 1rem;
        }
        
        .hobby-item h4 {
            color: #f1f5f9;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
        }
        
        .hobby-item p {
            color: #94a3b8;
            font-size: 0.9rem;
            margin: 0;
            line-height: 1.5;
        }
        
        .experience-content {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .experience-item {
            background: rgba(71, 85, 105, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform-style: preserve-3d;
        }
        
        .experience-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.2), transparent);
            transition: left 0.6s ease;
        }
        
        .experience-item:hover::before {
            left: 100%;
        }
        
        .experience-item:hover {
            border-color: rgba(79, 70, 229, 0.5);
            background: rgba(100, 116, 139, 0.5);
            transform: translateY(-8px) scale(1.02) translateZ(10px);
            box-shadow: 0 20px 60px rgba(79, 70, 229, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .experience-header h3 {
            color: #8b5cf6;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0;
            flex: 1;
            min-width: 200px;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
            letter-spacing: 0.5px;
        }
        
        .experience-duration {
            color: #94a3b8;
            font-size: 0.9rem;
            font-weight: 500;
            white-space: nowrap;
        }
        
        .experience-org {
            color: #f1f5f9;
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }
        
        .experience-location {
            color: #94a3b8;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .experience-location i {
            color: #4f46e5;
        }
        
        .experience-description {
            margin-bottom: 1rem;
        }
        
        .experience-description p {
            color: #e2e8f0;
            font-size: 1rem;
            line-height: 1.6;
            margin: 0 0 1rem 0;
        }
        
        .experience-achievements {
            margin-top: 1rem;
        }
        
        .experience-achievements h4 {
            color: #f1f5f9;
            font-size: 1rem;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
        }
        
        .experience-achievements ul {
            color: #e2e8f0;
            font-size: 0.95rem;
            line-height: 1.6;
            margin: 0 0 1rem 0;
            padding-left: 1.5rem;
        }
        
        .experience-achievements li {
            margin-bottom: 0.3rem;
        }
        
        .experience-skills {
            color: #94a3b8;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #64748b;
        }
        
        .experience-skills i {
            color: #4f46e5;
            font-size: 0.8rem;
        }
        
        .projects-content {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .project-item {
            background: rgba(71, 85, 105, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform-style: preserve-3d;
        }
        
        .project-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent);
            transition: left 0.6s ease;
        }
        
        .project-item:hover::before {
            left: 100%;
        }
        
        .project-item:hover {
            border-color: rgba(139, 92, 246, 0.5);
            background: rgba(100, 116, 139, 0.5);
            transform: translateY(-8px) scale(1.02) translateZ(10px);
            box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .project-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .project-header h3 {
            color: #8b5cf6;
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0;
            flex: 1;
            min-width: 200px;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
            letter-spacing: 0.5px;
        }
        
        .project-duration {
            color: #94a3b8;
            font-size: 0.9rem;
            font-weight: 500;
            white-space: nowrap;
        }
        
        .project-description {
            margin-bottom: 1.5rem;
        }
        
        .project-description p {
            color: #e2e8f0;
            font-size: 1rem;
            line-height: 1.6;
            margin: 0 0 1rem 0;
        }
        
        .project-description ul {
            color: #e2e8f0;
            font-size: 1rem;
            line-height: 1.8;
            margin: 1rem 0 1rem 1.5rem;
            padding: 0;
        }
        
        .project-description li {
            color: #e2e8f0;
            font-size: 1rem;
            line-height: 1.8;
            margin-bottom: 0.5rem;
        }
        
        .project-description li:last-child {
            margin-bottom: 0;
        }
        
        .project-technologies {
            color: #94a3b8;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
        .project-technologies i {
            color: #4f46e5;
            font-size: 0.8rem;
        }
        
        .project-skills {
            color: #94a3b8;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #64748b;
        }
        
        .project-skills i {
            color: #4f46e5;
            font-size: 0.8rem;
        }
        
        .skills-categories {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .skill-category {
            background: rgba(71, 85, 105, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform-style: preserve-3d;
        }
        
        .skill-category::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
            transition: transform 0.6s ease;
            transform: scale(0);
        }
        
        .skill-category:hover::before {
            transform: scale(1);
        }
        
        .skill-category:hover {
            border-color: rgba(139, 92, 246, 0.5);
            background: rgba(100, 116, 139, 0.5);
            transform: translateY(-8px) scale(1.03) translateZ(10px);
            box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .skill-category:hover .skill-tag {
            background: #8b5cf6;
            color: white;
            border-color: #8b5cf6;
        }
        
        .category-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }
        
        .category-header i {
            color: #8b5cf6;
            font-size: 1.2rem;
        }
        
        .category-header h3 {
            color: #f1f5f9;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
        }
        
        .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .skill-tag {
            background: #64748b;
            color: #e2e8f0;
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.3s ease;
            border: 1px solid transparent;
        }
        
        .skill-tag {
            position: relative;
            overflow: hidden;
        }
        
        .skill-tag::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(139, 92, 246, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.4s, height 0.4s;
        }
        
        .skill-tag:hover::before {
            width: 150px;
            height: 150px;
        }
        
        .skill-tag:hover {
            background: #8b5cf6;
            color: white;
            border-color: #8b5cf6;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
            z-index: 1;
            position: relative;
        }
        
        
        .certificates-content {
            padding: 2rem 0;
        }
        
        .certificate-group {
            margin-bottom: 3rem;
        }
        
        .group-title {
            color: #8b5cf6;
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #8b5cf6;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .certificate-item {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform-style: preserve-3d;
        }
        
        .certificate-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent);
            transition: left 0.6s ease;
        }
        
        .certificate-item:hover::before {
            left: 100%;
        }
        
        .certificate-item:hover {
            border-color: rgba(139, 92, 246, 0.5);
            transform: translateY(-8px) scale(1.02) translateZ(10px);
            box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .certificate-header {
            margin-bottom: 0.75rem;
        }
        
        .certificate-header h3 {
            color: #8b5cf6;
            font-size: 1.3rem;
            font-weight: 600;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            letter-spacing: 0.5px;
            text-align: left;
        }
        
        .certificate-duration {
            color: #a78bfa;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 0.75rem;
            font-style: italic;
        }
        
        .certificate-description {
            color: #e5e7eb;
            line-height: 1.6;
            font-size: 0.95rem;
        }
        
        .hobbies-content {
            padding: 2rem 0;
        }
        
        .hobby-item {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform-style: preserve-3d;
        }
        
        .hobby-item::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
            transition: transform 0.6s ease;
            transform: scale(0);
        }
        
        .hobby-item:hover::before {
            transform: scale(1);
        }
        
        .hobby-item:hover {
            border-color: rgba(139, 92, 246, 0.5);
            transform: translateY(-8px) scale(1.02) translateZ(10px);
            box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .hobby-item h3 {
            color: #8b5cf6;
            font-size: 1.3rem;
            font-weight: 600;
            margin: 0 0 0.75rem 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            letter-spacing: 0.5px;
        }
        
        .hobby-item p {
            color: #e5e7eb;
            line-height: 1.6;
            font-size: 0.95rem;
            margin: 0;
        }
        
        .contact-content {
            padding: 2rem 0;
        }
        
        .contact-intro {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .contact-intro p {
            color: #e5e7eb;
            font-size: 1.1rem;
            line-height: 1.6;
            margin: 0;
            font-style: italic;
        }
        
        .contact-methods {
            display: grid;
            gap: 1.5rem;
        }
        
        .contact-item {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform-style: preserve-3d;
        }
        
        .contact-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent);
            transition: left 0.6s ease;
        }
        
        .contact-item:hover::before {
            left: 100%;
        }
        
        .contact-item:hover {
            border-color: rgba(139, 92, 246, 0.5);
            transform: translateY(-8px) scale(1.02) translateZ(10px);
            box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .contact-item:hover .contact-icon {
            transform: rotate(360deg) scale(1.1);
            box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }
        
        .contact-icon {
            transition: transform 0.5s ease, box-shadow 0.3s ease;
        }
        
        .contact-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #8b5cf6, #a78bfa);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .contact-icon i {
            color: white;
            font-size: 1.5rem;
        }
        
        .contact-details {
            flex: 1;
        }
        
        .contact-details h3 {
            color: #8b5cf6;
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .contact-link {
            color: #a78bfa;
            text-decoration: none;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            border-bottom: 1px dotted transparent;
        }
        
        .contact-link:hover {
            color: #8b5cf6;
            border-bottom: 1px dotted #8b5cf6;
            text-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
        }
        
        .contact-text {
            color: #e5e7eb;
            font-size: 0.95rem;
        }
        
        .education-content {
            padding: 2rem 0;
        }
        
        .education-item {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform-style: preserve-3d;
        }
        
        .education-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent);
            transition: left 0.6s ease;
        }
        
        .education-item:hover::before {
            left: 100%;
        }
        
        .education-item:hover {
            border-color: rgba(139, 92, 246, 0.5);
            transform: translateY(-8px) scale(1.02) translateZ(10px);
            box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .education-item h3 {
            color: #8b5cf6;
            font-size: 1.4rem;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            letter-spacing: 0.5px;
        }
        
        .education-duration {
            color: #a78bfa;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            font-style: italic;
        }
        
        .education-degree {
            color: #e5e7eb;
            font-size: 1.1rem;
            font-weight: 500;
            margin-bottom: 1rem;
        }
        
        .education-details {
            color: #e5e7eb;
        }
        
        .education-details p {
            margin-bottom: 0.75rem;
            line-height: 1.6;
            font-size: 0.95rem;
        }
        
        .education-details p:last-child {
            margin-bottom: 0;
        }
        
        .education-details strong {
            color: #8b5cf6;
            font-weight: 600;
        }
        
        .achievement-list {
            margin: 0.5rem 0 0 1rem;
            padding: 0;
            list-style: none;
        }
        
        .achievement-list li {
            margin-bottom: 0.5rem;
            padding-left: 0.5rem;
            color: #e5e7eb;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        .achievement-list li:last-child {
            margin-bottom: 0;
        }
        
        .experience-org a {
            color: #a78bfa;
            text-decoration: none;
            transition: all 0.3s ease;
            border-bottom: 1px dotted transparent;
            font-weight: 500;
        }
        
        .experience-org a:hover {
            color: #8b5cf6;
            text-decoration: none;
            border-bottom: 1px dotted #8b5cf6;
            text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
            font-weight: 600;
        }
        
    `;
    document.head.appendChild(style);
});

// Surprise modal functionality
function initSurpriseModal() {
    const surpriseBtn = document.getElementById('surpriseBtn');
    const surpriseModal = document.getElementById('surpriseModal');
    const closeBtn = document.getElementById('closeSurpriseModal');
    
    function openModal() {
        // Prevent layout shift by maintaining scrollbar
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollbarWidth + 'px';
        document.body.style.overflow = 'hidden';
        surpriseModal.classList.add('show');
    }
    
    function closeModal() {
        surpriseModal.classList.remove('show');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
    
    if (surpriseBtn && surpriseModal && closeBtn) {
        surpriseBtn.addEventListener('click', openModal);
        
        closeBtn.addEventListener('click', closeModal);
        
        surpriseModal.addEventListener('click', (e) => {
            if (e.target === surpriseModal) {
                closeModal();
            }
        });
    }
}

// Initialize surprise modal when DOM is loaded
document.addEventListener('DOMContentLoaded', initSurpriseModal);
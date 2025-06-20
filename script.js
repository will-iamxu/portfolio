class PortfolioConsole {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('commandInput');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.suggestions = document.createElement('div');
        this.suggestions.className = 'autocomplete-suggestions';
        this.input.parentNode.appendChild(this.suggestions);
        
        this.commands = {
            'help': this.showHelp.bind(this),
            'about': this.showAbout.bind(this),
            'projects': this.showProjects.bind(this),
            'skills': this.showSkills.bind(this),
            'contact': this.showContact.bind(this),
            'experience': this.showExperience.bind(this),
            'education': this.showEducation.bind(this),
            'clear': this.clearConsole.bind(this),
            'whoami': this.whoami.bind(this),
            'ls': this.listCommands.bind(this),
            'cat': this.catCommand.bind(this),
            'echo': this.echoCommand.bind(this),
            'pwd': this.pwd.bind(this),
            'date': this.showDate.bind(this),
            'uptime': this.showUptime.bind(this),
            'version': this.showVersion.bind(this),
            'github': this.openGithub.bind(this),
            'linkedin': this.openLinkedin.bind(this),
            'resume': this.showResume.bind(this)
        };
        
        this.startTime = Date.now();
        this.initializeEventListeners();
        this.focusInput();
    }
    
    initializeEventListeners() {
        this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.input.addEventListener('input', this.handleInput.bind(this));
        document.addEventListener('click', () => this.focusInput());
    }
    
    handleKeyDown(event) {
        switch(event.key) {
            case 'Enter':
                this.executeCommand();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                event.preventDefault();
                this.handleAutocomplete();
                break;
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }
    
    handleInput() {
        const value = this.input.value.toLowerCase();
        if (value.length > 0) {
            this.showSuggestions(value);
        } else {
            this.hideSuggestions();
        }
    }
    
    showSuggestions(input) {
        const matches = Object.keys(this.commands).filter(cmd => 
            cmd.toLowerCase().startsWith(input)
        );
        
        if (matches.length > 0) {
            this.suggestions.innerHTML = matches.map(match => 
                `<div class="suggestion-item">${match}</div>`
            ).join('');
            this.suggestions.style.display = 'block';
            
            this.suggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.input.value = item.textContent;
                    this.hideSuggestions();
                    this.focusInput();
                });
            });
        } else {
            this.hideSuggestions();
        }
    }
    
    hideSuggestions() {
        this.suggestions.style.display = 'none';
    }
    
    handleAutocomplete() {
        const input = this.input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => 
            cmd.toLowerCase().startsWith(input)
        );
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            const common = this.findCommonPrefix(matches);
            if (common.length > input.length) {
                this.input.value = common;
            }
        }
    }
    
    findCommonPrefix(strings) {
        if (strings.length === 0) return '';
        let prefix = strings[0];
        for (let i = 1; i < strings.length; i++) {
            while (strings[i].indexOf(prefix) !== 0) {
                prefix = prefix.substring(0, prefix.length - 1);
                if (prefix === '') return '';
            }
        }
        return prefix;
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = -1;
            this.input.value = '';
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length - 1;
        }
        
        if (this.historyIndex >= 0) {
            this.input.value = this.commandHistory[this.historyIndex];
        }
    }
    
    executeCommand() {
        const command = this.input.value.trim();
        if (!command) return;
        
        this.addToHistory(command);
        this.displayCommand(command);
        
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.displayError(`Command not found: ${cmd}. Type 'help' for available commands.`);
        }
        
        this.input.value = '';
        this.hideSuggestions();
        this.scrollToBottom();
    }
    
    addToHistory(command) {
        this.commandHistory.push(command);
        this.historyIndex = -1;
    }
    
    displayCommand(command) {
        const commandElement = document.createElement('div');
        commandElement.className = 'command-line';
        commandElement.innerHTML = `
            <span class="command-prompt">]</span>
            <span class="command-text">${command}</span>
        `;
        this.output.appendChild(commandElement);
    }
    
    displayOutput(content, type = 'normal') {
        const outputElement = document.createElement('div');
        outputElement.className = `command-output ${type}`;
        outputElement.innerHTML = content;
        this.output.appendChild(outputElement);
    }
    
    displayError(message) {
        this.displayOutput(message, 'error');
    }
    
    displaySuccess(message) {
        this.displayOutput(message, 'success');
    }
    
    displayInfo(message) {
        this.displayOutput(message, 'info');
    }
    
    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }
    
    focusInput() {
        this.input.focus();
    }
    
    showHelp() {
        const helpText = `
            <div class="help-command">
                <span class="help-command-name">help</span>
                <span class="help-command-desc">Show this help message</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">about</span>
                <span class="help-command-desc">Display information about William</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">projects</span>
                <span class="help-command-desc">Show featured projects</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">skills</span>
                <span class="help-command-desc">List technical skills</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">experience</span>
                <span class="help-command-desc">Show work experience</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">education</span>
                <span class="help-command-desc">Display educational background</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">contact</span>
                <span class="help-command-desc">Get contact information</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">github</span>
                <span class="help-command-desc">Open GitHub profile</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">linkedin</span>
                <span class="help-command-desc">Open LinkedIn profile</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">resume</span>
                <span class="help-command-desc">Display resume summary</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">clear</span>
                <span class="help-command-desc">Clear the console</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">whoami</span>
                <span class="help-command-desc">Display current user</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">ls</span>
                <span class="help-command-desc">List available commands</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">pwd</span>
                <span class="help-command-desc">Print working directory</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">date</span>
                <span class="help-command-desc">Show current date and time</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">version</span>
                <span class="help-command-desc">Show portfolio version</span>
            </div>
        `;
        this.displayOutput(helpText);
    }
    
    showAbout() {
        const aboutText = `
            <div class="ascii-art">
    ╔══════════════════════════════════════════════════════════════════╗
    ║                          WILLIAM XU                              ║
    ║                    Computer Engineering Student                  ║
    ╚══════════════════════════════════════════════════════════════════╝
            </div>
            <strong>About Me:</strong><br>
            Rising Senior in Computer Engineering at Texas A&M University<br>
            Passionate about systems that interface with the physical world<br><br>
            
            <strong>Interests:</strong><br>
            • Robotics & Embedded Systems<br>
            • Low-level debugging & Reverse engineering<br>
            • Machine Learning & Data Science<br>
            • Underwater Robotics Research<br><br>
            
            <strong>Philosophy:</strong><br>
            "${this.getRandomQuote()}"<br><br>
            
            <strong>Current Focus:</strong><br>
            Working on autonomous systems, SLAM algorithms, and robotics applications
        `;
        this.displayOutput(aboutText, 'info');
    }
    
    showProjects() {
        const projectsText = `
            <div class="project-item">
                <div class="project-title">🤖 BlueREV Underwater Robot</div>
                <div class="project-description">
                    Developed sonar suite and SLAM-based localization system for autonomous underwater vehicle.
                    Improved navigation accuracy and deployment success through advanced sensor integration.
                </div>
                <div class="project-tech">Tech: ROS2, C++, Python, Docker, SLAM</div>
            </div>
            
            <div class="project-item">
                <div class="project-title">💰 EV Bettor</div>
                <div class="project-description">
                    Automated sports betting system with odds scraping and probability analysis.
                    Data-driven approach to identify value bets using statistical modeling.
                </div>
                <div class="project-tech">Tech: Python, Selenium, MySQL, Web Scraping</div>
            </div>
            
            <div class="project-item">
                <div class="project-title">🔬 NSF Research Projects</div>
                <div class="project-description">
                    Underwater robotics research focusing on autonomous navigation and environmental mapping.
                    Contributing to advancing autonomous underwater vehicle capabilities.
                </div>
                <div class="project-tech">Tech: Research, Robotics, Data Analysis</div>
            </div>
        `;
        this.displayOutput(projectsText);
    }
    
    showSkills() {
        const skillsText = `
            <div class="skill-category">
                <div class="skill-category-title">Programming Languages:</div>
                <div class="skill-list">Python, Java, C++, TypeScript, JavaScript</div>
            </div>
            
            <div class="skill-category">
                <div class="skill-category-title">Frameworks & Libraries:</div>
                <div class="skill-list">ROS2, React, TensorFlow, PyTorch</div>
            </div>
            
            <div class="skill-category">
                <div class="skill-category-title">Tools & Technologies:</div>
                <div class="skill-list">Docker, Git, AWS, Linux, MySQL</div>
            </div>
            
            <div class="skill-category">
                <div class="skill-category-title">Specializations:</div>
                <div class="skill-list">Robotics, Embedded Systems, SLAM, Machine Learning</div>
            </div>
            
            <div class="skill-category">
                <div class="skill-category-title">Other:</div>
                <div class="skill-list">Web Scraping, Reverse Engineering, Low-level Debugging</div>
            </div>
        `;
        this.displayOutput(skillsText, 'info');
    }
    
    showExperience() {
        const experienceText = `
            <strong>🔬 Underwater Robotics Researcher</strong><br>
            • Developing autonomous navigation systems for underwater vehicles<br>
            • Implementing SLAM algorithms for real-time mapping<br>
            • Working with ROS2 and advanced sensor integration<br><br>
            
            <strong>📚 NSF Research Intern</strong><br>
            • Contributing to National Science Foundation research projects<br>
            • Focus on robotics and autonomous systems<br>
            • Data analysis and system optimization<br><br>
            
            <strong>👨‍🏫 Peer Tutor</strong><br>
            • Teaching Python programming and problem-solving techniques<br>
            • Helping students with debugging and code optimization<br>
            • Mentoring in software development best practices
        `;
        this.displayOutput(experienceText, 'info');
    }
    
    showEducation() {
        const educationText = `
            <strong>🎓 Texas A&M University</strong><br>
            Computer Engineering - Rising Senior<br>
            Focus: Robotics, Embedded Systems, and Machine Learning<br><br>
            
            <strong>📖 Relevant Coursework:</strong><br>
            • Data Structures & Algorithms<br>
            • Computer Architecture<br>
            • Embedded Systems Design<br>
            • Machine Learning<br>
            • Robotics & Automation<br>
            • Signal Processing
        `;
        this.displayOutput(educationText, 'info');
    }
    
    showContact() {
        const contactText = `
            <div class="contact-item">
                <span class="contact-label">Email:</span> williamsxuu@gmail.com
            </div>
            <div class="contact-item">
                <span class="contact-label">GitHub:</span> github.com/will-iamxu
            </div>
            <div class="contact-item">
                <span class="contact-label">LinkedIn:</span> Available on GitHub profile
            </div>
            <div class="contact-item">
                <span class="contact-label">Location:</span> Texas, USA
            </div>
            <br>
            <em>Feel free to reach out for collaborations, opportunities, or just to chat about tech!</em>
        `;
        this.displayOutput(contactText, 'success');
    }
    
    clearConsole() {
        this.output.innerHTML = '';
        this.displaySuccess('Console cleared.');
    }
    
    whoami() {
        this.displayOutput('william-xu', 'success');
    }
    
    listCommands() {
        const commands = Object.keys(this.commands).sort().join('  ');
        this.displayOutput(commands, 'info');
    }
    
    catCommand(args) {
        if (args.length === 0) {
            this.displayError('Usage: cat [file]');
            return;
        }
        
        const file = args[0];
        const files = {
            'readme.txt': 'Welcome to William Xu\'s portfolio console!\nThis is a CS:GO/CS2 inspired terminal interface.',
            'about.txt': 'Computer Engineering student at Texas A&M University\nFocused on robotics and embedded systems',
            'projects.txt': 'BlueREV, EV Bettor, NSF Research Projects'
        };
        
        if (files[file]) {
            this.displayOutput(files[file].replace(/\n/g, '<br>'));
        } else {
            this.displayError(`cat: ${file}: No such file or directory`);
        }
    }
    
    echoCommand(args) {
        this.displayOutput(args.join(' '));
    }
    
    pwd() {
        this.displayOutput('/home/william-xu/portfolio', 'info');
    }
    
    showDate() {
        this.displayOutput(new Date().toString(), 'info');
    }
    
    showUptime() {
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(uptime / 60);
        const seconds = uptime % 60;
        this.displayOutput(`Portfolio uptime: ${minutes}m ${seconds}s`, 'info');
    }
    
    showVersion() {
        this.displayOutput('William Xu Portfolio Console v1.0.0', 'success');
    }
    
    openGithub() {
        window.open('https://github.com/will-iamxu', '_blank');
        this.displaySuccess('Opening GitHub profile...');
    }
    
    openLinkedin() {
        this.displayInfo('LinkedIn profile available on GitHub profile');
    }
    
    showResume() {
        const resumeText = `
            <strong>WILLIAM XU - COMPUTER ENGINEERING STUDENT</strong><br><br>
            
            <strong>EDUCATION</strong><br>
            Texas A&M University - Computer Engineering (Rising Senior)<br><br>
            
            <strong>TECHNICAL SKILLS</strong><br>
            Languages: Python, Java, C++, TypeScript, JavaScript<br>
            Frameworks: ROS2, React, TensorFlow, PyTorch<br>
            Tools: Docker, Git, AWS, Linux<br><br>
            
            <strong>KEY PROJECTS</strong><br>
            • BlueREV Underwater Robot - SLAM & Navigation<br>
            • EV Bettor - Automated Betting System<br>
            • NSF Research - Robotics & Autonomous Systems<br><br>
            
            <strong>EXPERIENCE</strong><br>
            • Underwater Robotics Researcher<br>
            • NSF Research Intern<br>
            • Peer Tutor - Python & Problem Solving
        `;
        this.displayOutput(resumeText, 'info');
    }
    
    getRandomQuote() {
        const quotes = [
            "The best way to predict the future is to invent it.",
            "Code is poetry written in logic.",
            "Every expert was once a beginner.",
            "The only way to do great work is to love what you do.",
            "Innovation distinguishes between a leader and a follower."
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioConsole();
});
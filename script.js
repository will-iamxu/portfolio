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
            'resume': this.showResume.bind(this),
            'clips': this.openClips.bind(this),
            'noclip': this.noclip.bind(this),
            'sv_cheats': this.svCheats.bind(this),
            'bind': this.bindCommand.bind(this),
            'fps_max': this.fpsMax.bind(this),
            'net_graph': this.netGraph.bind(this),
            'quit': this.quit.bind(this),
            'disconnect': this.disconnect.bind(this),
            'status': this.serverStatus.bind(this)
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
            <span class="command-prompt">&gt;</span>
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
            <div class="help-command">
                <span class="help-command-name">clips</span>
                <span class="help-command-desc">Open CS2 clips channel</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">noclip</span>
                <span class="help-command-desc">Toggle noclip mode (for fun)</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">sv_cheats</span>
                <span class="help-command-desc">Enable/disable cheats</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">fps_max</span>
                <span class="help-command-desc">Set maximum FPS</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">net_graph</span>
                <span class="help-command-desc">Toggle network graph</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">status</span>
                <span class="help-command-desc">Show server status</span>
            </div>
            <div class="help-command">
                <span class="help-command-name">quit</span>
                <span class="help-command-desc">Exit the console</span>
            </div>
        `;
        this.displayOutput(helpText);
    }
    
    showAbout() {
        const aboutText = `
            <strong>WILLIAM XU</strong><br>
            Computer Engineering Student<br><br>
            
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
                <div class="project-title">💰 EV Bettor</div>
                <div class="project-description">
                    Architected a high-throughput Selenium bot to identify and place +EV sports bets autonomously across multiple online sportsbooks.
                    Created real-time arbitrage and risk analysis engine using SciPy and SQL-based data lakes.
                    Achieved consistent 15% ROI through intelligent bankroll management and probabilistic modeling.
                </div>
                <div class="project-tech">Tech: Python, Selenium, MySQL, SciPy</div>
            </div>
            
            <div class="project-item">
                <div class="project-title">🎵 SoundCard</div>
                <div class="project-description">
                    Developed a full-stack AI-powered web application that generates personalized Pokémon-style trading cards from Spotify listening data.
                    Reached 500+ total users within the first three months with secure OAuth authentication and multi-timeframe music analytics.
                    Designed scalable backend infrastructure with PostgreSQL, Prisma ORM, and AWS S3 integration.
                </div>
                <div class="project-tech">Tech: Next.js, TypeScript, PostgreSQL, AWS, Spotify API, Replicate API, Prisma</div>
                <div class="project-link"><a href="https://spotify-avatar-ten.vercel.app/" target="_blank">🔗 View Project</a></div>
            </div>
            
            <div class="project-item">
                <div class="project-title">🤖 BlueREV Underwater Robot</div>
                <div class="project-description">
                    Engineered a Gaussian Process Regression-based SLAM algorithm in ROS2 to fuse sonar and IMU sensor data.
                    Improved localization accuracy by 200% over traditional odometry in underwater culvert navigation.
                    Constructed modular sensor fusion pipeline handling noisy underwater sonar and IMU data.
                </div>
                <div class="project-tech">Tech: ROS2, C++, Python, Docker, SLAM, Gaussian Process Regression</div>
            </div>
        `;
        this.displayOutput(projectsText);
    }
    
    showSkills() {
        const skillsText = `
            <div class="skill-category">
                <div class="skill-category-title">Programming Languages:</div>
                <div class="skill-list">Python, C++, Java, C, SQL (PostgreSQL, MySQL), MongoDB (NoSQL), R, TypeScript, JavaScript, HTML/CSS, Assembly, Verilog</div>
            </div>
            
            <div class="skill-category">
                <div class="skill-category-title">Frameworks & Libraries:</div>
                <div class="skill-list">ROS2, React, Next.js, Node.js, Flask, Django, TensorFlow, PyTorch, Keras, HuggingFace, scikit-learn, NumPy, pandas, SciPy, Matplotlib, seaborn, OpenCV, NLTK, Prisma, Material-UI, Tailwind CSS, Discord.js, Puppeteer, Cheerio, Framer Motion, AWS SDK</div>
            </div>
            
            <div class="skill-category">
                <div class="skill-category-title">Developer Tools:</div>
                <div class="skill-list">Git, Docker, AWS (S3, CloudWatch), Vercel, Jenkins, Foxglove Studio, VS Code, Linux, CLI, REST APIs, Jupyter Notebook, Chrome DevTools, Figma, NextAuth.js, Replicate API, Spotify Web API, Prisma Studio, Turbopack, OAuth 2.0</div>
            </div>
            
            <div class="skill-category">
                <div class="skill-category-title">Methodologies:</div>
                <div class="skill-list">Agile (Scrum, Kanban), DevOps, Test-Driven Development (TDD), CI/CD, Hardware-in-the-Loop (HIL) Testing, Git Flow, API Integration, Prompt Engineering</div>
            </div>
            
            <div class="skill-category">
                <div class="skill-category-title">Specializations:</div>
                <div class="skill-list">Robotics, Embedded Systems, SLAM, Machine Learning, Underwater Robotics, Neural Networks, Computer Vision, Web Scraping, Reverse Engineering, Low-level Debugging</div>
            </div>
        `;
        this.displayOutput(skillsText, 'info');
    }
    
    showExperience() {
        const experienceText = `
            
            <strong>🔬 Undergraduate Researcher</strong> | Texas A&M University<br>
            <em>December 2023 - Present | Python, C++, ROS2, Docker, Git</em><br>
            • Engineered a Gaussian Process Regression-based SLAM algorithm in ROS2 to fuse sonar and IMU sensor data<br>
            • Improved localization accuracy by 200% over traditional odometry in underwater culvert navigation<br>
            • Resolved real-time synchronization issues between Jetson and Arduino platforms<br>
            • Enhanced system reliability by 40% during autonomous operations<br><br>
            
            <strong>📚 Research Intern</strong> | National Science Foundation<br>
            <em>May 2024 - August 2024 | Python, C++, ROS2, Docker, Git, Foxglove</em><br>
            • Directed field testing and hardware-in-the-loop automation of BlueROV2<br>
            • Enhanced autonomous entry success rate into flooded culverts by 25%<br>
            • Implemented sonar-based reactive control system with real-time obstacle detection<br>
            • Developed GitLab CI/CD pipelines to automate continuous integration<br><br>
            
            <strong>👨‍🏫 ENGR 102 Peer Tutor</strong> | Texas A&M University<br>
            <em>August 2023 - May 2024 | Python</em><br>
            • Led interactive Python programming tutorials for 100+ students<br>
            • Achieved 15% average improvement in student grades and 25% increase in confidence<br>
            • Provided detailed feedback on 200+ code submissions
        `;
        this.displayOutput(experienceText, 'info');
    }
    
    showEducation() {
        const educationText = `
            <strong>🎓 Texas A&M University</strong> | College Station, TX<br>
            Computer Engineering B.S | GPA: 3.57 | Expected May 2026<br><br>
            
            <strong>📖 Relevant Coursework:</strong><br>
            • Computer Architecture & Computer Systems<br>
            • Data Structures & Algorithms<br>
            • Digital Integrated Circuit Design & Digital System Design<br>
            • Electrical Circuit Theory & Electronics<br>
            • Software Engineering & OOP<br>
            • Microprocessor Systems Design<br>
            • Signals and Systems<br>
            • Databases
        `;
        this.displayOutput(educationText, 'info');
    }
    
    showContact() {
        const contactText = `
            <div class="contact-item">
                <span class="contact-label">Email:</span> williamsxuu@gmail.com
            </div>
            <div class="contact-item">
                <span class="contact-label">Phone:</span> (530) 760-6746
            </div>
            <div class="contact-item">
                <span class="contact-label">GitHub:</span> github.com/will-iamxu
            </div>
            <div class="contact-item">
                <span class="contact-label">LinkedIn:</span> www.linkedin.com/in/william-xuuu
            </div>
            <div class="contact-item">
                <span class="contact-label">Portfolio:</span> willxu.xyz
            </div>
            <div class="contact-item">
                <span class="contact-label">Location:</span> Davis, CA
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
        this.displayOutput('William Xu Portfolio Console v1.1.1', 'success');
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
    
    openClips() {
        window.open('https://www.youtube.com/@rakcs2', '_blank');
        this.displaySuccess('Opening CS2 clips channel...');
    }
    
    noclip() {
        const messages = [
            'noclip mode enabled - you are now floating through the matrix',
            'Warning: noclip activated. Reality collision disabled.',
            'sv_cheats "1" required to enable noclip',
            'noclip toggled - prepare for interdimensional travel'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.displayOutput(randomMessage, 'warning');
        
        setTimeout(() => {
            this.displayOutput('Just kidding - this is a portfolio, not Source engine 😄', 'info');
        }, 2000);
    }
    
    svCheats(args) {
        const value = args[0] || '0';
        if (value === '1') {
            this.displayOutput('sv_cheats set to 1 - cheats enabled', 'warning');
            this.displayOutput('Achievement unlocked: Godmode activated in portfolio browsing', 'success');
        } else {
            this.displayOutput('sv_cheats set to 0 - cheats disabled', 'info');
            this.displayOutput('Back to legitimate portfolio viewing', 'info');
        }
    }
    
    bindCommand(args) {
        if (args.length === 0) {
            this.displayOutput('Usage: bind [key] [command]', 'error');
            this.displayOutput('Example: bind "f" "toggle flashlight"', 'info');
            return;
        }
        
        const key = args[0];
        const command = args.slice(1).join(' ') || 'undefined';
        this.displayOutput(`Bound "${key}" to "${command}"`, 'success');
        this.displayOutput('Note: Keybinds only work in actual CS2, not in portfolios 😉', 'info');
    }
    
    fpsMax(args) {
        const fps = args[0] || '60';
        this.displayOutput(`fps_max set to ${fps}`, 'success');
        
        if (parseInt(fps) > 300) {
            this.displayOutput('Warning: Portfolio FPS capped at browser refresh rate', 'warning');
        } else if (parseInt(fps) < 30) {
            this.displayOutput('That\'s gonna be choppy...', 'warning');
        }
    }
    
    netGraph(args) {
        const value = args[0] || '1';
        if (value === '1') {
            this.displayOutput('[networking] net_graph enabled', 'networking');
            this.displayOutput('[networking] Portfolio Stats: 0ms ping, 999fps, 0% loss, perfect connection to William\'s brain', 'networking');
        } else {
            this.displayOutput('[networking] net_graph disabled', 'networking');
        }
    }
    
    serverStatus() {
        this.displayOutput('[console] Portfolio Server Status:', 'console');
        this.displayOutput('[console] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'console');
        this.displayOutput('[console] Server: William\'s Portfolio v1.1.1', 'console');
        this.displayOutput('[console] Map: portfolio_terminal', 'console');
        this.displayOutput('[console] Players: 1/1 (you)', 'console');
        this.displayOutput('[steamnetsockets] Ping: <1ms (localhost)', 'steamnetsockets');
        this.displayOutput('[console] Tickrate: 128 (thoughts per second)', 'console');
        this.displayOutput('[console] Uptime: ' + Math.floor((Date.now() - this.startTime) / 1000) + 's', 'console');
        this.displayOutput('[console] Anti-cheat: Secured by good vibes', 'console');
    }
    
    quit() {
        this.displayOutput('Thanks for checking out my portfolio!', 'success');
        this.displayOutput('Disconnecting from William\'s brain server...', 'info');
        
        setTimeout(() => {
            this.displayOutput('Just kidding - you can\'t quit a portfolio that easily 😄', 'warning');
            this.displayOutput('Try "contact" to actually reach out!', 'info');
        }, 2000);
    }
    
    disconnect() {
        this.displayOutput('Disconnected from server', 'warning');
        this.displayOutput('Reason: "Thanks for visiting!"', 'info');
        
        setTimeout(() => {
            this.displayOutput('Auto-reconnecting to portfolio server...', 'info');
            this.displayOutput('Connection established. Welcome back!', 'success');
        }, 3000);
    }
}

function closeConsole() {
    if (confirm('Are you sure you want to close the console?')) {
        document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #222222; color: #fff; font-family: Source Code Pro, monospace;"><div style="text-align: center;"><h1>CONSOLE CLOSED</h1><p>Thanks for visiting William Xu\'s portfolio!</p><p><a href="javascript:location.reload()" style="color: #00bfff;">Click here to reopen</a></p></div></div>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioConsole();
});
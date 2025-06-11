// Only run if we're in a browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    
    function selectDucky(name, imagePath) {
        try {
            localStorage.setItem("selectedDuckyName", name);
            localStorage.setItem("selectedDuckyImage", imagePath);
            window.location.href = "select-time.html";
        } catch (error) {
            // Fallback to URL parameters if localStorage fails
            const params = new URLSearchParams();
            params.set('name', name);
            params.set('image', imagePath);
            window.location.href = `select-time.html?${params.toString()}`;
        }
    }

    function startTimer(minutes) {
        const seconds = minutes * 60;
        try {
            localStorage.setItem("pomodoroDuration", seconds);
            window.location.href = "timer.html";
        } catch (error) {
            // Fallback to URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const name = urlParams.get('name') || localStorage.getItem("selectedDuckyName");
            const image = urlParams.get('image') || localStorage.getItem("selectedDuckyImage");
            
            const params = new URLSearchParams();
            if (name) params.set('name', name);
            if (image) params.set('image', image);
            params.set('duration', seconds);
            
            window.location.href = `timer.html?${params.toString()}`;
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Try to get data from localStorage first, then URL params
    let name = null;
    let image = null;
    let duration = null;

    try {
        name = localStorage.getItem("selectedDuckyName") || urlParams.get('name');
        image = localStorage.getItem("selectedDuckyImage") || urlParams.get('image');
        duration = parseInt(localStorage.getItem("remainingTime") || localStorage.getItem("pomodoroDuration") || urlParams.get('duration'), 10);
    } catch (error) {
        // Use URL params only
        name = urlParams.get('name');
        image = urlParams.get('image');
        duration = parseInt(urlParams.get('duration'), 10);
    }

    const nameElem = document.getElementById("ducky-name");
    const imageElem = document.getElementById("ducky-image");
    const timerElem = document.getElementById("timer-display");

    if (nameElem && name) nameElem.textContent = name;
    if (imageElem && name) {
        const duckName = name.trim().toLowerCase();

        const duckFrames = [
            `Images/${duckName}/${duckName} 1.png`,
            `Images/${duckName}/${duckName} 2.png`,
            `Images/${duckName}/${duckName} 3.png`,
            `Images/${duckName}/${duckName} 4.png`
        ];

        let currentFrame = 0;

        setInterval(() => {
            imageElem.src = duckFrames[currentFrame];
            currentFrame = (currentFrame + 1) % duckFrames.length;
        }, 200); // 200ms per frame
    }
    let timerStarted = false;
    if (timerElem && duration && !timerStarted) {
        timerStarted = true;
        startCountdown(duration);
    }


    // Quit confirmation logic
    let clickCount = 0;

    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const promptText = document.querySelector(".container h3");

    if (yesBtn && noBtn && promptText) {
        yesBtn.addEventListener("click", (e) => {
            e.preventDefault();
            clickCount++;

            // Shrink Yes, Grow No
            const shrinkFactor = Math.max(1 - clickCount * 0.2, 0.5);
            const growFactor = 1 + clickCount * 0.3;

            yesBtn.style.transform = `scale(${shrinkFactor})`;
            noBtn.style.transform = `scale(${growFactor})`;

            // Update prompt text
            if (clickCount === 1) {
                promptText.textContent = "Are you REALLY REALLY REALLY REALLY sure?";
            } else if (clickCount === 2) {
                promptText.textContent = "ARE YOU SUPER DUPER SURE YOU WANT TO GIVE UP?";
            } else if (clickCount >= 3) {
                window.location.href = "index.html";
            }
        });
    }
});

    function startCountdown(seconds) {
        const display = document.getElementById("timer-display");
        let remaining = seconds;

        // Save remaining time every second
        localStorage.setItem("remainingTime", remaining);

        const interval = setInterval(() => {
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            localStorage.setItem("remainingTime", remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                localStorage.removeItem("remainingTime"); // ✅ clear when done
                alert("Time's up!");
            }

            remaining--;
        }, 1000);
    }

    // Make functions global so they can be called from HTML
    window.selectDucky = selectDucky;
    window.startTimer = startTimer;
}
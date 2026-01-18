console.log("✅ Client Script Loaded!"); // Check 1: Does the file run?

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ DOM Loaded!"); 

    // 1. Try to find the buttons
    const buttons = document.querySelectorAll('button'); // Changed to 'button' to catch ALL buttons
    console.log(`Found ${buttons.length} buttons on the page.`); // Check 2: How many buttons?

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            console.log("🖱️ Button Clicked!"); // Check 3: Did the click register?

            // Try to find the sound ID
            // We check BOTH 'data-sound' AND 'id' to be safe
            const soundId = button.getAttribute('data-sound') || button.id;
            console.log(`🎵 Sound ID identified as: ${soundId}`); 

            if (!soundId) {
                console.error("❌ ERROR: Button has no ID or data-sound attribute!");
                return;
            }

            // Play Sound
            const audioPath = `sounds/${soundId}.mp3`;
            console.log(`🔊 Playing: ${audioPath}`);
            new Audio(audioPath).play().catch(e => console.error("Audio Error:", e));

            // Send to Server
            console.log(`📡 Sending to server...`);
            updateClickCount(soundId);
        });
    });
});

async function updateClickCount(id) {
    try {
        const response = await fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        
        console.log("📨 Response received from server");
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ Count updated to: ${data.newCount}`);
            // Try to find the number on the screen to update it
            const element = document.getElementById(`count-${id}`);
            if (element) {
                element.innerText = data.newCount;
            } else {
                console.warn(`⚠️ Could not find stats text with id="count-${id}"`);
            }
        }
    } catch (error) {
        console.error('❌ Network Error:', error);
    }
}
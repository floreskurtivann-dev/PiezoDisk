(function() {
    const btnConnect = document.getElementById('connectBtn');
    const vDisp = document.getElementById('voltage');
    const tDisp = document.getElementById('total');
    const status = document.getElementById('status');

    btnConnect.addEventListener('click', async () => {
        try {
            const port = await navigator.serial.requestPort();
            // Match the Arduino 115200 baud rate!
            await port.open({ baudRate: 115200 });
            
            status.innerText = "● Online";
            status.style.color = "#22c55e";

            const reader = port.readable.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value);
                let lines = buffer.split("\n");
                buffer = lines.pop(); 

                for (let line of lines) {
                    // Expecting "0.0034,0.000045"
                    const parts = line.trim().split(",");
                    if (parts.length >= 2) {
                        const voltageSpike = parseFloat(parts[0]);
                        const cumulativeEnergy = parseFloat(parts[1]);

                        vDisp.innerText = voltageSpike.toFixed(4);
                        tDisp.innerText = cumulativeEnergy.toFixed(6);
                    }
                }
            }
        } catch (err) {
            status.innerText = "● Connection Failed";
        }
    });
})();
async function evaluatePrompt() {
    const promptInput = document.getElementById('promptInput').value.trim();
    const submitBtn = document.getElementById('submitBtn');
    const resultBox = document.getElementById('resultBox');
    const loadingText = document.getElementById('loadingText');

    if (!promptInput) {
        alert("Please enter a prompt!");
        return;
    }

    // ✅ Loading state
    submitBtn.disabled = true;
    submitBtn.innerText = "Thinking...";
    resultBox.style.display = 'none';
    loadingText.style.display = 'block';

    try {
        const response = await fetch('http://localhost:5000/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptInput })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Server Error");
        }

        // ✅ Safe destructuring
        const {
            overall_score = 0,

            clarity_score = 0,
            clarity_reason = "",

            persona_score = 0,
            persona_reason = "",

            context_score = 0,
            context_reason = "",

            constraint_score = 0,
            constraint_reason = "",

            structure_score = 0,
            structure_reason = "",

            hallucination_risk = 0,
            hallucination_reason = "",

            feedback = "",
            improved_prompt = "",
            original_preview = "",
            improved_preview = "",
            total_tokens = 0
        } = data;

        // ✅ Metrics
        const metricDiv = document.getElementById('metrics');

        metricDiv.innerHTML =
            createMetricBar("Clarity", clarity_score, clarity_reason) +
            createMetricBar("Persona", persona_score, persona_reason) +
            createMetricBar("Context", context_score, context_reason) +
            createMetricBar("Constraints", constraint_score, constraint_reason) +
            createMetricBar("Structure", structure_score, structure_reason) +
            createMetricBar("Hallucination Risk", hallucination_risk, hallucination_reason);

        // ✅ Update UI
        document.getElementById('scoreDisplay').innerText = overall_score;
        document.getElementById('feedbackDisplay').innerText = feedback;
        document.getElementById('improvedDisplay').innerText = improved_prompt;
        document.getElementById('oldPreview').innerText = original_preview;
        document.getElementById('newPreview').innerText = improved_preview;
        document.getElementById('tokenDisplay').innerText = total_tokens;

        // ✅ Cost (temporary logic)
        const estimated_cost = (total_tokens / 1000) * 0.05;
        document.getElementById('costDisplay').innerText = "₹" + estimated_cost.toFixed(4);

        resultBox.style.display = 'block';

    } catch (error) {
        console.error(error);
        alert(error.message || "Error connecting to backend.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Evaluate";
        loadingText.style.display = 'none';
    }
}

function createMetricBar(label, score, reason) {
    const color = score > 7 ? '#4caf50' : (score > 4 ? '#ffc107' : '#f44336');

    return `
        <div class="metric-container">
            <div style="display:flex; justify-content:space-between">
                <span>${label}</span>
                <span>${score}/10</span>
            </div>
            <div class="progress-bg">
                <div class="progress-fill" style="width: ${score * 10}%; background: ${color}"></div>
            </div>
            <div class="metric-reason">${reason}</div>
        </div>
    `;
}

async function copyToClipboard() {
    const textToCopy = document.getElementById("improvedDisplay").innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtn = document.querySelector('.improved-zone button');
        const originalText = copyBtn.innerHTML;

        copyBtn.innerHTML = "✅";
        copyBtn.style.background = "#4caf50";

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = "#6200ee";
        }, 2000);

    }).catch((e) => {
        console.log("Failed to Copy", e);
        alert("Copy Failed!");
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = "http://localhost:5000";

    // --- Lógica de Navegación entre Secciones (SPA) ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.main-content section');
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');

    function showSection(targetId) {
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.remove('hidden');
                section.classList.add('active');
            } else {
                section.classList.add('hidden');
                section.classList.remove('active');
            }
        });
        navItems.forEach(item => {
            if (item.getAttribute('href') === `#${targetId}`) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const textBtn = button.classList.contains('btn-primary');
            showSection(textBtn ? 'text-tools' : 'image-tools');
        });
    });

    // --- Generador de Texto ---
    const generateTextBtn = document.getElementById('generate-text');
    const textOutput = document.getElementById('text-output');
    const textTopic = document.getElementById('text-topic');
    const textType = document.getElementById('text-type');
    const textLength = document.getElementById('text-length');
    const copyTextBtn = document.getElementById('copy-text');
    const loadingSpinnerText = generateTextBtn.nextElementSibling;

    generateTextBtn.addEventListener('click', async () => {
        const topic = textTopic.value.trim();
        const type = textType.value;
        const length = textLength.value;

        if (!topic) {
            alert("Por favor, ingresa un tema.");
            return;
        }

        loadingSpinnerText.style.display = "inline-block";
        textOutput.value = "";

        try {
            const response = await fetch(`${BACKEND_URL}/api/generate-text`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, type, length })
            });
            const data = await response.json();
            if (data.text) {
                textOutput.value = data.text;
            } else {
                textOutput.value = data.error || "Error al generar el texto.";
            }
        } catch (err) {
            textOutput.value = "Error de conexión con el servidor.";
        } finally {
            loadingSpinnerText.style.display = "none";
        }
    });

    copyTextBtn.addEventListener('click', () => {
        textOutput.select();
        document.execCommand('copy');
    });

    // --- Generador de Imágenes ---
    const generateImageBtn = document.getElementById('generate-image');
    const imagePrompt = document.getElementById('image-prompt');
    const imageStyle = document.getElementById('image-style');
    const generatedImage = document.getElementById('generated-image');
    const imagePlaceholder = document.getElementById('image-placeholder');
    const loadingSpinnerImage = generateImageBtn.nextElementSibling;

    generateImageBtn.addEventListener('click', async () => {
        const prompt = imagePrompt.value.trim();
        const style = imageStyle.value;

        if (!prompt) {
            alert("Por favor, ingresa una descripción.");
            return;
        }

        loadingSpinnerImage.style.display = "inline-block";
        generatedImage.style.display = "none";
        imagePlaceholder.textContent = "Generando imagen...";

        try {
            const response = await fetch(`${BACKEND_URL}/api/generate-image`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, style })
            });
            const data = await response.json();
            if (data.image_url) {
                generatedImage.src = data.image_url;
                generatedImage.style.display = "block";
                imagePlaceholder.textContent = "";
            } else {
                generatedImage.style.display = "none";
                imagePlaceholder.textContent = data.error || "Error al generar la imagen.";
            }
        } catch (err) {
            generatedImage.style.display = "none";
            imagePlaceholder.textContent = "Error de conexión con el servidor.";
        } finally {
            loadingSpinnerImage.style.display = "none";
        }
    });
});
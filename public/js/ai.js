document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ai-form');
    if (!form) return;

    const status = document.getElementById('ai-status');
    const out = document.getElementById('ai-response');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const model = document.getElementById('model').value;
        const prompt = document.getElementById('prompt').value.trim();
        const fileInput = document.getElementById('file');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!prompt) {
            out.textContent = 'Введите запрос.';
            return;
        }

        status.textContent = 'Запрос отправлен...';
        out.textContent = '';
        submitBtn.disabled = true;
        submitBtn.classList.add('btn--disabled');

        try {
            let data;
            if (fileInput && fileInput.files && fileInput.files.length) {
                const f = fileInput.files[0];
                const formData = new FormData();
                formData.append('file', f);
                formData.append('question', prompt);
                if (model) formData.append('model', model);

                const res = await fetch('/api/ai/file', { method: 'POST', body: formData });
                data = await res.json();
            } else {
                const res = await fetch('/api/ai/text', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model, prompt })
                });
                data = await res.json();
            }
            if (data.error) {
                out.textContent = `Ошибка: ${data.error}`;
            } else {
                // Simulate typing reveal
                const text = data.response || 'Нет ответа';
                out.textContent = '';
                for (let i = 0; i < text.length; i++) {
                    out.textContent += text[i];
                    // small delay to simulate streaming
                    // eslint-disable-next-line no-await-in-loop
                    await new Promise(r => setTimeout(r, 6));
                }
            }
        } catch (err) {
            out.textContent = 'Ошибка соединения с сервером.';
            console.error(err);
        } finally {
            status.textContent = '';
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn--disabled');
        }
    });
});

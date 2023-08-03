document.querySelectorAll('.flash').forEach(message => {
    message.addEventListener('click', e => {
        message.remove();
    });
});
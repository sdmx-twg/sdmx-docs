document.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector('.md-content'); // For Material theme
    if (!content) return;

    const elements = content.querySelectorAll('p, li');
    let counter = 0;

    elements.forEach((el) => {
        const id = `block-${counter++}`;
        el.setAttribute('id', id);

        const anchor = document.createElement('a');
        anchor.href = `#${id}`;
        anchor.innerText = ' 🔗';
        anchor.title = 'Copy link';
        anchor.className = 'copy-link';
        anchor.style.textDecoration = 'none';
        anchor.style.marginLeft = '0.5em';

        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const fullUrl = window.location.origin + window.location.pathname + `#${id}`;
            // Check for Clipboard API and secure context
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(fullUrl).then(() => {
                    anchor.innerText = ' ✅';
                    setTimeout(() => {
                        anchor.innerText = ' 🔗';
                    }, 1000);
                }).catch(err => {
                    console.error('Copy failed', err);
                    alert('Failed to copy link. Please try again.');
                });
            } else {
                // Fallback for insecure context or unsupported Clipboard API
                fallbackCopyTextToClipboard(fullUrl, anchor);
            }
        });

        el.appendChild(anchor);
    });
});

// Fallback copy function for insecure context or unsupported Clipboard API
function fallbackCopyTextToClipboard(text, anchor) {
    // Create a temporary textarea to select and copy
    var textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        if (successful) {
            anchor.innerText = ' ✅';
            setTimeout(() => {
                anchor.innerText = ' 🔗';
            }, 1000);
        } else {
            throw new Error('execCommand returned false');
        }
    } catch (err) {
        console.error('Fallback: Copy failed', err);
        alert('Failed to copy link. Please copy it manually.');
    }
    document.body.removeChild(textArea);
}

// Highlight the anchor target when navigated via URL hash
function highlightAnchorTarget() {
    const hash = window.location.hash;
    if (!hash) return;

    // Delay to ensure rendering
    setTimeout(() => {
        const target = document.querySelector(hash);
        if (!target) return;

        target.classList.add('highlighted-anchor');

        // Remove the highlight after a few seconds
        setTimeout(() => {
            target.classList.remove('highlighted-anchor');
        }, 2000);
    }, 100); // slight delay after load
}

highlightAnchorTarget();
window.addEventListener('hashchange', highlightAnchorTarget);

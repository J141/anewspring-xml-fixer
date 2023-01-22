import {readFile} from "./promiseFileReader.js";

export function addFileSubmitHandler(handler) {
    document.querySelectorAll('form').forEach((form) => form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const fileInput = e.target.querySelector('input[type="file"]');
        if(!fileInput) return;

        if(fileInput.files.length !== 1) return;

        const file = fileInput.files[0];
        if(file.type !== 'text/xml') return;

        const content = await readFile(file);
        handler(content, file.name);
    }))
}

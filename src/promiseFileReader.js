export function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            resolve(e.target.result);
        });
        reader.addEventListener('error', () => {
            reject('an error occurred while attempting to read the file')
        })
        reader.readAsText(file);
    })
}

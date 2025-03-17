export function readFileAsync(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsText(file);

    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
}

export function readJsonFileAsync<T = any>(file: File): Promise<T> {
    return readFileAsync(file).then(content => jsonParse(content));
}

export function jsonParse<T = any>(data: string): T {
    return JSON.parse(data);
}

export function deepCopy<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}

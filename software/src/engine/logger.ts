/**
 * Les couleurs pour les logs de la console
 * @type {Object<string, string>}
 */
const colors = {
    black: '\x1b[0;30m',
    grey: '\x1b[0;37m',
    red: '\x1b[0;31m',
    green: '\x1b[0;32m',
    brown: '\x1b[0;33m',
    blue: '\x1b[0;34m',
    purple: '\x1b[0;35m',
    
    darkGrey: '\x1b[1;30m',
    lightRed: '\x1b[1;31m',
    lightGreen: '\x1b[1;32m',
    yellow: '\x1b[1;33m',
    lightBlue: '\x1b[1;34m',
    magenta: '\x1b[1;35m',
    cyan: '\x1b[1;36m',
    white: '\x1b[1;37m',

    initial: '\x1b[0m'
};

function getPrettyTimestamp(): string {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
        + ` ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
}

function getLogPrefix(callee: string, color: string): string {
    const timestamp = getPrettyTimestamp();

    return `${color}[APP] ${process.pid} - ${colors.initial}`
        + `${timestamp}    `
        + `${color}LOG${colors.initial} `
        + `${colors.yellow}[${callee}]${colors.initial}`;
}

function formatObject(prefix: string, arg: object): string {
    const json = JSON.stringify(arg, null, 2);
                
    const prefixedJson = json
        .split('\n')
        .map((line, idx) => idx === 0 ? `${colors.green}${line}` : `${prefix} ${colors.white}${line}`)
        .join('\n') + colors.initial;

    return prefixedJson;
}

function formattedArgs(prefix: string, args: any[], color: string): any[] {
    return args.map(arg => {
        if(typeof arg === 'string') {
            return `${color}${arg}${colors.initial}`;
        }

        else if(typeof arg === 'object') {
            return formatObject(prefix, arg);
        }

        return arg;
    });
}

function getCallee(): string {
    const stack = new Error().stack?.split('\n') ?? [];
    const caller = stack[3]?.trim().split(/\s|\./)[1] ?? "";
    return caller.replace('Object', 'App');
}

export namespace Logger {
    export function log(...args: any[]): void {
        const callee = getCallee();
        const prefix = getLogPrefix(callee, colors.green);
        console.log(prefix, ...formattedArgs(prefix, args, colors.green));
    }

    export function info(...args: any[]): void {
        const callee = getCallee();
        const prefix = getLogPrefix(callee, colors.blue);
        console.info(prefix, ...formattedArgs(prefix, args, colors.blue));
    }

    export function warn(...args: any[]): void {
        const callee = getCallee();
        const prefix = getLogPrefix(callee, colors.brown);
        console.warn(prefix, ...formattedArgs(prefix, args, colors.brown));
    }

    export function error(...args: any[]): void {
        const callee = getCallee();
        const prefix = getLogPrefix(callee, colors.red);
        console.error(prefix, ...formattedArgs(prefix, args, colors.red));
    }

    export function debug(...args: any[]): void {
        const callee = getCallee();
        const prefix = getLogPrefix(callee, colors.purple);
        console.debug(prefix, ...formattedArgs(prefix, args, colors.purple));
    }
}
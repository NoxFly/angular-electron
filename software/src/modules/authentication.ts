import { ipcMain } from "electron/main";

export class AuthenticationService {
    private isRegistered: boolean = false;
    private isLoggedIn: boolean = false;

    constructor() {
        this.setupBridge();
    }

    public async dispose(): Promise<void> {

    }

    private setupBridge(): void {
        ipcMain.handle("get-auth-state", () => ({ registered: this.isRegistered, loggedIn: this.isLoggedIn }));
        ipcMain.handle("register", () => this.register());
        ipcMain.handle("unregister", () => this.unregister());
        ipcMain.handle("login", () => this.login());
        ipcMain.handle("logout", () => this.logout());
    }

    private register(): void {
        this.isRegistered = true;
    }

    private unregister(): void {
        this.isRegistered = false;
    }

    private login(): void {
        this.isLoggedIn = true;
    }

    private logout(): void {
        this.isLoggedIn = false;
    }

}

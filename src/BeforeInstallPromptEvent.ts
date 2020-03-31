// https://github.com/andreashuber69/net-worth#--
declare global {
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface WindowEventMap {
        "beforeinstallprompt": BeforeInstallPromptEvent;
    }
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;

    prompt(): Promise<void>;
}

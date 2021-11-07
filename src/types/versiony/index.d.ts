declare module 'versiony' {
    export interface Versiony {
        from: (file?: string) => Versiony;
        with: (filename: string) => Versiony;
        patch: () => Versiony;
        end: (params?: { quiet: boolean }) => {
            version: string,
            files: string[]
        };
    }
    
    declare const versiony: Versiony
    export default versiony
}
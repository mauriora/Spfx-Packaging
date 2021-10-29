declare module 'versiony' {
    export interface Versiony {
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
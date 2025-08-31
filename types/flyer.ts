
export interface FlyerInputs {
    headline: string;
    bodyText: string;
    cta: string;
    eventDetails: string;
}

export interface FlyerStyle {
    headlineColor: string;
    headlineFontSize: number;
    bodyColor: string;
    bodyFontSize: number;
}

export interface FlyerTemplate {
    id: string;
    name: string;
    eventType: string;
    previewUrl: string;
    data: {
        inputs: FlyerInputs;
        style: FlyerStyle;
        aiPrompt: string;
    };
}
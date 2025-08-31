
export interface PosterInputs {
    headline: string;
    bodyText: string;
    cta: string;
    eventDetails: string;
}

export interface PosterStyle {
    headlineColor: string;
    headlineFontSize: number;
    bodyColor: string;
    bodyFontSize: number;
}

export interface PosterTemplate {
    id: string;
    name: string;
    theme: string;
    previewUrl: string;
    data: {
        inputs: PosterInputs;
        style: PosterStyle;
        aiPrompt: string;
    };
}
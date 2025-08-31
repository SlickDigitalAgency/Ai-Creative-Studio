

export interface BusinessCardInputs {
    name: string;
    title: string;
    company: string;
    phone: string;
    email: string;
    website: string;
}

export interface BusinessCardStyle {
    textColor: string;
    fontSize: number;
    background?: string;
}

export interface BusinessCardTemplate {
    id: string;
    name: string;
    industry: string;
    previewUrl: string;
    data: {
        inputs: BusinessCardInputs;
        style: BusinessCardStyle;
        aiPrompt: string;
    };
}
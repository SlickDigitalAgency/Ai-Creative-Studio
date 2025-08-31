export interface LogoGenerationInputs {
    companyName: string;
    industry: string;
    style: 'minimalist' | 'modern' | 'vintage' | 'playful' | 'elegant' | 'bold' | 'geometric';
    colors: string;
}

export interface GeneratedLogo {
    svg: string;
}

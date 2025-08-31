
export interface AdCampaignInputs {
  headline: string;
  bodyText: string;
  cta: string;
}

export interface AdStyle {
  textColor: string;
  fontSize: number;
}

export interface SocialPlatformFormat {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  aspectRatio: '9:16' | '1:1' | '1.91:1' | '16:9';
}

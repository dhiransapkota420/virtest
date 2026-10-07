export interface ListItem {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  status: 'active' | 'offline' | 'busy' | 'away';
  avatarColor: string;
}

export interface SlideContent {
  id: number;
  title: string;
  subtitle?: string;
  badge?: string;
  bullets?: string[];
  cards?: {
    title: string;
    description: string;
    icon?: string;
    tag?: string;
    highlight?: boolean;
  }[];
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  visualDiagramType?: 'flow' | 'math' | 'dom-comparison' | 'ecosystem' | 'checklist';
  quickAction?: {
    label: string;
    targetTab: 'example1' | 'example2' | 'presentation' | 'tanstack';
  };
}

export type ActiveTab = 'presentation' | 'example1' | 'example2' | 'tanstack';

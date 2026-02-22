export interface Perk {
  id: string;
  name: string;
  description: string;
  value: string;
  category: 'Cloud' | 'Marketing' | 'Finance' | 'Design' | 'Developer Tools' | 'AI';
  logo: string;
  website: string;
}

export const MOCK_PERKS: Perk[] = [
  {
    id: '1',
    name: 'AWS',
    description: 'Build, deploy, and manage websites and apps on the most comprehensive cloud platform.',
    value: '$5,000 Credits',
    category: 'Cloud',
    logo: 'https://logo.clearbit.com/aws.amazon.com',
    website: 'https://aws.amazon.com'
  },
  {
    id: '2',
    name: 'Stripe',
    description: 'Financial infrastructure for the internet. Accept payments and manage your business online.',
    value: '$20,000 Fee-free',
    category: 'Finance',
    logo: 'https://logo.clearbit.com/stripe.com',
    website: 'https://stripe.com'
  },
  {
    id: '3',
    name: 'HubSpot',
    description: 'Customer relationship management, marketing, sales, and customer service software.',
    value: '90% Off',
    category: 'Marketing',
    logo: 'https://logo.clearbit.com/hubspot.com',
    website: 'https://hubspot.com'
  },
  {
    id: '4',
    name: 'Notion',
    description: 'The all-in-one workspace for your notes, tasks, wikis, and databases.',
    value: '$1,000 Credits',
    category: 'Design',
    logo: 'https://logo.clearbit.com/notion.so',
    website: 'https://notion.so'
  },
  {
    id: '5',
    name: 'DigitalOcean',
    description: 'Simplified cloud computing for developers and businesses to build and scale apps.',
    value: '$2,000 Credits',
    category: 'Cloud',
    logo: 'https://logo.clearbit.com/digitalocean.com',
    website: 'https://digitalocean.com'
  },
  {
    id: '6',
    name: 'GitHub',
    description: 'The world\'s leading AI-powered developer platform to build, scale, and deliver secure software.',
    value: 'Free Enterprise',
    category: 'Developer Tools',
    logo: 'https://logo.clearbit.com/github.com',
    website: 'https://github.com'
  },
  {
    id: '7',
    name: 'OpenAI',
    description: 'Access GPT-4, DALL-E, and more. Perfect for students building AI-first applications.',
    value: '$2,500 Credits',
    category: 'AI',
    logo: 'https://logo.clearbit.com/openai.com',
    website: 'https://openai.com'
  },
  {
    id: '8',
    name: 'Anthropic',
    description: 'Build with Claude, a next-generation AI assistant. High-performance API for research and dev.',
    value: '$1,000 Credits',
    category: 'AI',
    logo: 'https://logo.clearbit.com/anthropic.com',
    website: 'https://anthropic.com'
  },
  {
    id: '9',
    name: 'Perplexity',
    description: 'AI-powered search engine that provides direct answers to queries with citations.',
    value: '1 Year Pro Free',
    category: 'AI',
    logo: 'https://logo.clearbit.com/perplexity.ai',
    website: 'https://perplexity.ai'
  },
  {
    id: '10',
    name: 'Midjourney',
    description: 'Generate high-quality images from natural language descriptions. Creative tool for designers.',
    value: '50% Student Off',
    category: 'AI',
    logo: 'https://logo.clearbit.com/midjourney.com',
    website: 'https://midjourney.com'
  },
  {
    id: '11',
    name: 'Weights & Biases',
    description: 'The developer-first MLOps platform. Track experiments, version data, and collaborate.',
    value: 'Free Academic',
    category: 'AI',
    logo: 'https://logo.clearbit.com/wandb.ai',
    website: 'https://wandb.ai'
  }
];

import mongoose from 'mongoose';
import Category from '@/models/Category';
import Tool from '@/models/Tool';

const categories = [
  {
    name: 'Legal',
    slug: 'legal',
    description: 'Legal documents and contracts',
    icon: 'scale',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Business documents and proposals',
    icon: 'briefcase',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'Personal',
    slug: 'personal',
    description: 'Personal documents and letters',
    icon: 'user',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Educational documents and templates',
    icon: 'graduation-cap',
    sortOrder: 4,
    isActive: true,
  },
];

const tools = [
  {
    name: 'Generate Document',
    slug: 'generate-document',
    description: 'Generate documents from templates',
    category: 'general',
    type: 'generate',
    credits: 1,
    features: ['Custom templates', 'AI-powered content', 'Multiple formats'],
    outputFormat: 'pdf',
    isActive: true,
    isPro: false,
  },
  {
    name: 'Convert Format',
    slug: 'convert-format',
    description: 'Convert documents between formats',
    category: 'converter',
    type: 'convert',
    credits: 1,
    features: ['PDF to DOCX', 'DOCX to PDF', 'Image conversion'],
    inputFormat: ['pdf', 'docx', 'txt', 'md', 'jpg', 'png'],
    outputFormat: 'pdf',
    isActive: true,
    isPro: false,
  },
  {
    name: 'Voice to Document',
    slug: 'voice-to-document',
    description: 'Convert voice recordings to text documents',
    category: 'voice',
    type: 'generate',
    credits: 2,
    features: ['Speech recognition', 'Multiple languages', 'Punctuation'],
    inputFormat: ['mp3', 'wav', 'm4a'],
    outputFormat: 'txt',
    isActive: true,
    isPro: false,
  },
  {
    name: 'Extract Text',
    slug: 'extract-text',
    description: 'Extract text from images and PDFs',
    category: 'extraction',
    type: 'extract',
    credits: 1,
    features: ['OCR extraction', 'Table detection', 'Handwriting recognition'],
    inputFormat: ['pdf', 'jpg', 'png', 'jpeg'],
    outputFormat: 'txt',
    isActive: true,
    isPro: false,
  },
  {
    name: 'Merge Documents',
    slug: 'merge-documents',
    description: 'Combine multiple documents into one',
    category: 'converter',
    type: 'convert',
    credits: 1,
    features: ['PDF merge', 'DOCX merge', 'Custom ordering'],
    inputFormat: ['pdf', 'docx'],
    outputFormat: 'pdf',
    isActive: true,
    isPro: false,
  },
  {
    name: 'Split Document',
    slug: 'split-document',
    description: 'Split documents into multiple files',
    category: 'converter',
    type: 'convert',
    credits: 1,
    features: ['Page range split', 'Chapter split', 'Section detection'],
    inputFormat: ['pdf'],
    outputFormat: 'pdf',
    isActive: true,
    isPro: false,
  },
  {
    name: 'Translate',
    slug: 'translate',
    description: 'Translate documents to different languages',
    category: 'language',
    type: 'edit',
    credits: 2,
    features: ['100+ languages', 'Context preservation', 'Format retention'],
    inputFormat: ['pdf', 'docx', 'txt', 'md'],
    outputFormat: 'pdf',
    isActive: true,
    isPro: true,
  },
  {
    name: 'Summarize',
    slug: 'summarize',
    description: 'Generate summaries of long documents',
    category: 'ai',
    type: 'edit',
    credits: 2,
    features: ['Key points extraction', 'Bullet summaries', 'Custom length'],
    inputFormat: ['pdf', 'docx', 'txt', 'md'],
    outputFormat: 'txt',
    isActive: true,
    isPro: true,
  },
];

export async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/cremy-docs');

    console.log('Seeding categories...');
    for (const category of categories) {
      await Category.findOneAndUpdate(
        { slug: category.slug },
        category,
        { upsert: true, new: true }
      );
    }
    console.log('Categories seeded');

    console.log('Seeding tools...');
    for (const tool of tools) {
      await Tool.findOneAndUpdate(
        { slug: tool.slug },
        tool,
        { upsert: true, new: true }
      );
    }
    console.log('Tools seeded');

    console.log('Database seeded successfully!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase().catch(console.error);
}

export default seedDatabase;
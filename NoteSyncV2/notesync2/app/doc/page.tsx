// app/doc/page.tsx
import { redirect } from 'next/navigation';
import { createNewDocument } from '@/actions/actions';

export default async function DocPage() {
  // Just call createNewDocument without parameters
  const result = await createNewDocument();
  
  // Use result.docId instead of result.id
  redirect(`/doc/${result.docId}`);
}
import { notFound } from 'next/navigation';

export default function HeaderSSRPage() {
  // Redirect to 404 page
  notFound();
}

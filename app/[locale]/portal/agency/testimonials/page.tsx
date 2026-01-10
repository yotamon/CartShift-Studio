import { Metadata } from 'next';
import AgencyTestimonialsClient from './AgencyTestimonialsClient';

export const metadata: Metadata = {
  title: 'Testimonials | Agency Portal',
  description: 'Review and manage client testimonial submissions',
};

export default function AgencyTestimonialsPage() {
  return <AgencyTestimonialsClient />;
}

import { generatePageMetadata } from '@/config/seo';

export const metadata = generatePageMetadata({
  title: 'Contact',
  description: 'Get in touch with the Cremy Docs team. We value your feedback and are here to help.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Have questions, feedback, or need help? Reach out to us.</p>
      <div>
        <p>Email: support@cremydocs.com</p>
      </div>
      <form>
        <div>
          <label>Name: <input type="text" name="name" /></label>
        </div>
        <div>
          <label>Email: <input type="email" name="email" /></label>
        </div>
        <div>
          <label>Message: <textarea name="message" rows={5}></textarea></label>
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}
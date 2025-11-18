import React from 'react';
import SEO from '../components/SEO';

// PUBLIC_INTERFACE
export default function About() {
  /** About page with detailed bio. */
  return (
    <article className="card u-p-6">
      <SEO title="About" />
      <h2>About the Teacher</h2>
      <p className="max-w-prose">
        Trained under esteemed gurus with a passion for nurturing talent, the teacher focuses on
        technique, rhythm, expression, and performance readiness. Students are guided through
        repertoire, improvisation, and choreographic works.
      </p>
    </article>
  );
}

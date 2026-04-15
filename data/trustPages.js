import { siteInfo } from './siteContent'

export const trustPages = {
  about: {
    title: 'About Constant PDF',
    eyebrow: 'About',
    intro: 'Constant PDF is a browser-based document toolkit for everyday PDF, image, spreadsheet, and presentation workflows.',
    sections: [
      {
        heading: 'What Constant PDF does',
        body: [
          'Constant PDF helps users merge, split, compress, convert, protect, unlock, sign, crop, label, OCR, and organize documents from one clean interface.',
          'The site is designed for practical document tasks people need before sending files to clients, schools, teams, banks, portals, or public upload forms.',
        ],
      },
      {
        heading: 'How files are handled',
        body: [
          `Uploaded files are processed by the backend service and temporary files are scheduled for cleanup after ${siteInfo.fileRetention}.`,
          'Constant PDF is not a permanent file hosting service. Users should download their result and keep their own secure copy.',
        ],
      },
      {
        heading: 'Responsible use',
        body: [
          'Users should only upload files they own or have permission to process.',
          'Tools such as PDF unlock are intended for authorized documents, not for bypassing access controls on files that belong to someone else.',
        ],
      },
    ],
  },
  contact: {
    title: 'Contact',
    eyebrow: 'Support',
    intro: 'Questions, bug reports, and business enquiries can be sent to the Constant PDF support contact.',
    sections: [
      {
        heading: 'Email',
        body: [
          `Contact: ${siteInfo.contactEmail}`,
          'For support requests, include the tool name, browser, file type, and a short description of what happened. Do not email sensitive documents unless specifically requested.',
        ],
      },
      {
        heading: 'Response expectations',
        body: [
          'Constant PDF aims to respond to genuine support and business enquiries as quickly as possible.',
          'Complex document conversion issues may require sample files, but users should remove personal or confidential information before sharing samples.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'Privacy',
    intro: 'This policy explains the kinds of information Constant PDF may process when users access the website and use document tools.',
    sections: [
      {
        heading: 'Information processed',
        body: [
          'Constant PDF may process uploaded files, generated output files, IP address, browser information, device information, basic request logs, and error logs needed to operate and secure the service.',
          'Uploaded files are used to complete the selected document task. Constant PDF does not sell uploaded documents.',
        ],
      },
      {
        heading: 'Temporary file storage',
        body: [
          `Uploaded and generated files are stored temporarily and are scheduled for cleanup after ${siteInfo.fileRetention}.`,
          'Users should download their processed files promptly. Constant PDF is not designed for long-term file storage.',
        ],
      },
      {
        heading: 'Cookies and advertising',
        body: [
          'The site may use cookies or similar technologies for essential functionality, analytics, fraud prevention, and advertising if those services are enabled.',
          'If Google AdSense is enabled, Google and its partners may use cookies or identifiers to serve and measure ads. Users can manage ad personalization through Google account and browser settings.',
        ],
      },
      {
        heading: 'Third-party services',
        body: [
          'The frontend and backend may run on third-party hosting providers. Those providers may process technical logs needed to deliver the service.',
          'If analytics, advertising, payments, or email features are added, their providers may process information according to their own policies.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          `Privacy questions can be sent to ${siteInfo.contactEmail}.`,
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    eyebrow: 'Terms',
    intro: 'By using Constant PDF, users agree to use the tools responsibly and only for documents they have the right to process.',
    sections: [
      {
        heading: 'Acceptable use',
        body: [
          'Do not upload illegal, harmful, abusive, infringing, or unauthorized files.',
          'Do not use the service to bypass protections, impersonate others, create fraudulent documents, or violate laws or third-party rights.',
        ],
      },
      {
        heading: 'Document ownership',
        body: [
          'Users are responsible for the files they upload and the results they create.',
          'Constant PDF does not claim ownership of user documents, but needs to process uploaded files temporarily to provide the selected tool.',
        ],
      },
      {
        heading: 'No guaranteed output',
        body: [
          'Document conversion can vary depending on file quality, fonts, scans, encryption, layout, and source format.',
          'Users should review processed files before relying on them for legal, financial, academic, medical, or official purposes.',
        ],
      },
      {
        heading: 'Availability',
        body: [
          'Constant PDF may be unavailable during maintenance, hosting interruptions, or heavy processing load.',
          'The service may limit file size, request volume, or processing time to protect reliability.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    eyebrow: 'Cookies',
    intro: 'This page explains how cookies and similar technologies may be used on Constant PDF.',
    sections: [
      {
        heading: 'Essential cookies',
        body: [
          'Essential cookies may be used to remember interface preferences, keep the site secure, and support normal website operation.',
        ],
      },
      {
        heading: 'Analytics and advertising cookies',
        body: [
          'If analytics or AdSense is enabled, cookies or similar identifiers may help measure usage, prevent abuse, and serve relevant ads.',
          'Users can manage cookies in their browser settings. Some features may not work correctly if essential cookies are blocked.',
        ],
      },
      {
        heading: 'Google advertising',
        body: [
          'Google may use cookies to serve ads based on a user’s visits to this and other websites when AdSense is active.',
          'Users can learn about Google ad personalization and controls through Google’s advertising settings.',
        ],
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    eyebrow: 'Important notice',
    intro: 'Constant PDF provides document tools for convenience. It is not a legal, financial, accounting, medical, or professional advice service.',
    sections: [
      {
        heading: 'Review your files',
        body: [
          'Always review output files before sending, signing, publishing, printing, or relying on them.',
          'Conversion results can vary, especially for scanned files, unusual fonts, complex layouts, protected PDFs, or damaged documents.',
        ],
      },
      {
        heading: 'Sensitive documents',
        body: [
          'Do not upload files containing information you are not allowed to process.',
          'For highly sensitive files, use a private environment and follow your organization’s security requirements.',
        ],
      },
    ],
  },
  copyright: {
    title: 'Copyright and DMCA Policy',
    eyebrow: 'Copyright',
    intro: 'Constant PDF respects intellectual property rights and expects users to do the same.',
    sections: [
      {
        heading: 'User responsibility',
        body: [
          'Users should only upload, convert, unlock, or modify files they own or have permission to process.',
          'Constant PDF should not be used to distribute copyrighted material without permission.',
        ],
      },
      {
        heading: 'Copyright enquiries',
        body: [
          `Copyright concerns can be sent to ${siteInfo.contactEmail}.`,
          'Include enough detail to identify the material, the issue, and how to contact the rights holder or authorized representative.',
        ],
      },
    ],
  },
  'file-handling': {
    title: 'File Handling and Deletion',
    eyebrow: 'File safety',
    intro: 'Constant PDF is built for temporary document processing, not permanent file storage.',
    sections: [
      {
        heading: 'Temporary processing',
        body: [
          'When a user uploads a file, the backend stores it temporarily so the selected tool can process it.',
          `Uploaded and generated files are scheduled for cleanup after ${siteInfo.fileRetention}.`,
        ],
      },
      {
        heading: 'Downloads and previews',
        body: [
          'Generated files may be available through preview and download links for a limited time.',
          'Users should download results promptly and avoid sharing temporary links publicly.',
        ],
      },
      {
        heading: 'Practical safety tips',
        body: [
          'Remove unnecessary personal data before uploading test files.',
          'Do not upload documents you do not have permission to process.',
          'For confidential business use, run the service on controlled infrastructure and limit access.',
        ],
      },
    ],
  },
}

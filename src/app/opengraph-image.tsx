import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'AutoMail';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#020617',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'sans-serif',
        }}
      >
        <svg viewBox="0 0 24 24" fill="#6366f1" style={{ width: '120px', height: '120px' }}>
          <rect x="2" y="6" width="4" height="2.5" rx="1.25" />
          <rect x="1" y="10.75" width="5" height="2.5" rx="1.25" />
          <rect x="0" y="15.5" width="6" height="2.5" rx="1.25" />
          <path fillRule="evenodd" clipRule="evenodd" d="M11 4C9.34315 4 8 5.34315 8 7V17C8 18.6569 9.34315 20 11 20H21C22.6569 20 24 18.6569 24 17V7C24 5.34315 22.6569 4 21 4H11ZM11.4142 7.58579C11.7893 7.21071 12.3978 7.21071 12.7728 7.58579L16 10.8129L19.2272 7.58579C19.6022 7.21071 20.2107 7.21071 20.5858 7.58579C20.9609 7.96086 20.9609 8.56933 20.5858 8.94441L16.6784 12.8518C16.3033 13.2269 15.6967 13.2269 15.3216 12.8518L11.4142 8.94441C11.0391 8.56933 11.0391 7.96086 11.4142 7.58579Z" />
        </svg>
        <div style={{ marginTop: 40, fontSize: 64, fontWeight: 'bold', color: 'white', letterSpacing: '-0.05em' }}>
          AutoMail
        </div>
        <div style={{ marginTop: 10, fontSize: 32, color: '#94a3b8' }}>
          AI-Powered Email Sequences
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

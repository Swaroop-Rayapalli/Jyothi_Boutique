import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 18,
                    background: 'linear-gradient(135deg, #C5A021, #D4AF37)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1F0415',
                    fontWeight: 700,
                    borderRadius: 4,
                    fontFamily: 'sans-serif'
                }}
            >
                JB
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}

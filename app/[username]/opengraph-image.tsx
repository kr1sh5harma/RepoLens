import { ImageResponse } from 'next/og'
import { getUser, getUserRepos } from '@/lib/github'
import { computeArchetype, computeOSImpact } from '@/lib/utils'

export const alt = 'GitGet Developer Profile'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { username: string } }) {
  try {
    const user = await getUser(params.username)
    const repos = await getUserRepos(params.username)

    const archetype = computeArchetype(repos)
    const impact = computeOSImpact(repos)

    // Using absolute URL if needed, but relative usually doesn't work in OG
    const avatarUrl = user.avatar_url

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #000000 100%)',
          }}
        >
          {/* Glowing backdrop shadow */}
          <div
            style={{
              position: 'absolute',
              width: 400,
              height: 400,
              background: 'linear-gradient(to right, #4f46e5, #9333ea)',
              filter: 'blur(100px)',
              opacity: 0.5,
              borderRadius: '50%',
            }}
          />

          {/* The Exact Profile Card Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 350,
              height: 560,
              backgroundColor: '#050505',
              borderRadius: 32,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Background Image Avatar */}
            <img
              src={avatarUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Dark Foggy Gradient Overlay bottom-up */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                backgroundImage: 'linear-gradient(to bottom, rgba(5,5,5,0) 30%, rgba(5,5,5,0.9) 70%, rgba(5,5,5,1) 100%)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 32,
                  color: 'white',
                  fontFamily: 'sans-serif',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                  {user.name || user.login}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8 }}>
                    <path d="M12 2C10.5 2 9.2 2.8 8.5 4C7 4.2 5.8 5.4 5.6 6.9C4.4 7.6 3.6 8.9 3.6 10.4C3.6 11.9 4.4 13.2 5.6 13.9C5.8 15.4 7 16.6 8.5 16.8C9.2 18 10.5 18.8 12 18.8C13.5 18.8 14.8 18 15.5 16.8C17 16.6 18.2 15.4 18.4 13.9C19.6 13.2 20.4 11.9 20.4 10.4C20.4 8.9 19.6 7.6 18.4 6.9C18.2 5.4 17 4.2 15.5 4C14.8 2.8 13.5 2 12 2ZM10.5 14L6.9 10.4L8.3 9L10.5 11.2L16.2 5.5L17.6 6.9L10.5 14Z" fill="#16a34a"/>
                  </svg>
                </div>

                <p style={{ fontSize: 16, color: '#a1a1aa', fontWeight: 500, marginBottom: 24, lineHeight: 1.4 }}>
                  {archetype.desc}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', columnGap: 16, fontSize: 16, fontWeight: 600, color: '#e4e4e7' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      {user.followers}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {impact.totalStars}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 20, fontWeight: 700, fontSize: 14 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>
                    {impact.totalForks}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    )
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}

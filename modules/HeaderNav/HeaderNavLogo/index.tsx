import Link from 'next/link'

const HeaderNavLogo = () => {
  return (
    <>
      <Link href="/" className="flex items-center mb-1">
        <img
          src="/artbot/artbot-logo.png"
          alt="AI ArtBot logo"
          style={{
            height: '30px',
            width: '30px'
          }}
        />
        <div>
          <div className="ml-[4px] pt-2 mb-1 md:mb-[2px] h-8 text-[24px] md:text-[26px] font-bold leading-7 text-teal-500">
            ArtBot
          </div>
        </div>
      </Link>
    </>
  )
}

export default HeaderNavLogo
